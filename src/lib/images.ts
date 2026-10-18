import heroAesthetic from "@/assets/womania-hero-aesthetic.jpg";
import heroJumpsuit from "@/assets/womania-hero.jpg";
import western from "@/assets/womania-western.jpg";
import indo from "@/assets/womania-indo.jpg";
import suits from "@/assets/womania-suits.jpg";
import bag from "@/assets/womania-bag.jpg";
import sunglasses from "@/assets/womania-sunglasses.jpg";
import introModern from "@/assets/womania-intro-modern.jpg";
import chicCouture from "@/assets/womania-chic-couture.jpg";
import blackQuiltedBag from "@/assets/womania-black-quilted-bag.jpg";
import goldenClutch from "@/assets/womania-golden-clutch.jpg";
import milanSquare from "@/assets/womania-milan-square.jpg";
import goldAviators from "@/assets/womania-gold-aviators.jpg";

import wideLegJeans from "@/assets/womania-wideleg-jeans.jpg";
import flareJeans from "@/assets/womania-flare-jeans.jpg";
import cargoJeans from "@/assets/womania-cargo-jeans.jpg";
import corsetTop from "@/assets/womania-corset-top.jpg";
import organzaTop from "@/assets/womania-organza-top.jpg";
import ribbedTop from "@/assets/womania-ribbed-top.jpg";
import silkSuit from "@/assets/womania-silk-suit.jpg";
import palazzoSuit from "@/assets/womania-palazzo-suit.jpg";
import blazerDress from "@/assets/womania-blazer-dress.jpg";
import satinDress from "@/assets/womania-satin-dress.jpg";

export const imageMap: Record<string, string> = {
  emerald: heroAesthetic,
  western: western,
  indo: indo,
  suits: suits,
  jumpsuit: heroJumpsuit,
  bag: bag,
  sunglasses: sunglasses,
  introModern: introModern,
  chicCouture: chicCouture,
  blackQuiltedBag: blackQuiltedBag,
  goldenClutch: goldenClutch,
  milanSquare: milanSquare,
  goldAviators: goldAviators,
  wideLegJeans: wideLegJeans,
  flareJeans: flareJeans,
  cargoJeans: cargoJeans,
  corsetTop: corsetTop,
  organzaTop: organzaTop,
  ribbedTop: ribbedTop,
  silkSuit: silkSuit,
  palazzoSuit: palazzoSuit,
  blazerDress: blazerDress,
  satinDress: satinDress,
};

export function getProductImage(key?: string): string {
  if (!key) return western;
  return imageMap[key] || western;
}
