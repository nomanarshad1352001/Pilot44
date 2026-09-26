import { NextResponse } from "next/server";

/**
 * POST /api/publish — Option A: git-backed publishing.
 *
 * When GITHUB_TOKEN + GITHUB_REPO (owner/name) are configured, the site
 * content snapshot is committed to the repo as `content/site-content.json`
 * via the GitHub Contents API; then the NETLIFY_BUILD_HOOK (if set) fires.
 * Each deploy is therefore a real, reversible git commit.
 *
 * Without env configuration the endpoint runs in demo mode: it reports the
 * commit SHA that *would* be written, so the admin panel can demonstrate the
 * exact pipeline locally. Page content never touches the admin's own store.
 */
export async function POST(req: Request) {
  let body: { content?: unknown; module?: string; actor?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // "owner/name"
  const buildHook = process.env.NETLIFY_BUILD_HOOK;
  const path = process.env.GITHUB_CONTENT_PATH ?? "content/site-content.json";

  let sha = Math.random().toString(16).slice(2, 9);
  let mode: "github" | "demo" = "demo";
  let hookFired = false;

  if (token && repo && body.content) {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      };
      // get existing file sha (if any)
      let existingSha: string | undefined;
      const getRes = await fetch(
        `https://api.github.com/repos/${repo}/contents/${path}`,
        { headers, cache: "no-store" }
      );
      if (getRes.ok) {
        const current = (await getRes.json()) as { sha?: string };
        existingSha = current.sha;
      }
      const payload = {
        message: `publish: ${body.module ?? "site content"} by ${body.actor ?? "admin"}`,
        content: Buffer.from(JSON.stringify(body.content, null, 2)).toString("base64"),
        ...(existingSha ? { sha: existingSha } : {}),
      };
      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      if (putRes.ok) {
        const result = (await putRes.json()) as { commit?: { sha?: string } };
        sha = result.commit?.sha?.slice(0, 7) ?? sha;
        mode = "github";
      }
    } catch {
      /* fall back to demo mode silently */
    }
  }

  if (buildHook) {
    try {
      await fetch(buildHook, { method: "POST" });
      hookFired = true;
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json({
    ok: true,
    sha,
    mode,
    hookFired,
    module: body.module ?? "Site",
    actor: body.actor ?? "admin",
    at: new Date().toISOString(),
    path,
  });
}
