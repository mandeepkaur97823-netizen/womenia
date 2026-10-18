import { createFileRoute } from "@tanstack/react-router";
import { ReviewsPage } from "@/components/Site";

const title = "Customer Reviews | WOMANIA Sri Ganganagar";
const description = "Read verified customer reviews and discover WOMANIA’s exceptional rating of 4.9 from 140+ happy shoppers in Sri Ganganagar.";
export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: "/reviews" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: ReviewsPage,
});
