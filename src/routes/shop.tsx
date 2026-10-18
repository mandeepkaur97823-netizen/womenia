import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/Site";

const title = "Shop women’s and girls’ styles | WOMANIA Sri Ganganagar";
const description = "Explore WOMANIA’s women’s and girls’ styles and ask about current availability, sizes and colours on WhatsApp.";
export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: "/shop" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});
