export const business = {
  name: "WOMANIA",
  type: "Women’s & Girls’ Western Wear Store",
  address: "6-L Block, Radheshyam Kothi Road, Sri Ganganagar, Rajasthan 335001",
  phone: "09877792387",
  whatsapp: "09877792387",
  rating: 4.9,
  reviewCount: 148,
  closingTime: "8:30 PM", // Supplied hours snapshot; not displayed as a standing schedule.
  instagramHandle: "@womaniaofficial",
  instagramFollowers: "14.1K+",
  instagramUrl: null as string | null,
  googleBusinessUrl: null as string | null,
  mapsUrl: null as string | null,
  shippingWorldwide: true, // Supplied social bio; not an independently confirmed website policy.
  codAvailable: false,
  exchangeAvailable: false,
  returnAvailable: false,
  email: null as string | null,
  logoUrl: null as string | null,
  heroImage: null as string | null,
} as const;

export const POLICY_COD = "No COD";
export const POLICY_EXCHANGE = "No Exchange";
export const POLICY_RETURN = "No Return";
export const POLICY_SHIPPING = "Shipping worldwide";
export const SHIPPING_AVAILABLE = true;
export const SHIPPING_SCOPE = "Worldwide";
export const shippingCharges: string | null = null;
export const deliveryTimeline: string | null = null;
export const courierPartner: string | null = null;
export const trackingInformation: string | null = null;
export const freeShippingThreshold: number | null = null;
export const policiesConfirmed = true;

export type Product = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  curationGroup?: "party-couture" | "tailored-chic" | "denim-edit" | "corset-tops" | "handbags" | "eyewear" | null;
  price: number | null;
  salePrice: number | null;
  images: string[];
  sizes: string[] | null;
  colours: string[] | null;
  description: string | null;
  availability: string | null;
  featured: boolean | null;
  newArrival: boolean | null;
};
export const PRODUCT_DATA: Product[] = [
  // 1. Party Couture Edit
  {
    id: "prod-1",
    name: "The Royal Emerald Draped Gown",
    category: "indo-western",
    subcategory: "Evening Couture",
    curationGroup: "party-couture",
    price: 4890,
    salePrice: null,
    images: ["emerald"],
    sizes: ["XS", "S", "M", "L", "Custom"],
    colours: ["Emerald Green", "Champagne Gold", "Royal Wine"],
    description: "Sculpted emerald silk with champagne gold pleated drape & artisanal embroidered bodice.",
    availability: "In Stock · Available for Trial",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-2",
    name: "Pure Ivory Belted Wide-Leg Jumpsuit",
    category: "western-wear",
    subcategory: "Runway Jumpsuits",
    curationGroup: "party-couture",
    price: 3490,
    salePrice: null,
    images: ["introModern"],
    sizes: ["XS", "S", "M", "L"],
    colours: ["Pure Ivory", "Onyx Black"],
    description: "Tailored sleeveless ivory jumpsuit featuring wide-leg trousers, cinched sash tie belt, and clean modern neckline.",
    availability: "In Stock · Flagship Display",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-3",
    name: "Olive Flora Bustier & Cape Set",
    category: "indo-western",
    subcategory: "Fusion Sets",
    curationGroup: "party-couture",
    price: 4290,
    salePrice: null,
    images: ["indo"],
    sizes: ["S", "M", "L"],
    colours: ["Olive Green & Ivory"],
    description: "Zari-embroidered cropped bustier with flowy palazzos and an ivory floral duster cape.",
    availability: "In Stock · Boutique Exclusive",
    featured: true,
    newArrival: false,
  },
  {
    id: "prod-4",
    name: "Asymmetrical Draped Cocktail Jumpsuit",
    category: "western-wear",
    subcategory: "Cocktail Jumpsuits",
    curationGroup: "party-couture",
    price: 3290,
    salePrice: null,
    images: ["introModern"],
    sizes: ["XS", "S", "M", "L"],
    colours: ["Pure Ivory", "Onyx Black"],
    description: "One-shoulder fluid draped jumpsuit with sleek architectural waist cutout & tailored belt.",
    availability: "In Stock",
    featured: true,
    newArrival: true,
  },

  // 2. Tailored Chic
  {
    id: "prod-5",
    name: "Tailored Midnight Power Blazer & Pants",
    category: "western-wear",
    subcategory: "Power Suits",
    curationGroup: "tailored-chic",
    price: 3690,
    salePrice: null,
    images: ["western"],
    sizes: ["S", "M", "L", "XL"],
    colours: ["Midnight Charcoal & Ivory"],
    description: "Structured silhouette with high-waisted pleated wide-leg trousers & gold hardware.",
    availability: "In Stock · Ready to Dispatch",
    featured: true,
    newArrival: false,
  },
  {
    id: "prod-6",
    name: "Blush Pink Polka-Dot Ruffled Organza Dress",
    category: "western-wear",
    subcategory: "Couture Dresses",
    curationGroup: "tailored-chic",
    price: 4290,
    salePrice: null,
    images: ["chicCouture"],
    sizes: ["XS", "S", "M", "L"],
    colours: ["Pastel Blush Pink"],
    description: "Dreamy pastel blush organza dress featuring off-the-shoulder tiered ruffle trims and delicate white polka-dot detailing.",
    availability: "In Stock · Limited Edition",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-7",
    name: "Artisanal Duster & Charcoal Suit",
    category: "western-indian-suits",
    subcategory: "Contemporary Suits",
    curationGroup: "tailored-chic",
    price: 3990,
    salePrice: null,
    images: ["suits"],
    sizes: ["M", "L", "XL", "XXL"],
    colours: ["Charcoal Grey & Beige"],
    description: "Minimalist bustier & trousers layered with an intricately embroidered heritage duster jacket.",
    availability: "In Stock",
    featured: false,
    newArrival: false,
  },

  // 3. Luxury Handbags
  {
    id: "prod-9",
    name: "Sienna Dual-Tone Leather Satchel",
    category: "accessories",
    subcategory: "Designer Handbags",
    curationGroup: "handbags",
    price: 2490,
    salePrice: null,
    images: ["bag"],
    sizes: ["Standard Satchel"],
    colours: ["Cognac / Camel", "Black Noir"],
    description: "Premium calfskin leather with polished monogram gold buckle & curb chain strap.",
    availability: "Limited Stock",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-10",
    name: "Noir Quilted Crossbody Chain Bag",
    category: "accessories",
    subcategory: "Evening Bags",
    curationGroup: "handbags",
    price: 2190,
    salePrice: null,
    images: ["blackQuiltedBag"],
    sizes: ["Compact Crossbody"],
    colours: ["Midnight Black", "Champagne Beige"],
    description: "Plush diamond quilting with gold turn-lock clasp & versatile convertible shoulder chain.",
    availability: "In Stock",
    featured: true,
    newArrival: false,
  },
  {
    id: "prod-11",
    name: "Golden Hour Metallic Evening Clutch",
    category: "accessories",
    subcategory: "Party Clutches",
    curationGroup: "handbags",
    price: 1890,
    salePrice: null,
    images: ["goldenClutch"],
    sizes: ["Minaudière Box"],
    colours: ["Brushed Gold", "Silver Chrome"],
    description: "Hard-shell evening minaudière clutch with crystalline top clasp for cocktail galas.",
    availability: "In Stock",
    featured: false,
    newArrival: true,
  },

  // 4. Designer Eyewear
  {
    id: "prod-12",
    name: "Riviera Amber Cat-Eye Goggles",
    category: "accessories",
    subcategory: "Luxury Eyewear",
    curationGroup: "eyewear",
    price: 1490,
    salePrice: null,
    images: ["sunglasses"],
    sizes: ["One Size"],
    colours: ["Warm Amber", "Smoky Quartz"],
    description: "Gradient amber-tinted lenses, sculpted gold metal frame & UV400 eye protection.",
    availability: "In Stock",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-13",
    name: "Milan Oversized Square Sunglasses",
    category: "accessories",
    subcategory: "Statement Eyewear",
    curationGroup: "eyewear",
    price: 1590,
    salePrice: null,
    images: ["milanSquare"],
    sizes: ["One Size"],
    colours: ["Glossy Obsidian", "Tortoiseshell"],
    description: "Bold geometric silhouette with polarized UV400 dark lenses and gold temple accents.",
    availability: "In Stock",
    featured: true,
    newArrival: false,
  },
  {
    id: "prod-14",
    name: "Venetian Gold Wire Aviators",
    category: "accessories",
    subcategory: "Classic Sunglasses",
    curationGroup: "eyewear",
    price: 1390,
    salePrice: null,
    images: ["goldAviators"],
    sizes: ["One Size"],
    colours: ["Gold / Bronze Tint", "Silver / Grey"],
    description: "Featherlight gold wireframes with teardrop gradient lenses & anti-glare coating.",
    availability: "In Stock",
    featured: false,
    newArrival: true,
  },

  // 5. Jeans & Denim Collection
  {
    id: "prod-15",
    name: "The Palazzo Vintage Wide-Leg Jeans",
    category: "jeans",
    subcategory: "Wide-Leg Denim",
    curationGroup: "denim-edit",
    price: 2490,
    salePrice: null,
    images: ["wideLegJeans"],
    sizes: ["26", "28", "30", "32", "34"],
    colours: ["Vintage Washed Blue", "Light Sky Indigo", "Washed Slate Grey"],
    description: "Ultra high-waisted wide-leg denim with clean tailored seams, premium stretch comfort & vintage wash.",
    availability: "In Stock · Trending",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-16",
    name: "Riviera High-Rise Bootcut Flare Jeans",
    category: "jeans",
    subcategory: "Flared Denim",
    curationGroup: "denim-edit",
    price: 2690,
    salePrice: null,
    images: ["flareJeans"],
    sizes: ["26", "28", "30", "32"],
    colours: ["Dark Indigo", "Classic Navy", "Charcoal Black"],
    description: "Sculpting high-rise waist with elongated bell-bottom flare silhouette and rich contrast stitching.",
    availability: "In Stock",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-17",
    name: "Pop-Art Patch Embroidered Ripped Boyfriend Jeans",
    category: "jeans",
    subcategory: "Distressed Denim",
    curationGroup: "denim-edit",
    price: 2890,
    salePrice: null,
    images: ["cargoJeans"],
    sizes: ["26", "28", "30", "32", "34"],
    colours: ["Vintage Washed Blue", "Light Sky Blue", "Midnight Black"],
    description: "Ankle-length vintage blue boyfriend jeans featuring colorful pop-art embroidered patches, distressed knee rip, and black belt.",
    availability: "In Stock · Limited Edition",
    featured: false,
    newArrival: true,
  },

  // 6. Tops & Corset Edit
  {
    id: "prod-18",
    name: "Emerald Satin Boned Corset Bustier",
    category: "tops",
    subcategory: "Corset Tops",
    curationGroup: "corset-tops",
    price: 2290,
    salePrice: null,
    images: ["corsetTop"],
    sizes: ["XS", "S", "M", "L"],
    colours: ["Emerald Green", "Midnight Black"],
    description: "Sculpted liquid satin boned bustier top with architectural sweetheart neckline and back hook-eye closure.",
    availability: "In Stock · Bestseller",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-19",
    name: "Midnight Black Ribbed Mock-Neck Top",
    category: "tops",
    subcategory: "Fitted Tops",
    curationGroup: "corset-tops",
    price: 1990,
    salePrice: null,
    images: ["organzaTop"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colours: ["Midnight Black", "Off-White Cream"],
    description: "Minimalist fitted mock-neck black top crafted in ultra-soft premium stretch ribbed cotton for layering or evening wear.",
    availability: "In Stock",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-20",
    name: "Sunshine Yellow Cropped Hoodie & Joggers Set",
    category: "western-wear",
    subcategory: "Streetwear Co-ords",
    curationGroup: "corset-tops",
    price: 2790,
    salePrice: null,
    images: ["ribbedTop"],
    sizes: ["S", "M", "L", "XL"],
    colours: ["Sunshine Mustard Yellow", "Onyx Black"],
    description: "Vibrant mustard yellow streetwear co-ord featuring a raw-hem cropped drawstring hoodie and high-waist cuffed joggers.",
    availability: "In Stock · Streetwear Edit",
    featured: false,
    newArrival: true,
  },

  // 7. Western Indian Suits & Sets
  {
    id: "prod-21",
    name: "Icy Mint Chikankari Embroidered Sharara Suit Set",
    category: "western-indian-suits",
    subcategory: "Sharara Suit Sets",
    curationGroup: "tailored-chic",
    price: 4690,
    salePrice: null,
    images: ["silkSuit"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colours: ["Icy Mint Blue"],
    description: "Tiered flared georgette sharara paired with an intricately embroidered Lucknowi chikankari kurti and sheer mukaish dupatta.",
    availability: "In Stock · Boutique Exclusive",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-22",
    name: "Royal Purple & Gold Zari Silk Saree",
    category: "western-indian-suits",
    subcategory: "Festive Silk Sarees",
    curationGroup: "tailored-chic",
    price: 4190,
    salePrice: null,
    images: ["palazzoSuit"],
    sizes: ["Free Size (with 0.8m Blouse Piece)"],
    colours: ["Royal Purple & Gold Zari", "Emerald Green & Gold Zari"],
    description: "Handloom rich purple silk saree adorned with intricate traditional gold zari floral borders, paired with an elegant black velvet blouse.",
    availability: "In Stock · Handloom Silk",
    featured: true,
    newArrival: false,
  },

  // 8. Western Dresses & Runway Co-ords
  {
    id: "prod-23",
    name: "Off-Shoulder White Crop Top & Striped Wide-Leg Co-ord Set",
    category: "western-wear",
    subcategory: "Runway Co-ords",
    curationGroup: "party-couture",
    price: 3990,
    salePrice: null,
    images: ["blazerDress"],
    sizes: ["XS", "S", "M", "L"],
    colours: ["White & Black Stripe", "Classic Onyx Black"],
    description: "Modern street-glam co-ord featuring a clean white off-shoulder folded bardot crop top and high-waisted vertical striped wide-leg trousers.",
    availability: "In Stock · Runway Edition",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-24",
    name: "Plum Off-Shoulder Sculpted Bandage Evening Gown",
    category: "western-wear",
    subcategory: "Cocktail Gowns",
    curationGroup: "party-couture",
    price: 3890,
    salePrice: null,
    images: ["satinDress"],
    sizes: ["XS", "S", "M", "L"],
    colours: ["Plum Wine", "Emerald Green"],
    description: "Figure-hugging sculpted bandage gown in deep plum wine with an off-shoulder folded collar and sleek evening silhouette.",
    availability: "In Stock · Evening Couture",
    featured: true,
    newArrival: true,
  },
];
export const SOCIAL_IMAGES: { src: string; alt: string }[] = [];

export const collections = [
  { id: "jeans", name: "Jeans & Denim", description: "High-waist wide-leg denim, flared bell-bottoms, and pop-art patch boyfriend jeans." },
  { id: "tops", name: "Tops & Corsets", description: "Sculpted boned corset bustiers, minimalist mock-neck tops, and streetwear sets." },
  { id: "western-indian-suits", name: "Suits, Sarees & Sets", description: "Royal purple gold zari silk sarees, chikankari sharara sets, and artisanal duster suits." },
  { id: "western-wear", name: "Western Wear", description: "Ivory wide-leg jumpsuits, off-shoulder co-ord sets, plum bandage gowns, and polka-dot dresses." },
  { id: "indo-western", name: "Indo-Western", description: "Modern fusion draping, emerald saree gowns, bustier co-ords, and festive silhouettes." },
  { id: "accessories", name: "Purses & Goggles", description: "Handpicked luxury calfskin satchels, designer sunglasses, and evening clutches." },
] as const;

export type LookbookItem = {
  id: string;
  name: string;
  category: "western" | "indo-western" | "suits" | "accessories" | "jeans" | "tops";
  categoryLabel: string;
  tag: string;
  description: string;
  imageKey:
    | "emerald"
    | "western"
    | "indo"
    | "suits"
    | "jumpsuit"
    | "bag"
    | "sunglasses"
    | "blackQuiltedBag"
    | "goldenClutch"
    | "milanSquare"
    | "goldAviators"
    | "wideLegJeans"
    | "flareJeans"
    | "cargoJeans"
    | "corsetTop"
    | "organzaTop"
    | "ribbedTop"
    | "silkSuit"
    | "palazzoSuit"
    | "blazerDress"
    | "satinDress";
  span?: "normal" | "featured" | "wide";
};

export const lookbookItems: LookbookItem[] = [
  {
    id: "item-1",
    name: "The Royal Emerald Draped Gown",
    category: "indo-western",
    categoryLabel: "Indo-Western Couture",
    tag: "Signature Edit",
    description: "Sculpted emerald silk with champagne gold pleated drape & artisanal embroidered bodice.",
    imageKey: "emerald",
    span: "featured",
  },
  {
    id: "item-2",
    name: "Tailored Midnight Power Blazer",
    category: "western",
    categoryLabel: "Western Wear",
    tag: "Bestseller",
    description: "Structured silhouette with high-waisted pleated wide-leg trousers & gold hardware.",
    imageKey: "western",
    span: "normal",
  },
  {
    id: "item-3",
    name: "Sienna Dual-Tone Leather Satchel",
    category: "accessories",
    categoryLabel: "Luxury Purses & Handbags",
    tag: "Designer Purse",
    description: "Premium calfskin leather with polished monogram gold buckle & curb chain strap.",
    imageKey: "bag",
    span: "normal",
  },
  {
    id: "item-8",
    name: "Noir Quilted Crossbody Chain Bag",
    category: "accessories",
    categoryLabel: "Evening Purses",
    tag: "Quilted Noir",
    description: "Plush diamond quilting with gold turn-lock clasp & versatile convertible shoulder chain.",
    imageKey: "blackQuiltedBag",
    span: "normal",
  },
  {
    id: "item-9",
    name: "Golden Hour Metallic Evening Clutch",
    category: "accessories",
    categoryLabel: "Party Clutches",
    tag: "Gold Minaudière",
    description: "Hard-shell evening minaudière clutch with crystalline top clasp for cocktail galas.",
    imageKey: "goldenClutch",
    span: "normal",
  },
  {
    id: "item-4",
    name: "Riviera Amber Cat-Eye Goggles",
    category: "accessories",
    categoryLabel: "Designer Eyewear",
    tag: "UV400 Goggles",
    description: "Gradient amber-tinted lenses, sculpted gold metal frame & statement Italian Riviera style.",
    imageKey: "sunglasses",
    span: "normal",
  },
  {
    id: "item-10",
    name: "Milan Oversized Square Sunglasses",
    category: "accessories",
    categoryLabel: "Statement Shades",
    tag: "Square Goggles",
    description: "Bold geometric silhouette with polarized UV400 dark lenses and gold temple accents.",
    imageKey: "milanSquare",
    span: "normal",
  },
  {
    id: "item-11",
    name: "Venetian Gold Wire Aviators",
    category: "accessories",
    categoryLabel: "Classic Sunglasses",
    tag: "Gold Aviator",
    description: "Featherlight gold wireframes with teardrop gradient lenses & anti-glare coating.",
    imageKey: "goldAviators",
    span: "normal",
  },
  {
    id: "item-5",
    name: "Olive Flora Bustier & Cape Set",
    category: "indo-western",
    categoryLabel: "Indo-Western Fusion",
    tag: "Festive Edit",
    description: "Zari-embroidered cropped bustier with flowy palazzos and an ivory floral duster cape.",
    imageKey: "indo",
    span: "normal",
  },
  {
    id: "item-6",
    name: "Artisanal Duster & Charcoal Suit",
    category: "suits",
    categoryLabel: "Western Indian Suits",
    tag: "Contemporary Ethnic",
    description: "Minimalist bustier & trousers layered with an intricately embroidered heritage duster jacket.",
    imageKey: "suits",
    span: "normal",
  },
  {
    id: "item-7",
    name: "Asymmetrical Draped Jumpsuit",
    category: "western",
    categoryLabel: "Modern Western",
    tag: "Evening Glamour",
    description: "One-shoulder fluid draped jumpsuit with sleek architectural waist cutout.",
    imageKey: "jumpsuit",
    span: "normal",
  },
  {
    id: "item-12",
    name: "The Palazzo Vintage Wide-Leg Jeans",
    category: "jeans",
    categoryLabel: "Designer Denim",
    tag: "Trending Denim",
    description: "Ultra high-waisted wide-leg denim with clean tailored seams & vintage wash.",
    imageKey: "wideLegJeans",
    span: "featured",
  },
  {
    id: "item-13",
    name: "Riviera High-Rise Bootcut Flare Jeans",
    category: "jeans",
    categoryLabel: "Flared Denim",
    tag: "Retro Chic",
    description: "Sculpting high-rise waist with elongated bell-bottom flare silhouette.",
    imageKey: "flareJeans",
    span: "normal",
  },
  {
    id: "item-14",
    name: "Emerald Satin Boned Corset Bustier",
    category: "tops",
    categoryLabel: "Luxe Corsets",
    tag: "Couture Top",
    description: "Sculpted liquid satin boned bustier top with sweetheart neckline.",
    imageKey: "corsetTop",
    span: "featured",
  },
  {
    id: "item-15",
    name: "Midnight Black Ribbed Mock-Neck Top",
    category: "tops",
    categoryLabel: "Fitted Tops",
    tag: "Ribbed Edit",
    description: "Minimalist fitted mock-neck black top in ultra-soft premium stretch ribbed cotton.",
    imageKey: "organzaTop",
    span: "normal",
  },
  {
    id: "item-16",
    name: "Icy Mint Chikankari Sharara Suit Set",
    category: "suits",
    categoryLabel: "Sharara Sets",
    tag: "Chikankari Silk",
    description: "Lucknowi chikankari kurti with tiered flared sharara and sheer mukaish dupatta.",
    imageKey: "silkSuit",
    span: "normal",
  },
  {
    id: "item-17",
    name: "Royal Purple & Gold Zari Silk Saree",
    category: "suits",
    categoryLabel: "Festive Silk Sarees",
    tag: "Handloom Saree",
    description: "Handloom purple silk saree with rich traditional gold zari floral borders & velvet blouse.",
    imageKey: "palazzoSuit",
    span: "normal",
  },
  {
    id: "item-18",
    name: "Off-Shoulder White Crop Top & Striped Co-ord",
    category: "western",
    categoryLabel: "Runway Co-ords",
    tag: "Streetwear Glam",
    description: "White folded off-shoulder crop top paired with high-waisted monochrome striped wide-leg trousers.",
    imageKey: "blazerDress",
    span: "normal",
  },
  {
    id: "item-19",
    name: "Plum Off-Shoulder Sculpted Bandage Gown",
    category: "western",
    categoryLabel: "Cocktail Gowns",
    tag: "Evening Couture",
    description: "Figure-hugging sculpted bandage gown in deep plum wine with an off-shoulder folded collar.",
    imageKey: "satinDress",
    span: "normal",
  },
  {
    id: "item-20",
    name: "Pop-Art Patch Embroidered Boyfriend Jeans",
    category: "jeans",
    categoryLabel: "Distressed Denim",
    tag: "Pop Art Edit",
    description: "Vintage blue boyfriend jeans featuring colorful pop-art patches and knee rip distress.",
    imageKey: "cargoJeans",
    span: "normal",
  },
  {
    id: "item-21",
    name: "Sunshine Yellow Cropped Hoodie & Joggers Set",
    category: "western",
    categoryLabel: "Streetwear Co-ords",
    tag: "Casual Luxury",
    description: "Vibrant mustard yellow cropped drawstring hoodie and high-waist cuffed joggers.",
    imageKey: "ribbedTop",
    span: "normal",
  },
];

export type CustomerReview = {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
};

export const customerReviews: CustomerReview[] = [
  {
    id: "rev-1",
    name: "Simran Kaur",
    location: "Sri Ganganagar",
    rating: 5,
    date: "1 week ago",
    comment: "Found the most gorgeous Indo-Western coord set for my sister's reception! The fabric quality and modern cut are unmatched in Sri Ganganagar. Highly recommended!",
    verified: true,
  },
  {
    id: "rev-2",
    name: "Pooja Sharma",
    location: "Sri Ganganagar",
    rating: 5,
    date: "2 weeks ago",
    comment: "Best western wear collection for women and girls. The fitting is perfect and their latest party wear designs feel like high-end designer pieces. Very courteous staff!",
    verified: true,
  },
  {
    id: "rev-3",
    name: "Navpreet Gill",
    location: "Model Town, Sri Ganganagar",
    rating: 5,
    date: "3 weeks ago",
    comment: "Superb variety of western dresses and western Indian suits. Finally a boutique that brings trendy metropolitan fashion to our city without compromising on fabric quality.",
    verified: true,
  },
  {
    id: "rev-4",
    name: "Ananya Verma",
    location: "Sri Ganganagar",
    rating: 5,
    date: "1 month ago",
    comment: "Loved their party wear collection! Everything is so elegant, premium, and unique. I always get compliments whenever I wear WOMANIA outfits.",
    verified: true,
  },
  {
    id: "rev-5",
    name: "Ritu Arora",
    location: "Sri Ganganagar",
    rating: 5,
    date: "1 month ago",
    comment: "Extremely chic collection! The staff helped me pick the right size and style patiently. Definitely my go-to boutique now for every event.",
    verified: true,
  },
  {
    id: "rev-6",
    name: "Harpreet Dhillon",
    location: "Abohar",
    rating: 5,
    date: "2 months ago",
    comment: "Traveled from Abohar specifically for WOMANIA after seeing their designs. Totally worth every visit! Premium fabrics and reasonable pricing.",
    verified: true,
  },
];

export const reviews = customerReviews.map(r => r.comment);

export const whatsappHref = (productName?: string) => {
  const message = productName
    ? `Hi WOMANIA, I’m interested in ${productName}. Please share availability, sizes, colours and price.`
    : "Hi WOMANIA, I’d like to know more about your latest women’s and girls’ collections.";
  return `https://wa.me/91${business.whatsapp.slice(-10)}?text=${encodeURIComponent(message)}`;
};
export const directionsHref = business.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`;
export const phoneHref = `tel:+91${business.phone.slice(-10)}`;