import { createFileRoute } from "@tanstack/react-router";
import { OrderTrackerContent } from "@/components/OrderTracker";

const title = "Track Your Order (Done or Cancelled) | WOMANIA Sri Ganganagar";
const description = "Check whether your luxury clothing order is Confirmed, Done, Dispatched, or Cancelled using your phone number or Order ID.";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/track-order" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/track-order" }],
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  return (
    <div className="track-order-page-container section-wrap">
      <OrderTrackerContent />
    </div>
  );
}
