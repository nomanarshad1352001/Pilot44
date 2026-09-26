"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, Star, ArrowLeft, ImageIcon, Send } from "lucide-react";
import type { Post, PostStatus, SiteContent } from "@/data/content";
import { categoriesInUse, formatDate, slugify } from "@/data/content";
import { useAuth } from "@/lib/store";
import { Field, Text, Area, LinesArea, Select, Toggle } from "@/components/admin/fields";

export function PostsEditor({
  draft,
  update,
  quickAction,
}: {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => void) => void;
  quickAction?: { id: string; token: number } | null;
}) {
  const { session } = useAuth();
  const isAuthor = false;
  const canPublish = true;

  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");

  // Authors only see their own posts; editors/super see everything.
  const visiblePosts = useMemo(() => {
    if (isAuthor) return draft.posts.filter((p) => p.owner === session?.email);
    return draft.posts;
  }, [draft.posts, isAuthor, session?.email]);

  const categories = useMemo(() => categoriesInUse(draft.posts), [draft.posts]);
  const q = query.trim().toLowerCase();
  const filtered = visiblePosts.filter((p) => {
    const inQuery = !q || [p.title, p.category, p.author].some((f) => f.toLowerCase().includes(q));
    const inStatus = statusFilter === "all" || (p.status ?? "published") === statusFilter;
    return inQuery && inStatus;
  });
  const post = draft.posts.find((p) => p.slug === selected) ?? null;

  const patchPost = (slug: string, patch: Partial<Post>) =>
    update((d) => {
      const i = d.posts.findIndex((p) => p.slug === slug);
      if (i >= 0)
        d.posts[i] = {
          ...d.posts[i],
          ...patch,
          updatedDate: new Date().toISOString().slice(0, 10),
        };
    });

  const createPost = () => {
    const slug = `draft-${Date.now().toString(36)}`;
    const newPost: Post = {
      slug,
      title: "Untitled insight",
      excerpt: "A one-sentence summary that appears on cards and search results.",
      category: categories[0] ?? "Trends",
      author: session?.name ?? "Studio Team",
      authorRole: "Pilot44",
      readTime: "5 min",
      date: new Date().toISOString().slice(0, 10),
      image:
        "https://images.pexels.com/photos/9086767/pexels-photo-9086767.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      featured: false,
      status: "draft",
      owner: session?.email,
      body: [
        "Write the opening paragraph here.",
        "## Add an H2 subheading like this",
        "Then continue with body paragraphs — one per line.",
      ],
    };
    update((d) => {
      d.posts.unshift(newPost);
    });
    setSelected(slug);
  };

  const deletePost = (slug: string) => {
    update((d) => {
      d.posts = d.posts.filter((p) => p.slug !== slug);
    });
    setSelected(null);
  };

  /* Cmd+K quick action: jump straight into a fresh draft */
  useEffect(() => {
    if (quickAction?.id === "new-post") createPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickAction?.token]);

  const statusStyles: Record<PostStatus, string> = {
    published: "bg-emerald-400/15 text-emerald-700",
    draft: "bg-ink/[0.08] text-ink/50",
    review: "bg-gold/15 text-gold",
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(300px,400px)_1fr]">
      {/* list */}
      <div className={`${post ? "hidden lg:block" : ""}`}>
        {isAuthor && (
          <p className="mb-4 rounded-xl border border-gold/25 bg-gold/[0.05] px-4 py-3 text-[0.68rem] leading-relaxed text-gold/90">
            You&apos;re signed in as an Author — you can draft and submit for review. An Editor or Super Admin
            publishes.
          </p>
        )}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search insights…"
              className="field-input !pl-10"
            />
          </div>
          <button
            onClick={createPost}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-4 py-2.5 text-[0.68rem] font-semibold text-white hover:bg-gold-soft"
          >
            <Plus size={13} /> New
          </button>
        </div>

        <div className="mb-4 flex gap-1.5">
          {(["all", "published", "review", "draft"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] transition-colors ${
                statusFilter === s ? "bg-bone text-ink" : "border border-ink/15 text-ink/45 hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {filtered.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelected(p.slug)}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                selected === p.slug
                  ? "border-gold/60 bg-gold/[0.07]"
                  : "border-ink/[0.08] bg-white/60 hover:border-ink/25"
              }`}
            >
              <div className="flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.14em]">
                <span className="text-gold">{p.category}</span>
                {p.featured && <Star size={10} className="fill-gold text-gold" />}
                <span className={`ml-auto rounded-full px-2 py-0.5 ${statusStyles[p.status ?? "published"]}`}>
                  {p.status ?? "published"}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 font-display text-[0.95rem] leading-snug text-ink">{p.title}</p>
              <p className="mt-1.5 text-[0.65rem] text-ink/30">
                {p.author} · {formatDate(p.date)}
              </p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="rounded-xl border border-dashed border-ink/15 p-8 text-center text-xs text-ink/35">
              {isAuthor ? "You haven't drafted anything yet — hit New to start." : "No insights match."}
            </p>
          )}
        </div>
      </div>

      {/* form */}
      <AnimatePresence mode="wait">
        {post ? (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-ink/[0.08] bg-white/70 p-6 md:p-8"
          >
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-1.5 text-xs text-ink/50 hover:text-gold lg:hidden"
              >
                <ArrowLeft size={13} /> All insights
              </button>
              <p className="hidden font-mono2 text-[0.65rem] text-ink/35 lg:block">/insights/{post.slug}</p>
              <div className="flex flex-wrap items-center gap-3">
                {isAuthor && (post.status === "draft" || !post.status) && (
                  <button
                    onClick={() => patchPost(post.slug, { status: "review" })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-[0.65rem] font-semibold text-white hover:bg-gold-soft"
                  >
                    <Send size={11} /> Submit for review
                  </button>
                )}
                {canPublish && (
                  <Select
                    value={post.status ?? "published"}
                    onChange={(v) => patchPost(post.slug, { status: v as PostStatus })}
                    options={[
                      { value: "published", label: "● Published" },
                      { value: "review", label: "◐ In review" },
                      { value: "draft", label: "○ Draft" },
                    ]}
                  />
                )}
                <Toggle
                  checked={post.featured}
                  onChange={(v) => patchPost(post.slug, { featured: v })}
                  label="Featured"
                />
                <button
                  onClick={() => deletePost(post.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-3.5 py-2 text-[0.65rem] font-semibold text-red-600 transition-colors hover:bg-red-400/10"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field label="Title">
                  <Text value={post.title} onChange={(v) => patchPost(post.slug, { title: v })} />
                </Field>
              </div>
              <Field label="Slug" hint="URL: /insights/{slug}. Auto-slugged when you type it manually.">
                <Text value={post.slug} onChange={(v) => patchPost(post.slug, { slug: slugify(v) })} />
              </Field>
              <Field label="Category">
                <Select
                  value={categories.includes(post.category) ? post.category : "__custom__"}
                  onChange={(v) => patchPost(post.slug, { category: v === "__custom__" ? post.category : v })}
                  options={[
                    ...categories.map((c) => ({ value: c, label: c })),
                    { value: "__custom__", label: "Custom…" },
                  ]}
                />
              </Field>
              {!categories.includes(post.category) && (
                <Field label="Custom category">
                  <Text value={post.category} onChange={(v) => patchPost(post.slug, { category: v })} />
                </Field>
              )}
              <Field label="Author" hint="Linked to an author page when the name matches an author profile.">
                <Select
                  value={draft.authors.some((a) => a.name === post.author) ? post.author : "__custom__"}
                  onChange={(v) => {
                    if (v !== "__custom__") {
                      const a = draft.authors.find((x) => x.name === v);
                      patchPost(post.slug, { author: v, authorRole: a?.role ?? post.authorRole });
                    }
                  }}
                  options={[
                    ...draft.authors.map((a) => ({ value: a.name, label: `${a.name} — ${a.role}` })),
                    { value: "__custom__", label: "Custom byline…" },
                  ]}
                />
              </Field>
              {!draft.authors.some((a) => a.name === post.author) && (
                <Field label="Byline name">
                  <Text value={post.author} onChange={(v) => patchPost(post.slug, { author: v })} />
                </Field>
              )}
              <Field label="Read time">
                <Text value={post.readTime} onChange={(v) => patchPost(post.slug, { readTime: v })} />
              </Field>
              <Field label="Publish date" hint="Set a future date to schedule.">
                <input
                  type="date"
                  value={post.date}
                  onChange={(e) => patchPost(post.slug, { date: e.target.value })}
                  className="field-input [color-scheme:dark]"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Cover image URL" hint="Paste a URL from the Media Library or any hosted image.">
                  <div className="grid gap-4 md:grid-cols-[1fr_180px]">
                    <Text value={post.image} onChange={(v) => patchPost(post.slug, { image: v })} />
                    <div className="img-frame aspect-video overflow-hidden rounded-lg border border-ink/10 bg-ink">
                      {post.image ? (
                        <img src={post.image} alt="Cover preview" className="size-full object-cover" />
                      ) : (
                        <span className="grid size-full place-items-center text-ink/25">
                          <ImageIcon size={18} />
                        </span>
                      )}
                    </div>
                  </div>
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Excerpt" hint="Shown on cards, search results and as the article standfirst.">
                  <Area rows={3} value={post.excerpt} onChange={(v) => patchPost(post.slug, { excerpt: v })} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field
                  label="Article body"
                  hint="One paragraph per line. Start a line with ## for an H2 subheading, ### for H3 — this keeps the semantic structure AI-search-ready."
                >
                  <LinesArea
                    rows={12}
                    value={post.body}
                    onChange={(v) => patchPost(post.slug, { body: v })}
                    hint="One paragraph per line · '## H2 heading' · '### H3 heading'"
                  />
                </Field>
              </div>

              {/* seo */}
              <div className="md:col-span-2 rounded-xl border border-gold/25 bg-gold/[0.04] p-5">
                <p className="eyebrow !text-[0.58rem] text-gold">SEO & JSON-LD</p>
                <p className="mt-2 text-[0.65rem] leading-relaxed text-ink/40">
                  Overrides feed the page title, meta description and Article structured data. Updating any
                  field automatically stamps the post as updated today.
                </p>
                <div className="mt-5 grid gap-5">
                  <Field label="SEO title">
                    <Text
                      value={post.seo?.title ?? ""}
                      onChange={(v) => patchPost(post.slug, { seo: { ...post.seo, title: v } })}
                      placeholder={post.title}
                    />
                  </Field>
                  <Field label="Meta description">
                    <Area
                      rows={2}
                      value={post.seo?.description ?? ""}
                      onChange={(v) => patchPost(post.slug, { seo: { ...post.seo, description: v } })}
                      placeholder={post.excerpt}
                    />
                  </Field>
                  {post.updatedDate && (
                    <p className="text-[0.65rem] text-ink/35">
                      Last updated <span className="text-gold">{formatDate(post.updatedDate)}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden min-h-[420px] place-items-center rounded-2xl border border-dashed border-ink/12 lg:grid"
          >
            <div className="text-center">
              <p className="font-display text-xl font-light text-ink/50">Select an insight to edit</p>
              <p className="mt-2 text-xs text-ink/30">or create a new one with the button above.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
