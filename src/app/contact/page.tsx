import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us where you want to grow. Start a conversation with the Pilot44 studio.",
};

export default function Contact() {
  return <ContactPage />;
}
