import { createFileRoute } from "@tanstack/react-router";
import { CollectionsPage } from "@/components/Site";

const title = "Collections | WOMANIA Sri Ganganagar";
const description = "Discover Designer Jeans, Luxe Tops & Corsets, Western Indian Suits, Party Dresses, and Luxury Accessories at WOMANIA in Sri Ganganagar.";
export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: "/collections" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: CollectionsPage,
});
