import { createFileRoute } from "@tanstack/react-router";
import { GalleryPage } from "@/components/Site";

const title = "Gallery | WOMANIA Sri Ganganagar";
const description = "Explore an illustrative fashion editorial introducing the WOMANIA aesthetic.";
export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: "/gallery" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});
