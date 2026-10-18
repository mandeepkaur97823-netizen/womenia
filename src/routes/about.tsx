import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/Site";

const title = "About WOMANIA | WOMANIA Sri Ganganagar";
const description = "Get to know WOMANIA, a women’s and girls’ western wear store in Sri Ganganagar, Rajasthan.";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});
