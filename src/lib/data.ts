import ageBabies from "@/assets/age-babies.jpg";
import ageToddlers from "@/assets/age-toddlers.jpg";
import ageKids from "@/assets/age-kids.jpg";
import ageTeens from "@/assets/age-teens.jpg";

export type AgeGroup = "babies" | "toddlers" | "boys" | "girls" | "teenagers";
export type Gender = "boys" | "girls" | "unisex";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;         // in NGN
  compareAt?: number;
  category: string;      // category slug
  categoryName: string;
  ageGroups: AgeGroup[];
  gender: Gender;
  brand: string;
  colors: string[];      // hex-ish or names
  sizes: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  onSale?: boolean;
  tileVariant: 1 | 2 | 3 | 4 | 5 | 6;
  emoji: string;
  image: string;
  images?: string[]; // optional additional gallery images
  description: string;
  createdAt: string;
}

// Highly product-focused Flickr tag sets — biased toward flatlay/product
// photography and clothing keywords so results actually match the category.
const categoryTags: Record<string, string> = {
  "baby-wear": "baby,clothing,onesie,flatlay",
  "school-wear": "school,uniform,shirt,child",
  "shoes": "kids,sneakers,shoe,flatlay",
  "sandals": "children,sandals,summer,shoe",
  "socks": "socks,pattern,pair,colorful",
  "toys": "toy,plush,children,cute",
  "bags": "backpack,school,kids,bag",
  "accessories": "bow,accessory,hair,children",
  "birthday-clothes": "birthday,outfit,child,dress",
  "party-dresses": "girl,dress,tulle,party",
};

export const productImage = (
  seed: string | number,
  variant = 0,
  categoryOrTag = "kids,clothing,fashion",
  w = 800,
  h = 1000,
) => {
  const tag = categoryTags[categoryOrTag as string] ?? categoryOrTag;
  const lock = `${seed}-${variant}`.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return `https://loremflickr.com/${w}/${h}/${encodeURIComponent(tag)}?lock=${lock}`;
};

// Age-tile hero images — curated AI-generated portraits per stage.
export const ageImage = (age: AgeGroup) => {
  switch (age) {
    case "babies": return ageBabies;
    case "toddlers": return ageToddlers;
    case "girls":
    case "boys": return ageKids;
    case "teenagers": return ageTeens;
  }
};

export const categories = [
  { slug: "baby-wear", name: "Baby Wear", emoji: "👶", blurb: "Snuggly essentials for 0–24 months" },
  { slug: "school-wear", name: "School Wear", emoji: "🎒", blurb: "Uniforms, shirts, pinafores & more" },
  { slug: "shoes", name: "Shoes", emoji: "👟", blurb: "Sneakers, school shoes, boots" },
  { slug: "sandals", name: "Sandals", emoji: "🩴", blurb: "Breezy summer favourites" },
  { slug: "socks", name: "Socks", emoji: "🧦", blurb: "Everyday & fun patterns" },
  { slug: "toys", name: "Toys", emoji: "🧸", blurb: "Play, learn, imagine" },
  { slug: "bags", name: "Bags", emoji: "🎒", blurb: "Backpacks & lunch bags" },
  { slug: "accessories", name: "Accessories", emoji: "🎀", blurb: "Hats, bows, belts" },
  { slug: "birthday-clothes", name: "Birthday Clothes", emoji: "🎂", blurb: "Make the big day special" },
  { slug: "party-dresses", name: "Party Dresses", emoji: "👗", blurb: "Twirl-worthy pieces" },
];

const brands = ["Little Lark", "Cocorose", "Tiny Threads", "MiniMode", "SunnySide"];
const colorSets = [
  ["#F6C6B0", "#B7DCEB", "#F4E285"],
  ["#E9A1A6", "#C7D9F0", "#EED7A1"],
  ["#F5B7B1", "#AED6F1", "#F9E79F"],
  ["#F1948A", "#85C1E9", "#F7DC6F"],
];
const sizeSets = {
  clothing: ["0-3m", "3-6m", "6-12m", "1-2y", "3-4y", "5-6y", "7-8y", "9-10y", "11-12y"],
  shoes: ["22", "24", "26", "28", "30", "32", "34", "36"],
  socks: ["S", "M", "L"],
};

function make(
  i: number,
  name: string,
  category: string,
  categoryName: string,
  price: number,
  emoji: string,
  ageGroups: AgeGroup[],
  gender: Gender,
  opts: Partial<Product> = {},
): Product {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const daysAgo = (i * 3) % 60;
  const isNew = daysAgo < 14;
  const onSale = i % 4 === 0;
  const id = `p-${i}`;
  return {
    id,
    name,
    slug: `${slug}-${i}`,
    price,
    compareAt: onSale ? Math.round(price * 1.35) : undefined,
    category,
    categoryName,
    ageGroups,
    gender,
    brand: brands[i % brands.length],
    colors: colorSets[i % colorSets.length],
    sizes:
      category === "shoes" || category === "sandals"
        ? sizeSets.shoes
        : category === "socks"
          ? sizeSets.socks
          : sizeSets.clothing,
    stock: (i * 7) % 20 === 0 ? 3 : ((i * 11) % 45) + 5,
    rating: 4 + ((i % 10) / 10),
    reviewCount: 12 + (i * 7) % 240,
    isNew,
    isBestSeller: i % 5 === 0,
    onSale,
    tileVariant: (((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6),
    emoji,
    image: productImage(id, 0, category),
    images: [productImage(id, 1, category), productImage(id, 2, category), productImage(id, 3, category)],
    description:
      "Crafted from breathable, skin-friendly fabric with reinforced stitching. Machine washable and made to last through play, school and every twirl in between.",
    createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    ...opts,
  };
}

export const products: Product[] = [
  make(1, "Peach Ruffle Sundress", "party-dresses", "Party Dresses", 12500, "👗", ["toddlers", "girls"], "girls"),
  make(2, "Sky Linen Button Shirt", "baby-wear", "Baby Wear", 8900, "👕", ["toddlers", "boys"], "boys"),
  make(3, "Cloud Sneaker — Pink", "shoes", "Shoes", 14500, "👟", ["girls", "toddlers"], "girls"),
  make(4, "Navy Pinafore Set", "school-wear", "School Wear", 15900, "🎒", ["girls"], "girls"),
  make(5, "White Oxford School Shirt", "school-wear", "School Wear", 6800, "👔", ["boys", "girls"], "unisex"),
  make(6, "Rainbow Ankle Socks (5-pack)", "socks", "Socks", 4500, "🧦", ["babies", "toddlers", "boys", "girls"], "unisex"),
  make(7, "Soft Bear Plushie", "toys", "Toys", 9900, "🧸", ["babies", "toddlers"], "unisex"),
  make(8, "Coral Party Tulle Dress", "birthday-clothes", "Birthday Clothes", 18500, "🎂", ["girls"], "girls"),
  make(9, "Chambray Explorer Shorts", "baby-wear", "Baby Wear", 7500, "🩳", ["toddlers", "boys"], "boys"),
  make(10, "Buttercup Summer Romper", "baby-wear", "Baby Wear", 8200, "👶", ["babies"], "unisex"),
  make(11, "Classic Leather School Shoe", "shoes", "Shoes", 17800, "👞", ["boys", "girls"], "unisex"),
  make(12, "Sunny Straw Hat", "accessories", "Accessories", 5900, "👒", ["toddlers", "girls"], "girls"),
  make(13, "Peach Bow Hair Clip Set", "accessories", "Accessories", 3200, "🎀", ["toddlers", "girls"], "girls"),
  make(14, "Explorer Backpack — Sky", "bags", "Bags", 13500, "🎒", ["boys", "girls"], "unisex"),
  make(15, "Beach Day Sandals", "sandals", "Sandals", 7900, "🩴", ["toddlers", "boys", "girls"], "unisex"),
  make(16, "Denim Overall — Mini", "baby-wear", "Baby Wear", 11500, "👖", ["babies", "toddlers"], "unisex"),
  make(17, "Teen Graphic Tee — Sunset", "baby-wear", "Baby Wear", 6500, "👕", ["teenagers"], "unisex"),
  make(18, "Ballerina Party Flats", "shoes", "Shoes", 12900, "🥿", ["girls"], "girls"),
  make(19, "Wooden Rainbow Stacker", "toys", "Toys", 8500, "🌈", ["babies", "toddlers"], "unisex"),
  make(20, "Cotton Pajama Set — Cloud", "baby-wear", "Baby Wear", 9800, "🌙", ["toddlers", "boys", "girls"], "unisex"),
  make(21, "Coral Birthday Suit", "birthday-clothes", "Birthday Clothes", 16500, "🎉", ["boys"], "boys"),
  make(22, "Puffy Tulle Princess Dress", "party-dresses", "Party Dresses", 21000, "👑", ["girls"], "girls"),
  make(23, "Lightweight Rain Boots", "shoes", "Shoes", 11200, "🥾", ["toddlers", "boys", "girls"], "unisex"),
  make(24, "Fluffy Slipper Bunnies", "shoes", "Shoes", 5800, "🐰", ["toddlers", "girls"], "girls"),
];

export const findProduct = (id: string) => products.find((p) => p.id === id || p.slug === id);

export const reviews = [
  { name: "Amina O.", city: "Lagos", rating: 5, text: "Absolutely gorgeous fabric and it fits my daughter perfectly. Delivery was quick.", avatar: "https://i.pravatar.cc/150?img=47" },
  { name: "Chinedu K.", city: "Abuja", rating: 5, text: "My son loves his new sneakers. The colours are even nicer in person.", avatar: "https://i.pravatar.cc/150?img=12" },
  { name: "Tolu A.", city: "Ibadan", rating: 4, text: "Beautiful packaging, feels premium. Slightly ran small — sized up and it's perfect.", avatar: "https://i.pravatar.cc/150?img=32" },
  { name: "Ngozi P.", city: "Port Harcourt", rating: 5, text: "Best kids store I've shopped at online. Will be back for the birthday collection.", avatar: "https://i.pravatar.cc/150?img=45" },
];

export const faqs = [
  { q: "What are your delivery times?", a: "Lagos: 1–2 business days. Other Nigerian cities: 2–5 business days. International: 7–14 days." },
  { q: "How do returns work?", a: "You have 14 days to return unworn items in original packaging. Refunds are processed within 5 business days." },
  { q: "What payment methods do you accept?", a: "Paystack (card, USSD, bank transfer), Flutterwave, direct bank transfer, and pay on delivery in select cities." },
  { q: "How do I know what size to order?", a: "See our interactive Size Guide on every product page. When in doubt, size up — kids grow fast!" },
  { q: "Do you offer bulk school uniforms?", a: "Yes. Use our School Uniform Requests form to get a custom quote for schools or parent groups." },
  { q: "How can I track my order?", a: "Enter your order number on the Track Order page or click the link in your confirmation email." },
];

export const orderStages = ["Processing", "Packed", "Shipped", "Delivered"] as const;