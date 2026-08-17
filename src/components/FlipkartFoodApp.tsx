"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Baby, Bike, BookOpen, Car, Check, CheckCircle2, ChevronDown, ChevronLeft,
  ChevronRight, Clock, Dumbbell, Heart, Home, MapPin, Minus, MoreHorizontal,
  Plane, Plus, Search, Share2, ShoppingBasket, ShoppingCart, Smartphone, Sofa,
  Sparkles, Star, Tv, User, UtensilsCrossed, Wrench, X, Zap,
} from "lucide-react";

type Screen = "food" | "restaurant" | "checkout" | "tracking" | "confirmed";
type DeliveryMode = "clubbed" | "priority";

type CartItem = {
  dishName: string;
  restaurantName: string;
  price: number;
  qty: number;
  veg: boolean;
  image: string;
};

type PlacedOrder = {
  deliveryMode: DeliveryMode;
  superCoinsApplied: boolean;
  total: number;
  items: CartItem[];
  checkoutCoinBalance: number;
};

type Restaurant = {
  id: number;
  name: string;
  rating: number;
  time: string;
  original: number;
  price: number;
  image: string;
  cuisine: string;
  distance: string;
  dishes: string[];
};

type MenuItem = {
  name: string;
  veg: boolean;
  desc: string;
  price: number;
  popular?: boolean;
  image: string;
};

type SearchResult = {
  id: string;
  label: string;
  meta: string;
  image: string;
  restaurantId: number;
  type: "Restaurant" | "Dish";
};

const FULL_COIN_BALANCE = 1240;
const COINS_PER_RUPEE = 1;
const COINS_EARNED = 40;
const PLATFORM_FEE = 12;
const PACKAGING_FEE = 15;
const GST = 10;
const DELIVERY_FEES: Record<DeliveryMode, number> = { clubbed: 12, priority: 45 };

function computeTotal(cart: CartItem[], deliveryMode: DeliveryMode, superCoinsApplied: boolean) {
  const itemsTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const coinsValue = superCoinsApplied ? Math.min(45, itemsTotal) : 0;
  return itemsTotal + DELIVERY_FEES[deliveryMode] + PLATFORM_FEE + PACKAGING_FEE + GST - coinsValue;
}
function coinsUsed(superCoinsApplied: boolean, cart: CartItem[]) {
  if (!superCoinsApplied) return 0;
  const itemsTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return Math.min(45, itemsTotal) * COINS_PER_RUPEE;
}

const FOOD_IMAGES = {
  biryani: "/images/food/biryani.webp",
  butterChicken: "/images/food/butter-chicken.webp",
  masalaDosa: "/images/food/masala-dosa.webp",
  paneerTikka: "/images/food/paneer-tikka.webp",
  chowmein: "/images/food/chowmein.webp",
  vegThali: "/images/food/veg-thali.webp",
  samosas: "/images/food/samosas.webp",
  filterCoffee: "/images/food/filter-coffee.webp",
  paneerWrap: "/images/food/paneer-wrap.webp",
  vegBurger: "/images/food/veg-burger.webp",
} as const;

const CATEGORIES = [
  { icon: Sparkles, label: "For You" },
  { icon: UtensilsCrossed, label: "Fashion" },
  { icon: Smartphone, label: "Mobiles" },
  { icon: Tv, label: "Electronics" },
  { icon: Sparkles, label: "Beauty" },
  { icon: Home, label: "Home" },
  { icon: Wrench, label: "Appliances" },
  { icon: Baby, label: "Toys" },
  { icon: UtensilsCrossed, label: "Dash" },
  { icon: Car, label: "Auto" },
  { icon: Dumbbell, label: "Sports" },
  { icon: Sofa, label: "Furniture" },
  { icon: BookOpen, label: "Books" },
  { icon: Bike, label: "2 Wheeler" },
];

const RESTAURANTS: Restaurant[] = [
  { id: 0, name: "Biryani Blues", rating: 4.3, time: "18 min", original: 210, price: 132, image: FOOD_IMAGES.biryani, cuisine: "Biryani, North Indian, Mughlai", distance: "900 m", dishes: ["Hyderabadi Biryani", "Chicken 65", "Garlic Naan", "Gulab Jamun"] },
  { id: 1, name: "Punjab Grill", rating: 4.4, time: "21 min", original: 235, price: 148, image: FOOD_IMAGES.butterChicken, cuisine: "North Indian, Punjabi", distance: "1.2 km", dishes: ["Butter Chicken", "Paneer Butter Masala", "Dal Makhani"] },
  { id: 2, name: "South Express", rating: 4.5, time: "12 min", original: 140, price: 86, image: FOOD_IMAGES.masalaDosa, cuisine: "South Indian, Breakfast", distance: "650 m", dishes: ["Masala Dosa", "Filter Coffee"] },
  { id: 3, name: "Tandoori Nights", rating: 4.2, time: "25 min", original: 255, price: 158, image: FOOD_IMAGES.paneerTikka, cuisine: "Tandoor, North Indian", distance: "1.6 km", dishes: ["Paneer Tikka", "Butter Chicken"] },
  { id: 4, name: "Wok This Way", rating: 4.1, time: "20 min", original: 190, price: 118, image: FOOD_IMAGES.chowmein, cuisine: "Indo-Chinese, Noodles", distance: "1.1 km", dishes: ["Vegetable Chowmein"] },
  { id: 5, name: "Chai & More", rating: 4.6, time: "10 min", original: 95, price: 62, image: FOOD_IMAGES.filterCoffee, cuisine: "Beverages, Quick Bites", distance: "500 m", dishes: ["Filter Coffee", "Samosas"] },
  { id: 6, name: "Wrap Republic", rating: 4.3, time: "14 min", original: 165, price: 104, image: FOOD_IMAGES.paneerWrap, cuisine: "Rolls, Wraps, Quick Bites", distance: "950 m", dishes: ["Paneer Tikka Wrap"] },
  { id: 7, name: "Burger Junction", rating: 4.4, time: "16 min", original: 180, price: 112, image: FOOD_IMAGES.vegBurger, cuisine: "Burgers, Quick Bites", distance: "1.1 km", dishes: ["Crispy Veg Burger"] },
];

const DISH_DETAILS: Record<string, MenuItem> = {
  "Hyderabadi Biryani": { name: "Hyderabadi Biryani", veg: false, desc: "Aromatic basmati rice layered with tender chicken, saffron and traditional spices", price: 120, popular: true, image: FOOD_IMAGES.biryani },
  "Butter Chicken": { name: "Butter Chicken", veg: false, desc: "Charred chicken simmered in a velvety tomato-butter gravy", price: 165, popular: true, image: FOOD_IMAGES.butterChicken },
  "Masala Dosa": { name: "Masala Dosa", veg: true, desc: "Crisp dosa filled with spiced potato, served with sambar and chutneys", price: 82, popular: true, image: FOOD_IMAGES.masalaDosa },
  "Paneer Tikka": { name: "Paneer Tikka", veg: true, desc: "Tandoor-charred paneer, peppers and onions with mint chutney", price: 148, popular: true, image: FOOD_IMAGES.paneerTikka },
  "Vegetable Chowmein": { name: "Vegetable Chowmein", veg: true, desc: "Wok-tossed noodles with crisp vegetables and spring onion", price: 115, image: FOOD_IMAGES.chowmein },
  "Veg Thali": { name: "Veg Thali", veg: true, desc: "Dal, seasonal sabzi, paneer curry, rice, roti, raita and salad", price: 129, popular: true, image: FOOD_IMAGES.vegThali },
  "Samosas": { name: "Samosas", veg: true, desc: "Three crisp samosas with mint and tamarind chutneys", price: 92, image: FOOD_IMAGES.samosas },
  "Filter Coffee": { name: "Filter Coffee", veg: true, desc: "Freshly brewed South Indian filter coffee with dense foam", price: 40, image: FOOD_IMAGES.filterCoffee },
  "Paneer Tikka Wrap": { name: "Paneer Tikka Wrap", veg: true, desc: "Charred paneer, peppers, onions and mint chutney rolled in soft flatbread", price: 104, image: FOOD_IMAGES.paneerWrap },
  "Crispy Veg Burger": { name: "Crispy Veg Burger", veg: true, desc: "Golden vegetable patty, cheese, lettuce, tomato and onion in a toasted bun", price: 112, image: FOOD_IMAGES.vegBurger },
  "Paneer Butter Masala": { name: "Paneer Butter Masala", veg: true, desc: "Cottage cheese cubes in rich tomato-butter gravy with kasuri methi", price: 140, image: "/images/menu/paneer-butter-masala.webp" },
  "Chicken 65": { name: "Chicken 65", veg: false, desc: "Crisp spiced chicken bites tossed with curry leaves and green chillies", price: 160, popular: true, image: "/images/menu/chicken-65.webp" },
  "Dal Makhani": { name: "Dal Makhani", veg: true, desc: "Black lentils slow-cooked overnight with butter and cream", price: 110, image: "/images/menu/dal-makhani.webp" },
  "Garlic Naan": { name: "Garlic Naan", veg: true, desc: "Tandoor-baked flatbread brushed with butter, garlic and coriander", price: 40, image: "/images/menu/garlic-naan.webp" },
  "Gulab Jamun": { name: "Gulab Jamun (2 pcs)", veg: true, desc: "Warm milk dumplings soaked in saffron-cardamom syrup", price: 60, image: "/images/menu/gulab-jamun.webp" },
};

const BIRYANI_MENU: MenuItem[] = [
  DISH_DETAILS["Hyderabadi Biryani"], DISH_DETAILS["Paneer Butter Masala"],
  DISH_DETAILS["Chicken 65"], DISH_DETAILS["Dal Makhani"],
  DISH_DETAILS["Garlic Naan"], DISH_DETAILS["Gulab Jamun"],
];

const DISH_SEARCH_INDEX = [
  { name: "Hyderabadi Biryani", restaurantId: 0 }, { name: "Chicken 65", restaurantId: 0 },
  { name: "Garlic Naan", restaurantId: 0 }, { name: "Gulab Jamun", restaurantId: 0 },
  { name: "Butter Chicken", restaurantId: 1 }, { name: "Paneer Butter Masala", restaurantId: 1 },
  { name: "Dal Makhani", restaurantId: 1 }, { name: "Masala Dosa", restaurantId: 2 },
  { name: "Filter Coffee", restaurantId: 5 }, { name: "Paneer Tikka", restaurantId: 3 },
  { name: "Vegetable Chowmein", restaurantId: 4 }, { name: "Samosas", restaurantId: 5 },
  { name: "Paneer Tikka Wrap", restaurantId: 6 }, { name: "Crispy Veg Burger", restaurantId: 7 },
];

const BANNERS = [
  { background: "bg-gradient-to-r from-[#174EA6] to-[#2874F0]", eyebrow: "SUPERCOIN SUPPER", title: "Your SuperCoins buy dinner now", subtitle: "Use coins earned on shopping to pay for food", image: FOOD_IMAGES.biryani },
  { background: "bg-gradient-to-r from-[#6A3216] to-[#D45A25]", eyebrow: "CAMPUS FAVOURITES", title: "Big flavour, direct from the kitchen", subtitle: "ONDC-powered menus with no price inflation", image: FOOD_IMAGES.paneerTikka },
  { background: "bg-gradient-to-r from-[#111827] to-[#334155]", eyebrow: "OPEN LATE", title: "Mess closed? We're open till 2 AM", subtitle: "Late-night delivery from restaurants around campus", image: FOOD_IMAGES.chowmein },
];

/* ── Shared UI atoms ── */

function Photo({ src, alt, className = "", sizes = "(max-width: 640px) 100vw, 400px", priority = false }: { src: string; alt: string; className?: string; sizes?: string; priority?: boolean }) {
  return <Image src={src} alt={alt} width={1200} height={900} sizes={sizes} priority={priority} className={`food-photo ${className}`} />;
}

function SuperCoinChip({ coins, pulse }: { coins: number; pulse: boolean }) {
  return (
    <button type="button" aria-label={`${coins.toLocaleString()} SuperCoins`} className={`flex items-center gap-2 rounded-full border border-[#E0E0E0] bg-white px-3 py-1.5 hover:border-[#F9A825] hover:shadow-sm ${pulse ? "coin-pulse" : ""}`}>
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]"><Zap className="h-3.5 w-3.5 fill-white text-white" /></span>
      <span className="animate-num text-[14px] font-semibold tabular-nums text-[#212121]">{coins.toLocaleString()}</span>
    </button>
  );
}

function FlipkartLogo() {
  return (
    <button type="button" aria-label="Flipkart home" className="flex flex-shrink-0 items-center gap-1 rounded-[4px] bg-[#FFE11B] px-3.5 py-2 hover:bg-[#F6D700]">
      <span className="text-[22px] font-bold italic leading-none tracking-tight text-[#2874F0]">f</span>
      <span className="text-[15px] font-semibold italic text-[#2874F0]">Flipkart</span>
    </button>
  );
}

function RatingPill({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#388E3C] px-2 py-0.5 text-[14px] font-semibold text-white">
      {rating} <Star className="h-3 w-3 fill-white" />
      {count ? <span className="ml-0.5 text-white/85">| {count.toLocaleString()}</span> : null}
    </span>
  );
}

function VegIndicator({ veg }: { veg: boolean }) {
  return <span className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[2px] border-2 ${veg ? "border-[#388E3C]" : "border-[#E43B4F]"}`}><span className={`h-2 w-2 rounded-full ${veg ? "bg-[#388E3C]" : "bg-[#E43B4F]"}`} /></span>;
}

function QtyControl({ qty, onAdd, onRemove }: { qty: number; onAdd: () => void; onRemove: () => void }) {
  return (
    <div className="mx-auto -mt-4 flex h-9 items-center overflow-hidden rounded-[4px] border border-[#2874F0] bg-white shadow">
      <button type="button" onClick={onRemove} className="flex h-full w-8 items-center justify-center text-[#2874F0] hover:bg-[#F0F5FF]"><Minus className="h-3.5 w-3.5" /></button>
      <span className="flex h-full w-8 items-center justify-center text-[14px] font-bold text-[#2874F0]">{qty}</span>
      <button type="button" onClick={onAdd} className="flex h-full w-8 items-center justify-center text-[#2874F0] hover:bg-[#F0F5FF]"><Plus className="h-3.5 w-3.5" /></button>
    </div>
  );
}

function SearchBox({ query, setQuery, results, onSelect, resultsId }: { query: string; setQuery: (v: string) => void; results: SearchResult[]; onSelect: (r: SearchResult) => void; resultsId: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onPd = (e: PointerEvent) => { if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false); };
    const onKd = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onPd);
    document.addEventListener("keydown", onKd);
    return () => { document.removeEventListener("pointerdown", onPd); document.removeEventListener("keydown", onKd); };
  }, []);
  const show = open && query.trim().length > 0;
  return (
    <div ref={rootRef} className="relative w-full">
      <div className={`flex h-11 items-center gap-3 rounded-full border bg-white px-4 ${show ? "border-[#2874F0] shadow-[0_4px_12px_rgba(40,116,240,0.12)]" : "border-[#2874F0]"}`}>
        <Search className="h-5 w-5 flex-shrink-0 text-[#2874F0]" />
        <input type="search" value={query} onChange={e => { setQuery(e.target.value); setOpen(e.target.value.trim().length > 0); }} onFocus={() => query.trim() && setOpen(true)} placeholder="Search for restaurants, dishes and more" aria-label="Search restaurants and dishes" role="combobox" aria-autocomplete="list" aria-controls={resultsId} aria-expanded={show} className="min-w-0 flex-1 bg-transparent text-[16px] text-[#212121] outline-none placeholder:text-[#878787]" />
        {query ? <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setOpen(false); }} className="flex h-7 w-7 items-center justify-center rounded-full text-[#878787] hover:bg-[#F1F3F6] hover:text-[#212121]"><X className="h-4 w-4" /></button> : null}
      </div>
      {show ? (
        <div id={resultsId} role="listbox" className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] max-h-[420px] overflow-y-auto rounded-[4px] border border-[#E0E0E0] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
          {results.length ? results.map(r => (
            <button type="button" role="option" aria-selected="false" key={r.id} onClick={() => { onSelect(r); setOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#F5F8FF]">
              <span className="w-[64px] flex-shrink-0"><Photo src={r.image} alt="" sizes="64px" /></span>
              <span className="min-w-0 flex-1"><span className="block truncate text-[16px] font-semibold text-[#212121]">{r.label}</span><span className="block truncate text-[14px] text-[#878787]">{r.type} · {r.meta}</span></span>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#878787]" />
            </button>
          )) : <div className="px-4 py-5 text-center text-[14px] text-[#878787]">No matching restaurants or dishes</div>}
        </div>
      ) : null}
    </div>
  );
}

function BillRow({ label, value, original, subtext }: { label: string; value: string; original?: string; subtext?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0"><p className="text-[16px] text-[#212121]">{label}</p>{subtext ? <p className="mt-0.5 text-[14px] leading-relaxed text-[#878787]">{subtext}</p> : null}</div>
      <div className="flex flex-shrink-0 items-center gap-2 pt-0.5">{original ? <span className="text-[16px] text-[#878787] line-through">{original}</span> : null}<span className="text-[16px] font-medium text-[#212121]">{value}</span></div>
    </div>
  );
}

/* ── Main app ── */

export function FlipkartFoodApp() {
  const [screen, setScreen] = useState<Screen>("food");
  const [coins, setCoins] = useState(FULL_COIN_BALANCE);
  const [coinPulse, setCoinPulse] = useState(false);
  const [superCoinsApplied, setSuperCoinsApplied] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [economicsOpen, setEconomicsOpen] = useState(false);
  const [clubbedInfoOpen, setClubbedInfoOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [trackingStep, setTrackingStep] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(0);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("clubbed");
  const [priorityDeliveriesRemaining, setPriorityDeliveriesRemaining] = useState(3);
  const [priorityReserved, setPriorityReserved] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const categoryStripRef = useRef<HTMLDivElement>(null);
  const categoryCenteredRef = useRef(false);
  const orderPlacementRef = useRef(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const headerCompact = scrolled && screen !== "checkout";

  const pulseCoin = useCallback(() => { setCoinPulse(true); window.setTimeout(() => setCoinPulse(false), 650); }, []);

  const addToCart = useCallback((dishName: string, restaurantName: string, price: number, veg: boolean, image: string) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.dishName === dishName && i.restaurantName === restaurantName);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { dishName, restaurantName, price, qty: 1, veg, image }];
    });
  }, []);

  const removeFromCart = useCallback((dishName: string, restaurantName: string) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.dishName === dishName && i.restaurantName === restaurantName);
      if (idx < 0) return prev;
      if (prev[idx].qty <= 1) return prev.filter((_, i) => i !== idx);
      const next = [...prev];
      next[idx] = { ...next[idx], qty: next[idx].qty - 1 };
      return next;
    });
  }, []);

  const removeItemEntirely = useCallback((dishName: string, restaurantName: string) => {
    setCart(prev => prev.filter(i => !(i.dishName === dishName && i.restaurantName === restaurantName)));
  }, []);

  const getQty = useCallback((dishName: string, restaurantName: string) => {
    return cart.find(i => i.dishName === dishName && i.restaurantName === restaurantName)?.qty ?? 0;
  }, [cart]);

  const navigate = useCallback((nextScreen: Screen) => {
    if (nextScreen === "checkout") {
      orderPlacementRef.current = false;
      setDeliveryMode("clubbed");
      setPriorityReserved(false);
      setSuperCoinsApplied(true);
      const cu = coinsUsed(true, cart);
      setCoins(FULL_COIN_BALANCE - cu);
      setPlacedOrder(null);
      pulseCoin();
    }
    if (nextScreen === "tracking") {
      if (orderPlacementRef.current) return;
      orderPlacementRef.current = true;
      const cu = coinsUsed(superCoinsApplied, cart);
      const bal = FULL_COIN_BALANCE - cu;
      setPlacedOrder({ deliveryMode, superCoinsApplied, total: computeTotal(cart, deliveryMode, superCoinsApplied), items: [...cart], checkoutCoinBalance: bal });
      if (deliveryMode === "priority" && priorityReserved) {
        setPriorityDeliveriesRemaining(r => Math.max(0, r - 1));
        setPriorityReserved(false);
      }
      setTrackingStep(0);
    }
    if (nextScreen === "confirmed") {
      const bal = placedOrder?.checkoutCoinBalance ?? (FULL_COIN_BALANCE - coinsUsed(superCoinsApplied, cart));
      setCoins(bal + COINS_EARNED);
      setCart([]);
      pulseCoin();
    }
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [cart, deliveryMode, placedOrder, priorityReserved, pulseCoin, superCoinsApplied]);

  const openRestaurant = useCallback((id: number) => { setSelectedRestaurantId(id); setQuery(""); navigate("restaurant"); }, [navigate]);

  const toggleSuperCoins = useCallback(() => {
    setSuperCoinsApplied(prev => {
      const next = !prev;
      const cu = coinsUsed(next, cart);
      setCoins(FULL_COIN_BALANCE - cu);
      pulseCoin();
      return next;
    });
  }, [cart, pulseCoin]);

  const changeDeliveryMode = useCallback((mode: DeliveryMode) => {
    if (mode === "priority" && priorityDeliveriesRemaining <= 0) return;
    setDeliveryMode(mode);
    setPriorityReserved(mode === "priority");
  }, [priorityDeliveriesRemaining]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => { if (!raf) raf = window.requestAnimationFrame(() => { setScrolled(window.scrollY > 180); raf = 0; }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) window.cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (screen !== "food") return;
    const t = window.setInterval(() => setBannerIndex(i => (i + 1) % BANNERS.length), 5000);
    return () => window.clearInterval(t);
  }, [screen]);

  useEffect(() => {
    const strip = categoryStripRef.current;
    const dash = strip?.querySelector<HTMLElement>("[data-dash-category='true']");
    if (!strip || !dash || window.innerWidth > 640 || categoryCenteredRef.current) return;
    strip.scrollTo({ left: dash.offsetLeft - (strip.clientWidth - dash.offsetWidth) / 2, behavior: "auto" });
    categoryCenteredRef.current = true;
  }, []);

  useEffect(() => {
    if (screen !== "tracking") return;
    let p = 0; let ct: number | undefined;
    const iv = window.setInterval(() => { p += 1; setTrackingStep(p); if (p >= 3) { window.clearInterval(iv); ct = window.setTimeout(() => navigate("confirmed"), 1800); } }, 2200);
    return () => { window.clearInterval(iv); if (ct) window.clearTimeout(ct); };
  }, [navigate, screen]);

  const nq = query.trim().toLowerCase();
  const visibleRestaurants = useMemo(() => nq ? RESTAURANTS.filter(r => [r.name, r.cuisine, ...r.dishes].join(" ").toLowerCase().includes(nq)) : RESTAURANTS, [nq]);
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!nq) return [];
    const rm: SearchResult[] = RESTAURANTS.filter(r => [r.name, r.cuisine].join(" ").toLowerCase().includes(nq)).map(r => ({ id: `r-${r.id}`, label: r.name, meta: `${r.cuisine} · ${r.time}`, image: r.image, restaurantId: r.id, type: "Restaurant" }));
    const dm: SearchResult[] = DISH_SEARCH_INDEX.filter(e => e.name.toLowerCase().includes(nq)).map(e => ({ id: `d-${e.restaurantId}-${e.name}`, label: e.name, meta: RESTAURANTS[e.restaurantId].name, image: DISH_DETAILS[e.name].image, restaurantId: e.restaurantId, type: "Dish" }));
    return [...rm, ...dm].slice(0, 8);
  }, [nq]);

  const selectedRestaurant = RESTAURANTS.find(r => r.id === selectedRestaurantId) ?? RESTAURANTS[0];
  const currentTotal = computeTotal(cart, deliveryMode, superCoinsApplied);
  const activeOrder = placedOrder ?? { deliveryMode, superCoinsApplied, total: currentTotal, items: cart, checkoutCoinBalance: FULL_COIN_BALANCE - coinsUsed(superCoinsApplied, cart) };
  const displayedPriority = Math.max(0, priorityDeliveriesRemaining - (priorityReserved ? 1 : 0));

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-50 border-b border-[#E0E0E0] bg-white">
        {headerCompact ? (
          <div className="compact-header bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="page-shell flex min-h-14 items-center gap-4 py-2">
              <div onClick={() => navigate("food")} className="flex cursor-pointer items-center gap-1"><FlipkartLogo /><ChevronDown className="h-4 w-4 text-[#878787]" /></div>
              <div className="min-w-0 flex-1"><SearchBox query={query} setQuery={setQuery} results={searchResults} onSelect={r => openRestaurant(r.restaurantId)} resultsId="sr-c" /></div>
              <div className="flex items-center gap-4">
                <SuperCoinChip coins={coins} pulse={coinPulse} />
                <button type="button" className="hidden items-center gap-2 text-[15px] text-[#212121] lg:flex"><User className="h-5 w-5" /> Ashwin</button>
                <button type="button" onClick={() => cartCount > 0 && navigate("checkout")} className="relative flex items-center gap-2 text-[15px] text-[#212121] hover:text-[#2874F0]">
                  <ShoppingCart className="h-5 w-5" /><span className="hidden sm:inline">Cart</span>
                  {cartCount > 0 ? <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6161] text-[12px] font-bold text-white">{cartCount}</span> : null}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-[#F0F0F0] bg-white">
              <div className="page-shell flex min-h-11 items-center justify-between gap-4 py-1.5">
                <div className="flex items-center gap-3">
                  <FlipkartLogo />
                  <div className="hidden items-center gap-2 sm:flex">
                    {[{ icon: Plane, label: "Travel" }, { icon: ShoppingBasket, label: "Grocery" }].map(({ icon: Icon, label }) => (
                      <button key={label} type="button" className="flex items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-white px-3 py-1.5 text-[14px] text-[#5F6368] hover:border-[#2874F0] hover:text-[#2874F0]"><Icon className="h-4 w-4" /> {label}</button>
                    ))}
                    <button type="button" onClick={() => navigate("food")} className="flex items-center gap-1.5 rounded-full border-2 border-[#2874F0] bg-[#F0F5FF] px-3 py-1.5 text-[14px] font-semibold text-[#2874F0] hover:bg-[#E3EDFF]"><UtensilsCrossed className="h-4 w-4" /> Dash</button>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-5">
                  <button type="button" className="hidden items-center gap-1.5 text-[14px] text-[#212121] hover:text-[#2874F0] md:flex"><MapPin className="h-4 w-4 text-[#2874F0]" /><span className="max-w-[220px] truncate">Hostel Block C, Sector 12</span><ChevronDown className="h-3.5 w-3.5 text-[#878787]" /></button>
                  <SuperCoinChip coins={coins} pulse={coinPulse} />
                </div>
              </div>
            </div>
            <div className="bg-white">
              <div className="page-shell flex min-h-16 items-center gap-5 py-2">
                <div className="min-w-0 flex-1"><SearchBox query={query} setQuery={setQuery} results={searchResults} onSelect={r => openRestaurant(r.restaurantId)} resultsId="sr-p" /></div>
                <div className="hidden items-center gap-6 md:flex">
                  <button type="button" className="flex items-center gap-2 text-[16px] text-[#212121] hover:text-[#2874F0]"><User className="h-5 w-5" /> Ashwin <ChevronDown className="h-4 w-4 text-[#878787]" /></button>
                  <button type="button" className="flex items-center gap-2 text-[16px] text-[#212121] hover:text-[#2874F0]"><MoreHorizontal className="h-5 w-5" /> More <ChevronDown className="h-4 w-4 text-[#878787]" /></button>
                  <button type="button" onClick={() => cartCount > 0 && navigate("checkout")} className="relative flex items-center gap-2 text-[16px] text-[#212121] hover:text-[#2874F0]">
                    <ShoppingCart className="h-5 w-5" /> Cart
                    {cartCount > 0 ? <span className="absolute -right-2.5 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6161] text-[12px] font-bold text-white">{cartCount}</span> : null}
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white">
              <div className="page-shell">
                <div ref={categoryStripRef} className="horizontal-rail hide-scrollbar flex h-[84px] items-end gap-7 overflow-x-auto">
                  {CATEGORIES.map(({ icon: Icon, label }) => { const active = label === "Dash"; return (
                    <button key={label} type="button" data-dash-category={active} onClick={() => active && navigate("food")} className={`relative flex min-w-[60px] flex-shrink-0 flex-col items-center gap-1.5 pb-3 ${active ? "text-[#2874F0]" : "text-[#6B7280] hover:text-[#212121]"}`}>
                      <span className={`flex h-9 w-9 items-center justify-center rounded-[4px] ${active ? "bg-[#F0F5FF]" : ""}`}><Icon className="h-5 w-5" strokeWidth={1.6} /></span>
                      <span className={`whitespace-nowrap text-[13px] ${active ? "font-bold" : "font-medium"}`}>{label}</span>
                      {active ? <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t bg-[#2874F0]" /> : null}
                    </button>
                  ); })}
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      <main className="page-shell">
        {screen === "food" ? <FoodLanding navigate={navigate} openRestaurant={openRestaurant} restaurants={visibleRestaurants} query={query} bannerIndex={bannerIndex} setBannerIndex={setBannerIndex} priorityDeliveries={displayedPriority} openClubbedInfo={() => setClubbedInfoOpen(true)} /> : null}
        {screen === "restaurant" ? <RestaurantPage navigate={navigate} restaurant={selectedRestaurant} addToCart={addToCart} removeFromCart={removeFromCart} getQty={getQty} cartCount={cartCount} cart={cart} /> : null}
        {screen === "checkout" ? <CheckoutPage navigate={navigate} superCoinsApplied={superCoinsApplied} toggleSuperCoins={toggleSuperCoins} total={currentTotal} deliveryMode={deliveryMode} changeDeliveryMode={changeDeliveryMode} priorityDeliveriesRemaining={displayedPriority} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} removeItemEntirely={removeItemEntirely} /> : null}
        {screen === "tracking" ? <TrackingPage step={trackingStep} order={activeOrder} /> : null}
        {screen === "confirmed" ? <ConfirmedPage navigate={navigate} coins={coins} order={activeOrder} /> : null}
      </main>

      <footer className="mt-8 bg-[#172337] text-[14px] text-[#A8B0BC]">
        <div className="page-shell py-8">
          <div className="mb-6 flex flex-wrap gap-12">
            {[{ title: "About", links: ["Contact Us", "About Us", "Careers"] }, { title: "Help", links: ["Payments", "Shipping", "Returns"] }, { title: "Policy", links: ["Return Policy", "Terms of Use", "Security"] }, { title: "Social", links: ["Facebook", "X", "YouTube"] }].map(g => (
              <div key={g.title}><span className="text-[14px] font-semibold uppercase tracking-wider text-white">{g.title}</span><div className="mt-2 space-y-1.5">{g.links.map(l => <button type="button" key={l} className="block hover:text-white">{l}</button>)}</div></div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2B3A4E] pt-5">
            <p>&copy; 2007–2026 Flipkart.com</p>
            <button type="button" onClick={() => setEconomicsOpen(true)} className="underline hover:text-white">The economics behind Flipkart Dash</button>
          </div>
        </div>
      </footer>

      {economicsOpen ? <EconomicsDrawer onClose={() => setEconomicsOpen(false)} /> : null}
      {clubbedInfoOpen ? <ClubbedExplainerModal onClose={() => setClubbedInfoOpen(false)} /> : null}
    </div>
  );
}

/* ── Restaurant card ── */

function RestaurantCard({ restaurant, onOpen, rail = false }: { restaurant: Restaurant; onOpen: () => void; rail?: boolean }) {
  return (
    <button type="button" onClick={onOpen} className={`restaurant-card group flex-shrink-0 overflow-hidden border border-[#E0E0E0] bg-white text-left ${rail ? "w-[260px]" : "w-full"}`}>
      <Photo src={restaurant.image} alt={`${restaurant.name} food`} className="min-h-[180px]" sizes={rail ? "260px" : "(max-width: 640px) 100vw, 280px"} />
      <span className="block p-4">
        <span className="block truncate text-[18px] font-semibold text-[#212121] group-hover:text-[#2874F0]">{restaurant.name}</span>
        <span className="mt-1 block truncate text-[14px] text-[#878787]">{restaurant.cuisine}</span>
        <span className="mt-2 flex items-center gap-2.5"><RatingPill rating={restaurant.rating} /><span className="flex items-center gap-1 text-[14px] text-[#878787]"><Clock className="h-4 w-4" /> {restaurant.time}</span></span>
        <span className="mt-2 inline-flex rounded-full bg-[#EAF2FF] px-2.5 py-1 text-[12px] font-semibold text-[#2874F0]">Dash Hub · Sector 12</span>
        <span className="mt-2 flex items-center gap-2"><span className="text-[14px] text-[#878787] line-through">₹{restaurant.original}</span><span className="text-[18px] font-bold text-[#212121]">₹{restaurant.price}</span></span>
        <span className="mt-1.5 flex items-center gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]"><Zap className="h-2.5 w-2.5 fill-white text-white" /></span><span className="text-[14px] text-[#878787]">SuperCoins + Dash Hub pricing</span></span>
      </span>
    </button>
  );
}

/* ── Screen 1: Landing ── */

function FoodLanding({ navigate, openRestaurant, restaurants, query, bannerIndex, setBannerIndex, priorityDeliveries, openClubbedInfo }: { navigate: (s: Screen) => void; openRestaurant: (id: number) => void; restaurants: Restaurant[]; query: string; bannerIndex: number; setBannerIndex: (i: number) => void; priorityDeliveries: number; openClubbedInfo: () => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [railEdges, setRailEdges] = useState({ atStart: true, atEnd: false });
  const hubBrands = RESTAURANTS.slice(0, 6);
  const occasions = [
    { title: "Sunday", detail: "mess closed", image: FOOD_IMAGES.vegThali },
    { title: "Late night", detail: "after 9:30pm", image: FOOD_IMAGES.chowmein },
    { title: "Group order", detail: "match night", image: FOOD_IMAGES.biryani },
    { title: "Craving", detail: "something special", image: FOOD_IMAGES.paneerTikka },
  ];
  const updateEdges = useCallback(() => { const r = railRef.current; if (!r) return; const s = r.scrollLeft <= 4; const e = r.scrollLeft + r.clientWidth >= r.scrollWidth - 4; setRailEdges(c => c.atStart === s && c.atEnd === e ? c : { atStart: s, atEnd: e }); }, []);
  useEffect(() => { const r = railRef.current; if (!r) return; const f = window.requestAnimationFrame(updateEdges); r.addEventListener("scroll", updateEdges, { passive: true }); const ro = new ResizeObserver(updateEdges); ro.observe(r); return () => { window.cancelAnimationFrame(f); r.removeEventListener("scroll", updateEdges); ro.disconnect(); }; }, [restaurants, updateEdges]);
  const scrollR = (d: -1 | 1) => { const r = railRef.current; if (!r) return; r.scrollBy({ left: d * Math.max(260, r.clientWidth - 16), behavior: "smooth" }); };

  return (
    <div className="fade-in py-6">
      <div className="flex gap-5">
        <div className="min-w-0 flex-1">
          <section aria-label="Featured food offers" className="relative mb-7">
            <div className="overflow-hidden rounded-[4px]"><div className="banner-track flex" style={{ transform: `translateX(-${bannerIndex * 100}%)` }}>
              {BANNERS.map((b, i) => (
                <button type="button" key={b.title} onClick={() => openRestaurant(i === 2 ? 4 : i === 1 ? 3 : 0)} className={`relative w-full flex-shrink-0 overflow-hidden rounded-[4px] text-left sm:min-h-[300px] ${b.background}`}>
                  <span className="absolute right-0 top-0 w-full overflow-hidden rounded-[4px] shadow-[0_8px_24px_rgba(0,0,0,0.28)] sm:right-4 sm:top-1/2 sm:w-[400px] sm:max-w-[48%] sm:-translate-y-1/2"><Photo src={b.image} alt="" priority={i === 0} sizes="(max-width: 640px) calc(100vw - 48px), 400px" /></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
                  <span className="relative z-10 block max-w-full px-6 pb-8 pt-[280px] text-white sm:max-w-[58%] sm:px-20 sm:py-16">
                    <span className="mb-3 block text-[13px] font-bold tracking-[0.16em] text-white/80">{b.eyebrow}</span>
                    <span className="block text-[28px] font-bold leading-tight sm:text-[36px]">{b.title}</span>
                    <span className="mt-3 block text-[16px] leading-relaxed text-white/85 sm:text-[18px]">{b.subtitle}</span>
                    <span className="mt-5 inline-flex items-center gap-2 rounded-[4px] bg-white px-4 py-2 text-[15px] font-semibold text-[#2874F0]">Explore now <ChevronRight className="h-4 w-4" /></span>
                  </span>
                </button>
              ))}
            </div></div>
            <button type="button" aria-label="Previous banner" onClick={() => setBannerIndex((bannerIndex - 1 + BANNERS.length) % BANNERS.length)} className="absolute left-3 top-[128px] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow hover:shadow-md sm:top-1/2"><ChevronLeft className="h-5 w-5 text-[#212121]" /></button>
            <button type="button" aria-label="Next banner" onClick={() => setBannerIndex((bannerIndex + 1) % BANNERS.length)} className="absolute right-3 top-[128px] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow hover:shadow-md sm:top-1/2"><ChevronRight className="h-5 w-5 text-[#212121]" /></button>
            <div className="mt-3 flex justify-center gap-2">{BANNERS.map((b, i) => <button type="button" aria-label={`Banner ${i + 1}`} key={b.title} onClick={() => setBannerIndex(i)} className={`h-2.5 rounded-full ${bannerIndex === i ? "w-7 bg-[#2874F0]" : "w-2.5 bg-[#C7C7C7] hover:bg-[#878787]"}`} />)}</div>
          </section>

          <section className="mb-5 rounded-[4px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <h2 className="text-[22px] font-semibold text-[#212121]">Your Dash Hub — Sector 12, 900m away</h2>
            <p className="mt-1 text-[16px] text-[#616161]">Located next to campus. Six brands cooking under one roof, one rider brings them all.</p>
            <p className="mt-1 text-[14px] leading-relaxed text-[#878787]">Hubs are sited beside high-density campuses, so orders naturally cluster and delivery costs split.</p>
            <div className="horizontal-rail hide-scrollbar mt-5 flex gap-4 overflow-x-auto pb-1">
              {hubBrands.map(b => <button type="button" key={b.id} onClick={() => openRestaurant(b.id)} className="restaurant-card group w-[190px] flex-shrink-0 overflow-hidden border border-[#E0E0E0] bg-white text-left"><Photo src={b.image} alt={`${b.name} at Dash Hub`} sizes="190px" /><span className="block truncate p-3 text-[16px] font-semibold text-[#212121] group-hover:text-[#2874F0]">{b.name}</span></button>)}
            </div>
            <p className="mt-4 border-t border-[#E0E0E0] pt-4 text-[14px] leading-relaxed text-[#878787]">Brands cook. Dash handles delivery, tech and payments — so commission stays near 5%, not 25%.</p>
          </section>

          <section className="mb-5 rounded-[4px] border border-[#C8E6C9] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E8F5E9]"><CheckCircle2 className="h-6 w-6 text-[#388E3C]" /></span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[#388E3C]">Student verified · ashwin@[college].edu</p>
                <h2 className="mt-1 text-[22px] font-semibold text-[#212121]">You have {priorityDeliveries} Priority deliveries left this month</h2>
                <p className="mt-2 max-w-[980px] text-[15px] leading-relaxed text-[#616161]">Verified students get 3 Priority orders a month — solo rider, 12–15 min. Every other order arrives Clubbed at 20–25 min, and costs less.</p>
                <button type="button" onClick={openClubbedInfo} className="mt-3 text-[14px] font-semibold text-[#2874F0] hover:text-[#1A5DC8]">How Clubbed delivery works</button>
              </div>
            </div>
          </section>

          <section className="mb-5 rounded-[4px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between px-5 pb-3 pt-5">
              <div><h2 className="text-[22px] font-semibold text-[#212121]">{query ? `Results for "${query}"` : "Ashwin, hungry again?"}</h2><p className="mt-1 text-[14px] text-[#878787]">Real menus, campus-friendly delivery times</p></div>
              <button type="button" onClick={() => document.getElementById("all-restaurants")?.scrollIntoView({ behavior: "smooth" })} className="text-[14px] font-semibold text-[#2874F0] hover:text-[#1A5DC8]">VIEW ALL</button>
            </div>
            <div className="relative px-5 pb-5">
              {restaurants.length ? <><div ref={railRef} className="horizontal-rail hide-scrollbar flex gap-4 overflow-x-auto">{restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} rail onOpen={() => openRestaurant(r.id)} />)}</div>{!railEdges.atStart ? <button type="button" onClick={() => scrollR(-1)} className="absolute left-1 top-[96px] flex h-11 w-11 items-center justify-center rounded-full border border-[#E0E0E0] bg-white shadow hover:shadow-md"><ChevronLeft className="h-5 w-5" /></button> : null}{!railEdges.atEnd ? <button type="button" onClick={() => scrollR(1)} className="absolute right-1 top-[96px] flex h-11 w-11 items-center justify-center rounded-full border border-[#E0E0E0] bg-white shadow hover:shadow-md"><ChevronRight className="h-5 w-5" /></button> : null}</> : <div className="py-5 text-[16px] text-[#878787]">No restaurants match. Try a dish or cuisine.</div>}
            </div>
          </section>

          <section id="all-restaurants" className="scroll-mt-20 rounded-[4px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <div className="px-5 pb-3 pt-5"><h2 className="text-[22px] font-semibold text-[#212121]">Under 20 minutes near Hostel Block C</h2><p className="mt-1 text-[14px] text-[#878787]">Delivered by eKart — Flipkart&apos;s own fleet</p></div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 px-5 pb-5">{restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} onOpen={() => openRestaurant(r.id)} />)}</div>
          </section>

          <section className="mt-5 rounded-[4px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <div className="mb-4"><h2 className="text-[22px] font-semibold text-[#212121]">Specially for you, Ashwin</h2><p className="mt-1 text-[14px] text-[#878787]">Your go-to picks for Sundays, late nights, match nights and cravings.</p></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {occasions.map(o => <button type="button" key={o.title} onClick={() => navigate("food")} className="restaurant-card overflow-hidden border border-[#E0E0E0] bg-white text-left"><Photo src={o.image} alt={`${o.title} food occasion`} sizes="(max-width: 640px) 100vw, 300px" /><span className="block p-4"><span className="block text-[18px] font-semibold text-[#212121]">{o.title}</span><span className="mt-1 block text-[14px] text-[#878787]">{o.detail}</span></span></button>)}
            </div>
            <p className="mt-5 rounded-[4px] bg-[#F0F5FF] px-4 py-3 text-[16px] font-medium text-[#2874F0]">Your campus, your schedule — Dash delivers whenever you need it.</p>
          </section>
        </div>

        <aside className="sticky top-[120px] hidden h-fit w-[180px] flex-shrink-0 self-start xl:block">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-[#0F172A] to-[#1E293B] shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <div className="aspect-[9/14] w-full overflow-hidden">
              <iframe className="h-full w-full border-0" src="https://www.youtube-nocookie.com/embed/2nP8rSEEeus" title="Flipkart Dash campus delivery video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            </div>
            <div className="px-3 py-2.5 text-center">
              <p className="text-[12px] font-semibold text-white">See how it works</p>
              <p className="mt-0.5 text-[10px] text-white/50">Campus delivery in 60s</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ── Screen 2: Restaurant ── */

function RestaurantPage({ navigate, restaurant, addToCart, removeFromCart, getQty, cartCount, cart }: { navigate: (s: Screen) => void; restaurant: Restaurant; addToCart: (dish: string, rest: string, price: number, veg: boolean, img: string) => void; removeFromCart: (dish: string, rest: string) => void; getQty: (dish: string, rest: string) => number; cartCount: number; cart: CartItem[] }) {
  const menu = restaurant.id === 0 ? BIRYANI_MENU : restaurant.dishes.map(d => DISH_DETAILS[d]).filter((i): i is MenuItem => Boolean(i));
  const gallery = [restaurant.image, FOOD_IMAGES.biryani, FOOD_IMAGES.paneerTikka, FOOD_IMAGES.vegThali];
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="fade-in py-6">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-[14px] text-[#878787]"><button type="button" onClick={() => navigate("food")} className="hover:text-[#2874F0]">Dash</button><ChevronRight className="h-4 w-4" /><span className="text-[#212121]">{restaurant.name}</span></nav>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-[40%]">
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((img, i) => (
              <div key={`${img}-${i}`} className="relative overflow-hidden rounded-[4px]">
                <Photo src={img} alt={`${restaurant.name} food ${i + 1}`} sizes="(max-width: 1024px) 50vw, 280px" priority={i === 0} />
                {i === 0 ? <div className="absolute right-2 top-2 flex gap-2"><button type="button" aria-label="Save" className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow hover:bg-[#F5F5F5]"><Heart className="h-4 w-4 text-[#616161]" /></button><button type="button" aria-label="Share" className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow hover:bg-[#F5F5F5]"><Share2 className="h-4 w-4 text-[#616161]" /></button></div> : null}
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-[60%]">
          <div className="rounded-[4px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <h1 className="text-[28px] font-semibold text-[#212121]">{restaurant.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3"><RatingPill rating={restaurant.rating} count={2847} /><span className="text-[14px] text-[#878787]">{restaurant.cuisine}</span></div>
            <div className="mt-2 flex flex-wrap items-center gap-5 text-[14px] text-[#878787]"><span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Sector 12, {restaurant.distance}</span><span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {restaurant.time}</span></div>
            <div className="mt-5 border-t border-[#E0E0E0] pt-5">
              <h2 className="mb-2 text-[22px] font-semibold text-[#212121]">Menu</h2>
              {menu.map((item) => {
                const qty = getQty(item.name, restaurant.name);
                return (
                  <div key={item.name} className="flex gap-4 border-b border-[#ECECEC] py-4 last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2"><VegIndicator veg={item.veg} /><h3 className="text-[18px] font-semibold text-[#212121]">{item.name}</h3>{item.popular ? <span className="rounded-[4px] border border-[#FF6161] px-2 py-0.5 text-[12px] font-semibold text-[#E43B4F]">BESTSELLER</span> : null}</div>
                      <p className="mt-2 text-[16px] font-medium text-[#212121]">₹{item.price}</p>
                      <p className="mt-1 max-w-[600px] text-[14px] leading-relaxed text-[#878787]">{item.desc}</p>
                    </div>
                    <div className="w-[132px] flex-shrink-0">
                      <Photo src={item.image} alt={item.name} sizes="132px" />
                      {qty > 0 ? (
                        <QtyControl qty={qty} onAdd={() => addToCart(item.name, restaurant.name, item.price, item.veg, item.image)} onRemove={() => removeFromCart(item.name, restaurant.name)} />
                      ) : (
                        <button type="button" onClick={() => addToCart(item.name, restaurant.name, item.price, item.veg, item.image)} className="mx-auto -mt-4 flex h-9 min-w-[92px] items-center justify-center rounded-[4px] border border-[#2874F0] bg-white px-4 text-[14px] font-semibold text-[#2874F0] shadow hover:bg-[#F0F5FF]">ADD</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {cartCount > 0 ? (
            <button type="button" onClick={() => navigate("checkout")} className="mt-4 flex h-14 w-full items-center justify-between rounded-[4px] bg-[#2874F0] px-5 text-white hover:bg-[#1A5DC8]">
              <span><span className="text-[16px] font-semibold">{cartCount} item{cartCount > 1 ? "s" : ""}</span><span className="ml-2 text-[14px] text-white/70">₹{cartTotal}</span></span>
              <span className="flex items-center gap-2 text-[16px] font-semibold">View Cart <ChevronRight className="h-5 w-5" /></span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ── Screen 3: Checkout ── */

function CheckoutPage({ navigate, superCoinsApplied, toggleSuperCoins, total, deliveryMode, changeDeliveryMode, priorityDeliveriesRemaining, cart, addToCart, removeFromCart, removeItemEntirely }: { navigate: (s: Screen) => void; superCoinsApplied: boolean; toggleSuperCoins: () => void; total: number; deliveryMode: DeliveryMode; changeDeliveryMode: (m: DeliveryMode) => void; priorityDeliveriesRemaining: number; cart: CartItem[]; addToCart: (d: string, r: string, p: number, v: boolean, i: string) => void; removeFromCart: (d: string, r: string) => void; removeItemEntirely: (d: string, r: string) => void }) {
  const otherPlatformPrice = Math.round(total * 1.9);
  const savings = otherPlatformPrice - total;
  const savingsPercent = Math.round((savings / otherPlatformPrice) * 100);
  const clubbed = deliveryMode === "clubbed";
  const brands = [...new Set(cart.map(i => i.restaurantName))];
  const multiBrand = brands.length > 1;

  if (cart.length === 0) {
    return (
      <div className="fade-in py-6 text-center">
        <div className="mx-auto max-w-[480px] rounded-[4px] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
          <ShoppingCart className="mx-auto h-12 w-12 text-[#E0E0E0]" />
          <h1 className="mt-4 text-[22px] font-semibold text-[#212121]">Your cart is empty</h1>
          <p className="mt-2 text-[14px] text-[#878787]">Add items from a restaurant to get started</p>
          <button type="button" onClick={() => navigate("food")} className="mt-5 h-11 rounded-[4px] bg-[#2874F0] px-7 text-[16px] font-semibold text-white hover:bg-[#1A5DC8]">Browse restaurants</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in py-6">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-[14px] text-[#878787]"><button type="button" onClick={() => navigate("food")} className="hover:text-[#2874F0]">Dash</button><ChevronRight className="h-4 w-4" /><span>Cart</span><ChevronRight className="h-4 w-4" /><span className="text-[#212121]">Checkout</span></nav>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <div>
          <section className="overflow-hidden rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
            <div className="flex min-h-14 items-center justify-between gap-3 bg-[#2874F0] px-5 py-3 text-white">
              <div className="flex flex-wrap items-center gap-3"><span className="rounded-[4px] bg-[#FFE11B] px-2.5 py-1 text-[13px] font-bold tracking-wider text-[#174EA6]">WOW! DEAL</span><h1 className="text-[18px] font-semibold">Apply SuperCoins for maximum savings</h1></div><ChevronDown className="h-5 w-5 flex-shrink-0" />
            </div>
            <div className="border border-t-0 border-[#D6E4FF] bg-[#F0F5FF] p-5">
              <div className={`mb-5 flex items-center justify-between gap-4 rounded-[4px] border bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${superCoinsApplied ? "border-[#2874F0] ring-2 ring-[#2874F0]/10" : "border-[#E0E0E0]"}`}>
                <div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow"><Zap className="h-6 w-6 fill-white text-white" /></span><div><p className="text-[18px] font-semibold text-[#212121]">Apply SuperCoins</p><p className="mt-0.5 text-[14px] text-[#878787]">Use 45 coins to save ₹45 instantly</p></div></div>
                <button type="button" role="switch" aria-checked={superCoinsApplied} aria-label="Apply SuperCoins" onClick={toggleSuperCoins} className={`relative h-8 w-14 flex-shrink-0 rounded-full ${superCoinsApplied ? "bg-[#2874F0]" : "bg-[#BDBDBD]"}`}><span className={`absolute left-0 top-1 h-6 w-6 rounded-full bg-white shadow-md ${superCoinsApplied ? "translate-x-7" : "translate-x-1"}`} /></button>
              </div>

              {multiBrand ? (
                <div className="mb-4 rounded-[4px] border border-[#A5D6A7] bg-[#E8F5E9] p-4">
                  <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#388E3C]" /><div><p className="text-[16px] font-semibold text-[#256D2B]">Bundled — {brands.length} brands, one rider, one delivery fee.</p><p className="mt-1 text-[14px] text-[#4F6F52]">All cook inside your Dash Hub, so we don&apos;t charge you twice.</p><div className="mt-2 flex flex-wrap gap-2">{brands.map(b => <span key={b} className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-[#256D2B]">{b}</span>)}</div></div></div>
                </div>
              ) : null}

              <div role="radiogroup" aria-label="Delivery mode" className="mb-4 space-y-3">
                <button type="button" role="radio" aria-checked={clubbed} onClick={() => changeDeliveryMode("clubbed")} className={`flex w-full items-start gap-3 rounded-[4px] border p-4 text-left ${clubbed ? "border-[#2874F0] bg-[#F0F5FF] shadow-[0_2px_8px_rgba(40,116,240,0.12)]" : "border-[#E0E0E0] bg-white hover:border-[#9BBDF8]"}`}>
                  <span className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${clubbed ? "border-[#2874F0]" : "border-[#BDBDBD]"}`}>{clubbed ? <span className="h-2.5 w-2.5 rounded-full bg-[#2874F0]" /> : null}</span>
                  <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center justify-between gap-2"><strong className="text-[17px] text-[#212121]">Clubbed — 20–25 min</strong><strong className="text-[18px] text-[#2874F0]">₹12 delivery</strong></span><span className="mt-1 block text-[14px] leading-relaxed text-[#616161]">Your order rides with others going to Hostel Block C. Cheapest option, always available.</span></span>
                </button>
                <button type="button" role="radio" aria-checked={!clubbed} aria-disabled={priorityDeliveriesRemaining <= 0} onClick={() => changeDeliveryMode("priority")} className={`flex w-full items-start gap-3 rounded-[4px] border p-4 text-left ${!clubbed ? "border-[#F9A825] bg-[#FFF8E1] shadow-[0_2px_8px_rgba(249,168,37,0.14)]" : "border-[#E0E0E0] bg-white hover:border-[#F9A825]"}`}>
                  <span className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${!clubbed ? "border-[#F9A825]" : "border-[#BDBDBD]"}`}>{!clubbed ? <span className="h-2.5 w-2.5 rounded-full bg-[#F9A825]" /> : null}</span>
                  <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center justify-between gap-2"><span className="flex flex-wrap items-center gap-2"><strong className="text-[17px] text-[#212121]">Priority — 12–15 min</strong><span className="rounded-full bg-[#FFF0C2] px-2 py-0.5 text-[12px] font-semibold text-[#9A6700]">Uses 1 of 3</span></span><strong className="text-[18px] text-[#B26A00]">₹45 delivery</strong></span><span className="mt-1 block text-[14px] leading-relaxed text-[#616161]">Solo rider, straight to you. {priorityDeliveriesRemaining} left this month.</span></span>
                </button>
              </div>

              <div className="overflow-hidden rounded-[4px] border border-[#E0E0E0] bg-white">
                <div className="space-y-3 p-5">
                  {cart.map(item => (
                    <div key={`${item.dishName}-${item.restaurantName}`} className="flex items-center justify-between gap-3 rounded-[4px] border border-[#F0F0F0] bg-[#FAFAFA] p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <VegIndicator veg={item.veg} />
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-medium text-[#212121]">{item.dishName}</p>
                          <p className="text-[13px] text-[#878787]">{item.restaurantName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center overflow-hidden rounded-[4px] border border-[#E0E0E0]">
                          <button type="button" onClick={() => removeFromCart(item.dishName, item.restaurantName)} className="flex h-7 w-7 items-center justify-center text-[#878787] hover:bg-[#F5F5F5]"><Minus className="h-3 w-3" /></button>
                          <span className="flex h-7 w-7 items-center justify-center text-[13px] font-bold text-[#212121]">{item.qty}</span>
                          <button type="button" onClick={() => addToCart(item.dishName, item.restaurantName, item.price, item.veg, item.image)} className="flex h-7 w-7 items-center justify-center text-[#2874F0] hover:bg-[#F0F5FF]"><Plus className="h-3 w-3" /></button>
                        </div>
                        <span className="w-14 text-right text-[15px] font-medium text-[#212121]">₹{item.price * item.qty}</span>
                        <button type="button" onClick={() => removeItemEntirely(item.dishName, item.restaurantName)} className="flex h-6 w-6 items-center justify-center rounded-full text-[#878787] hover:bg-[#FFEBEE] hover:text-[#E53935]"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E0E0E0] px-5 py-4 space-y-3">
                  <BillRow label={`Delivery fee (${clubbed ? "Clubbed" : "Priority"})`} original="₹90" value={`₹${DELIVERY_FEES[deliveryMode]}`} subtext={clubbed ? "bundled across brands, batched to Hostel Block C" : "solo rider, straight from Dash Hub Sector 12"} />
                  <BillRow label="Platform fee" value="₹12" />
                  <BillRow label="Packaging" value="₹15" />
                  <BillRow label="GST" value="₹10" />
                  {superCoinsApplied ? <div className="fade-in flex items-center justify-between gap-3 rounded-[4px] bg-[#FFFBE6] px-3 py-2.5"><div className="flex flex-wrap items-center gap-2"><span className="text-[16px] font-medium text-[#212121]">SuperCoins applied</span><span className="rounded-[4px] bg-[#FFE11B] px-2 py-1 text-[12px] font-bold text-[#174EA6]">Best value for you</span></div><span className="flex-shrink-0 text-[16px] font-semibold text-[#388E3C]">−45 coins (₹45)</span></div> : null}
                </div>

                <div className="mx-5 border-t-2 border-[#212121]" />
                <div className="flex items-center justify-between p-5"><span className="text-[22px] font-semibold text-[#212121]">You pay</span><span key={total} className="total-change text-[36px] font-bold tabular-nums text-[#212121]">₹{total}</span></div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-[4px] border border-[#E0E0E0] bg-white p-4 text-[14px] text-[#878787]"><MapPin className="h-4 w-4 text-[#2874F0]" /><span>Delivering to <strong className="font-semibold text-[#212121]">Hostel Block C, Sector 12</strong></span><button type="button" className="ml-auto font-semibold text-[#2874F0] hover:text-[#1A5DC8]">Change</button></div>
            </div>
          </section>
          <button type="button" onClick={() => navigate("tracking")} className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[4px] bg-[#2874F0] text-[17px] font-semibold tracking-wide text-white hover:bg-[#1A5DC8]">Place Order · ₹{total}</button>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[4px] border border-[#E0E0E0] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <h2 className="text-[18px] font-semibold leading-relaxed text-[#212121]">On other food delivery platforms, this same order:</h2>
            <p className="mt-2 text-[36px] font-bold tabular-nums text-[#212121]">₹{otherPlatformPrice}</p>
            <p className="text-[14px] text-[#878787]">{multiBrand ? `${brands.length} brands, ${brands.length} restaurants, ${brands.length} delivery fees.` : "Higher platform and delivery fees."}</p>
            <div className="mt-5 space-y-5">
              <div><div className="mb-1.5 flex items-center justify-between text-[14px] text-[#616161]"><span>Other platforms</span><span>₹{otherPlatformPrice}</span></div><div className="relative h-9 overflow-hidden rounded-[4px] bg-[#FFEBEE]"><div className="h-full w-full rounded-[4px] bg-[#E53935]" /><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] font-bold text-white">₹{otherPlatformPrice}</span></div></div>
              <div><div className="mb-1.5 flex items-center justify-between text-[14px] text-[#616161]"><span>Flipkart Dash</span><span className="animate-num">₹{total}</span></div><div className="relative h-9 overflow-hidden rounded-[4px] bg-[#E3F2FD]"><div className="h-full rounded-[4px] bg-[#2874F0]" style={{ width: `${(total / otherPlatformPrice) * 100}%` }} /><span key={total} className="total-change absolute left-3 top-1/2 -translate-y-1/2 text-[15px] font-bold text-white">₹{total}</span></div></div>
            </div>
            <div className="mt-5 border-t border-[#E0E0E0] pt-4"><p className="text-[17px] font-semibold text-[#388E3C]">You save ₹{savings} — {savingsPercent}% less.</p><p className="mt-2 text-[14px] leading-relaxed text-[#878787]">Comparison assumes identical items from the same brands, including all fees and taxes.</p></div>
          </section>
          <section className="rounded-[4px] border border-[#E0E0E0] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <div className="space-y-4">
              {["Cross-brand bundling — one rider, one fee", "Brands cook, Dash delivers — commission near 5%", "SuperCoins earned on your Flipkart shopping"].map(b => <div key={b} className="flex items-center gap-3 text-[15px] text-[#212121]"><span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#E8F5E9]"><Check className="h-4 w-4 text-[#388E3C]" /></span><span>{b}</span></div>)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* ── Screen 4: Tracking ── */

function TrackingPage({ step, order }: { step: number; order: PlacedOrder }) {
  const steps = ["Confirmed", "Preparing", "Picked up", "Arriving"];
  const priority = order.deliveryMode === "priority";
  const arrival = priority ? "Arriving in 14 minutes · Priority" : "Arriving in 22 minutes";
  const detail = priority ? "Solo rider from Dash Hub, Sector 12." : "Clubbed with 6 other orders to Hostel Block C — collected from Dash Hub, Sector 12.";
  const itemSummary = order.items.map(i => `${i.dishName} × ${i.qty}`).join(" · ");
  return (
    <div className="fade-in py-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-[60%]">
          <div className="relative h-[420px] overflow-hidden rounded-[4px] border border-[#C8E6C9] bg-[#E8F5E9]">
            <div className="absolute inset-0 flex items-center justify-center"><div className="relative h-[240px] w-[360px]"><div className="absolute left-0 right-0 top-1/2 h-[3px] bg-[#A5D6A7]" /><div className="absolute bottom-0 left-1/2 top-0 w-[3px] bg-[#A5D6A7]" /><div className="absolute left-1/2 top-0 -translate-x-1/2 text-center"><span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#2874F0] shadow"><UtensilsCrossed className="h-5 w-5 text-white" /></span><span className="mt-1 inline-block rounded-[4px] bg-white px-2 py-1 text-[13px] font-medium shadow">Dash Hub</span></div><div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"><span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6161] shadow"><MapPin className="h-5 w-5 text-white" /></span><span className="mt-1 inline-block rounded-[4px] bg-white px-2 py-1 text-[13px] font-medium shadow">Hostel Block C</span></div>{step >= 2 ? <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 ${step >= 3 ? "top-[172px]" : "top-[82px]"}`}><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#FFE11B] shadow"><Bike className="h-4 w-4 text-[#212121]" /></span></div> : null}</div></div>
            <div className="absolute bottom-4 left-4 right-4 rounded-[4px] bg-white px-4 py-3 shadow"><p className="text-[16px] font-bold text-[#212121]">{arrival}</p><p className="mt-0.5 text-[14px] leading-relaxed text-[#878787]">{detail}</p></div>
          </div>
        </div>
        <div className="lg:w-[40%]">
          <section className="rounded-[4px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"><h1 className="mb-5 text-[22px] font-semibold text-[#212121]">Order status</h1><div className="relative ml-3">{steps.map((l, i) => <div key={l} className="relative flex items-start gap-3 pb-7 last:pb-0">{i < steps.length - 1 ? <span className={`absolute left-[8px] top-[20px] h-[calc(100%-4px)] w-[2px] ${i < step ? "bg-[#388E3C]" : "bg-[#E0E0E0]"}`} /> : null}<span className={`mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 ${i <= step ? "border-[#388E3C] bg-[#388E3C]" : "border-[#E0E0E0] bg-white"}`}>{i <= step ? <Check className="h-3 w-3 text-white" /> : null}</span><span><span className={`block text-[16px] ${i <= step ? "font-semibold text-[#212121]" : "text-[#878787]"}`}>{l}</span>{i === step ? <span className="mt-0.5 block text-[14px] text-[#388E3C]">In progress</span> : null}</span></div>)}</div></section>
          <section className="mt-4 rounded-[4px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"><div className="flex items-start gap-3"><span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[4px] bg-[#F0F5FF]"><UtensilsCrossed className="h-5 w-5 text-[#2874F0]" /></span><div><p className="text-[16px] font-medium text-[#212121]">All items collected from Dash Hub, Sector 12 — 900m away.</p><p className="mt-1 text-[14px] text-[#878787]">Delivered by eKart.</p></div></div></section>
          <section className="mt-4 rounded-[4px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"><p className="text-[14px] leading-relaxed text-[#878787]">Order #FK-DASH-2026081742 · {itemSummary} · ₹{order.total}</p></section>
        </div>
      </div>
    </div>
  );
}

/* ── Screen 5: Confirmed ── */

function ConfirmedPage({ navigate, coins, order }: { navigate: (s: Screen) => void; coins: number; order: PlacedOrder }) {
  const products = [
    { name: "Wireless Headphones", price: 999, original: 2990, image: "/images/products/headphones-over-ear.webp", rating: 4.1 },
    { name: "Classic Cotton T-Shirt", price: 399, original: 999, image: "/images/products/tshirt.webp", rating: 4.3 },
    { name: "10000mAh Power Bank", price: 599, original: 1499, image: "/images/products/power-bank.webp", rating: 4.2 },
  ];
  const brands = [...new Set(order.items.map(i => i.restaurantName))];
  return (
    <div className="fade-in py-6">
      <div className="mx-auto max-w-[920px]">
        <section className="rounded-[4px] bg-white p-7 text-center shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
          <span className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-[#E8F5E9]"><CheckCircle2 className="h-11 w-11 text-[#388E3C]" /></span>
          <h1 className="text-[28px] font-semibold text-[#212121]">Order delivered!</h1>
          <p className="mt-1 text-[16px] text-[#878787]">Your {brands.join(" + ")} order has arrived</p>
          <div className="mt-4 text-left mx-auto max-w-[400px]">
            {order.items.map(i => (
              <div key={`${i.dishName}-${i.restaurantName}`} className="flex items-center justify-between border-b border-[#F0F0F0] py-2 last:border-b-0 text-[14px]">
                <span className="flex items-center gap-2"><VegIndicator veg={i.veg} /><span className="text-[#212121]">{i.dishName} × {i.qty}</span></span>
                <span className="text-[#878787]">₹{i.price * i.qty}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 inline-flex items-center gap-4 rounded-[4px] bg-gradient-to-r from-[#FFF8E1] to-[#FFF3E0] p-5 text-left"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]"><Zap className="h-6 w-6 fill-white text-white" /></span><div><p className="text-[18px] font-semibold text-[#212121]">You earned {COINS_EARNED} SuperCoins on this order.</p><p className="mt-0.5 text-[14px] text-[#878787]">New balance: {coins.toLocaleString()} SuperCoins</p></div></div>
          <div className="mt-5 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => navigate("food")} className="h-11 rounded-[4px] bg-[#2874F0] px-7 text-[16px] font-semibold text-white hover:bg-[#1A5DC8]">Order Again</button><button type="button" className="h-11 rounded-[4px] border border-[#E0E0E0] px-7 text-[16px] font-semibold text-[#212121] hover:bg-[#F5F5F5]">Rate Order</button></div>
        </section>
        <section className="mt-5 rounded-[4px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between px-5 pb-3 pt-5"><div><h2 className="text-[22px] font-semibold text-[#212121]">Spend them on Flipkart</h2><p className="mt-1 text-[14px] text-[#878787]">Use your {coins.toLocaleString()} SuperCoins on these deals</p></div><button type="button" className="text-[14px] font-semibold text-[#2874F0]">VIEW ALL</button></div>
          <div className="horizontal-rail hide-scrollbar flex gap-4 overflow-x-auto px-5 pb-5">
            {products.map(p => <button type="button" key={p.name} className="restaurant-card group w-[260px] flex-shrink-0 overflow-hidden border border-[#E0E0E0] bg-white text-left"><Photo src={p.image} alt={p.name} sizes="260px" /><span className="block p-4"><span className="block truncate text-[18px] font-semibold text-[#212121] group-hover:text-[#2874F0]">{p.name}</span><span className="mt-2 flex items-center gap-2"><span className="text-[18px] font-bold text-[#212121]">₹{p.price}</span><span className="text-[14px] text-[#878787] line-through">₹{p.original}</span></span><span className="mt-2 block"><RatingPill rating={p.rating} /></span><span className="mt-2 flex items-center gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]"><Zap className="h-2.5 w-2.5 fill-white text-white" /></span><span className="text-[14px] text-[#878787]">Pay with SuperCoins</span></span></span></button>)}
          </div>
        </section>
        <section className="mt-5 rounded-[4px] border border-[#D6E4FF] bg-[#F0F5FF] p-5 text-center"><p className="text-[18px] font-semibold text-[#2874F0]">The Flipkart Dash loop</p><p className="mt-1 text-[14px] text-[#878787]">Shop on Flipkart → earn SuperCoins → spend on Dash → earn more coins → shop again</p><div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[14px] text-[#212121]">{["Shopping", "SuperCoins", "Dash", "More Coins"].map((l, i) => <React.Fragment key={l}><span className={`rounded-[4px] border border-[#E0E0E0] px-3 py-1.5 ${i % 2 ? "bg-[#FFE11B] font-semibold" : "bg-white"}`}>{l}</span>{i < 3 ? <ChevronRight className="h-4 w-4 text-[#878787]" /> : null}</React.Fragment>)}</div></section>
      </div>
    </div>
  );
}

/* ── Modals ── */

function ClubbedExplainerModal({ onClose }: { onClose: () => void }) {
  useEffect(() => { const ov = document.body.style.overflow; const kd = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; document.body.style.overflow = "hidden"; document.addEventListener("keydown", kd); return () => { document.body.style.overflow = ov; document.removeEventListener("keydown", kd); }; }, [onClose]);
  const pts = [
    { icon: MapPin, copy: "Hubs sit next to campus, so hundreds of orders go to the same few gates." },
    { icon: Bike, copy: "One rider carries 6–8 orders on a single run, so the ₹90 fee splits to ₹12." },
    { icon: Zap, copy: "Priority skips the queue — 3 a month, so the clubbing still works for everyone." },
  ];
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/45" />
      <section role="dialog" aria-modal="true" aria-labelledby="clubbed-title" className="slide-up relative w-full max-w-[560px] rounded-[4px] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4"><div><p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#2874F0]">Flipkart Dash</p><h2 id="clubbed-title" className="mt-1 text-[22px] font-semibold text-[#212121]">How Clubbed delivery works</h2></div><button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full hover:bg-[#F1F3F6]"><X className="h-5 w-5 text-[#616161]" /></button></div>
        <div className="mt-5 space-y-3">{pts.map(({ icon: Icon, copy }) => <div key={copy} className="flex items-start gap-3 rounded-[4px] bg-[#F7F9FC] p-4"><span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF2FF]"><Icon className="h-5 w-5 text-[#2874F0]" /></span><p className="pt-1 text-[15px] leading-relaxed text-[#4B5563]">{copy}</p></div>)}</div>
      </section>
    </div>
  );
}

function EconomicsDrawer({ onClose }: { onClose: () => void }) {
  const blocks = [
    ["1", "Breakage is margin", "A share of issued loyalty points is never redeemed. That breakage converts a deferred liability into recognised revenue and creates a structural margin advantage at scale."],
    ["2", "Deferred revenue, not expense", "SuperCoins sit as deferred revenue until they are redeemed, creating a timing benefit while still giving customers a clear, useful balance."],
    ["3", "Redemption costs COGS, not face value", "When coins offset a delivery fee, the actual cost is the marginal cost of fulfilment rather than the full face value shown to the customer."],
    ["4", "The marketplace funds the loop", "Commerce and advertising economics can underwrite food-order acquisition while food creates more frequent engagement with the Flipkart ecosystem."],
  ];
  return (
    <div className="fixed inset-0 z-[100] flex justify-end" onClick={onClose}><div className="absolute inset-0 bg-black/40" /><aside className="slide-up relative h-full w-full max-w-[560px] overflow-y-auto bg-white" onClick={e => e.stopPropagation()}><div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E0E0E0] bg-white px-6 py-5"><h2 className="text-[22px] font-semibold text-[#212121]">The Economics of Flipkart Dash</h2><button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F1F3F6]"><X className="h-5 w-5 text-[#878787]" /></button></div><div className="space-y-5 p-6">{blocks.map(([n, t, c]) => <div key={n} className="rounded-[4px] bg-[#F1F3F6] p-5"><div className="mb-2 flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2874F0] text-[14px] font-bold text-white">{n}</span><h3 className="text-[18px] font-semibold text-[#212121]">{t}</h3></div><p className="text-[15px] leading-relaxed text-[#4B5563]">{c}</p></div>)}</div></aside></div>
  );
}
