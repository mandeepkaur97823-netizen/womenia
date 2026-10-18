import { createFileRoute } from "@tanstack/react-router";
import { FAQPage } from "@/components/Site";

const title = "Frequently Asked Questions | WOMANIA Sri Ganganagar";
const description = "Find WOMANIA’s address, contact details and how to ask about product availability.";
export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: "/faq" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FAQPage,
});
