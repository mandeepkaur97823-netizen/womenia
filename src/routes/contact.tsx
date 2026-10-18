import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/Site";

const title = "Contact & Visit | WOMANIA Sri Ganganagar";
const description = "Contact WOMANIA on WhatsApp or find the store at 6-L Block, Radheshyam Kothi Road, Sri Ganganagar.";
export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});
