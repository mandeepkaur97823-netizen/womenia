import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/Site";
import { business } from "@/lib/womania";

const title = "WOMANIA | Women’s & Girls’ Western Wear Store in Sri Ganganagar";
const description = "Discover women’s and girls’ western, Indo-Western and Western Indian styles at WOMANIA in Sri Ganganagar. Visit the store or connect with us on WhatsApp.";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({
      "@context": "https://schema.org", "@type": "ClothingStore", name: business.name,
      description: business.type, telephone: "+919877792387",
      address: { "@type": "PostalAddress", streetAddress: "6-L Block, Radheshyam Kothi Road", addressLocality: "Sri Ganganagar", addressRegion: "Rajasthan", postalCode: "335001", addressCountry: "IN" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: business.rating, reviewCount: business.reviewCount },
    }) }],
  }),
  component: HomePage,
});