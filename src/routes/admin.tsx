import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/Admin";

const title = "WOMANIA Admin Portal | Store Orders & Analytics";
const description = "Private administration dashboard for WOMANIA boutique. View store visitors, clothes orders, and customer enquiries.";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});
