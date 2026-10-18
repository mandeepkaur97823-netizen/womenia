import { createFileRoute } from "@tanstack/react-router";
import { PoliciesPage } from "@/components/Site";

const title = "Shopping Policies | WOMANIA Sri Ganganagar";
const description = "Contact WOMANIA to confirm the current shipping, cash on delivery, exchange and return policies.";
export const Route = createFileRoute("/policies")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: "/policies" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/policies" }],
  }),
  component: PoliciesPage,
});
