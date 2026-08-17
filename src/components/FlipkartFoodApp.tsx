"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Baby,
  Bike,
  BookOpen,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Heart,
  Home,
  MapPin,
  MoreHorizontal,
  Plane,
  Search,
  Share2,
  ShoppingBasket,
  ShoppingCart,
  Sofa,
  Sparkles,
  Star,
  Tv,
  User,
  UtensilsCrossed,
  Wrench,
  X,
  Zap,
  Smartphone,
} from "lucide-react";

type Screen = "food" | "restaurant" | "checkout" | "tracking" | "confirmed";

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
const COINS_USED = 35;
const COINS_EARNED = 30;

const FOOD_IMAGES = {
  biryani: "/images/food/biryani.webp",
  butterChicken: "/images/food/butter-chicken.webp",
  masalaDosa: "/images/food/masala-dosa.webp",
  paneerTikka: "/images/food/paneer-tikka.webp",
  chowmein: "/images/food/chowmein.webp",
  vegThali: "/images/food/veg-thali.webp",
  samosas: "/images/food/samosas.webp",
  filterCoffee: "/images/food/filter-coffee.webp",
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
  { icon: UtensilsCrossed, label: "Food" },
  { icon: Car, label: "Auto" },
  { icon: Dumbbell, label: "Sports" },
  { icon: Sofa, label: "Furniture" },
  { icon: BookOpen, label: "Books" },
  { icon: Bike, label: "2 Wheeler" },
];

const RESTAURANTS: Restaurant[] = [
  {
    id: 0,
    name: "Biryani Blues",
    rating: 4.3,
    time: "18 min",
    original: 400,
    price: 142,
    image: FOOD_IMAGES.biryani,
    cuisine: "Biryani, North Indian, Mughlai",
    distance: "900 m",
    dishes: ["Hyderabadi Biryani", "Chicken 65", "Garlic Naan", "Gulab Jamun"],
  },
  {
    id: 1,
    name: "Punjab Grill",
    rating: 4.4,
    time: "21 min",
    original: 420,
    price: 156,
    image: FOOD_IMAGES.butterChicken,
    cuisine: "North Indian, Punjabi",
    distance: "1.2 km",
    dishes: ["Butter Chicken", "Paneer Butter Masala", "Dal Makhani"],
  },
  {
    id: 2,
    name: "South Express",
    rating: 4.5,
    time: "12 min",
    original: 220,
    price: 82,
    image: FOOD_IMAGES.masalaDosa,
    cuisine: "South Indian, Breakfast",
    distance: "650 m",
    dishes: ["Masala Dosa", "Filter Coffee"],
  },
  {
    id: 3,
    name: "Tandoori Nights",
    rating: 4.2,
    time: "25 min",
    original: 450,
    price: 165,
    image: FOOD_IMAGES.paneerTikka,
    cuisine: "Tandoor, North Indian",
    distance: "1.6 km",
    dishes: ["Paneer Tikka", "Butter Chicken"],
  },
  {
    id: 4,
    name: "Wok This Way",
    rating: 4.1,
    time: "20 min",
    original: 320,
    price: 115,
    image: FOOD_IMAGES.chowmein,
    cuisine: "Indo-Chinese, Noodles",
    distance: "1.1 km",
    dishes: ["Vegetable Chowmein"],
  },
  {
    id: 5,
    name: "Thali House",
    rating: 4.3,
    time: "19 min",
    original: 360,
    price: 129,
    image: FOOD_IMAGES.vegThali,
    cuisine: "North Indian, Homestyle",
    distance: "1.0 km",
    dishes: ["Veg Thali", "Dal Makhani"],
  },
  {
    id: 6,
    name: "Samosa Singh",
    rating: 4.4,
    time: "14 min",
    original: 240,
    price: 92,
    image: FOOD_IMAGES.samosas,
    cuisine: "Snacks, Street Food",
    distance: "750 m",
    dishes: ["Samosas", "Filter Coffee"],
  },
  {
    id: 7,
    name: "Chai & More",
    rating: 4.6,
    time: "10 min",
    original: 180,
    price: 68,
    image: FOOD_IMAGES.filterCoffee,
    cuisine: "Beverages, Quick Bites",
    distance: "500 m",
    dishes: ["Filter Coffee", "Samosas"],
  },
];

const DISH_DETAILS: Record<string, MenuItem> = {
  "Hyderabadi Biryani": {
    name: "Hyderabadi Biryani",
    veg: false,
    desc: "Aromatic basmati rice layered with tender chicken, saffron and traditional spices",
    price: 120,
    popular: true,
    image: FOOD_IMAGES.biryani,
  },
  "Butter Chicken": {
    name: "Butter Chicken",
    veg: false,
    desc: "Charred chicken simmered in a velvety tomato-butter gravy",
    price: 165,
    popular: true,
    image: FOOD_IMAGES.butterChicken,
  },
  "Masala Dosa": {
    name: "Masala Dosa",
    veg: true,
    desc: "Crisp dosa filled with spiced potato, served with sambar and chutneys",
    price: 82,
    popular: true,
    image: FOOD_IMAGES.masalaDosa,
  },
  "Paneer Tikka": {
    name: "Paneer Tikka",
    veg: true,
    desc: "Tandoor-charred paneer, peppers and onions with mint chutney",
    price: 148,
    popular: true,
    image: FOOD_IMAGES.paneerTikka,
  },
  "Vegetable Chowmein": {
    name: "Vegetable Chowmein",
    veg: true,
    desc: "Wok-tossed noodles with crisp vegetables and spring onion",
    price: 115,
    image: FOOD_IMAGES.chowmein,
  },
  "Veg Thali": {
    name: "Veg Thali",
    veg: true,
    desc: "Dal, seasonal sabzi, paneer curry, rice, roti, raita and salad",
    price: 129,
    popular: true,
    image: FOOD_IMAGES.vegThali,
  },
  Samosas: {
    name: "Samosas",
    veg: true,
    desc: "Three crisp samosas with mint and tamarind chutneys",
    price: 92,
    image: FOOD_IMAGES.samosas,
  },
  "Filter Coffee": {
    name: "Filter Coffee",
    veg: true,
    desc: "Freshly brewed South Indian filter coffee with dense foam",
    price: 68,
    image: FOOD_IMAGES.filterCoffee,
  },
  "Paneer Butter Masala": {
    name: "Paneer Butter Masala",
    veg: true,
    desc: "Cottage cheese cubes in rich tomato-butter gravy with kasuri methi",
    price: 140,
    image: "/images/menu/paneer-butter-masala.webp",
  },
  "Chicken 65": {
    name: "Chicken 65",
    veg: false,
    desc: "Crisp spiced chicken bites tossed with curry leaves and green chillies",
    price: 160,
    popular: true,
    image: "/images/menu/chicken-65.webp",
  },
  "Dal Makhani": {
    name: "Dal Makhani",
    veg: true,
    desc: "Black lentils slow-cooked overnight with butter and cream",
    price: 110,
    image: "/images/menu/dal-makhani.webp",
  },
  "Garlic Naan": {
    name: "Garlic Naan",
    veg: true,
    desc: "Tandoor-baked flatbread brushed with butter, garlic and coriander",
    price: 40,
    image: "/images/menu/garlic-naan.webp",
  },
  "Gulab Jamun": {
    name: "Gulab Jamun (2 pcs)",
    veg: true,
    desc: "Warm milk dumplings soaked in saffron-cardamom syrup",
    price: 60,
    image: "/images/menu/gulab-jamun.webp",
  },
};

const BIRYANI_MENU: MenuItem[] = [
  DISH_DETAILS["Hyderabadi Biryani"],
  DISH_DETAILS["Paneer Butter Masala"],
  DISH_DETAILS["Chicken 65"],
  DISH_DETAILS["Dal Makhani"],
  DISH_DETAILS["Garlic Naan"],
  DISH_DETAILS["Gulab Jamun"],
];

const DISH_SEARCH_INDEX = [
  { name: "Hyderabadi Biryani", restaurantId: 0 },
  { name: "Chicken 65", restaurantId: 0 },
  { name: "Garlic Naan", restaurantId: 0 },
  { name: "Gulab Jamun", restaurantId: 0 },
  { name: "Butter Chicken", restaurantId: 1 },
  { name: "Paneer Butter Masala", restaurantId: 1 },
  { name: "Dal Makhani", restaurantId: 1 },
  { name: "Masala Dosa", restaurantId: 2 },
  { name: "Filter Coffee", restaurantId: 2 },
  { name: "Paneer Tikka", restaurantId: 3 },
  { name: "Vegetable Chowmein", restaurantId: 4 },
  { name: "Veg Thali", restaurantId: 5 },
  { name: "Samosas", restaurantId: 6 },
];

const BANNERS = [
  {
    background: "bg-gradient-to-r from-[#174EA6] to-[#2874F0]",
    eyebrow: "SUPERCOIN SUPPER",
    title: "Your SuperCoins buy dinner now",
    subtitle: "Use coins earned on shopping to pay for food",
    image: FOOD_IMAGES.biryani,
  },
  {
    background: "bg-gradient-to-r from-[#6A3216] to-[#D45A25]",
    eyebrow: "CAMPUS FAVOURITES",
    title: "Big flavour, direct from the kitchen",
    subtitle: "ONDC-powered menus with no price inflation",
    image: FOOD_IMAGES.paneerTikka,
  },
  {
    background: "bg-gradient-to-r from-[#111827] to-[#334155]",
    eyebrow: "OPEN LATE",
    title: "Mess closed? We’re open till 2 AM",
    subtitle: "Late-night delivery from restaurants around campus",
    image: FOOD_IMAGES.chowmein,
  },
];

function Photo({
  src,
  alt,
  className = "",
  sizes = "(max-width: 640px) 100vw, 400px",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={900}
      sizes={sizes}
      priority={priority}
      className={`food-photo ${className}`}
    />
  );
}

function SuperCoinChip({ coins, pulse }: { coins: number; pulse: boolean }) {
  return (
    <button
      type="button"
      aria-label={`${coins.toLocaleString()} SuperCoins available`}
      className={`flex items-center gap-2 rounded-full border border-[#E0E0E0] bg-white px-3 py-1.5 hover:border-[#F9A825] hover:shadow-sm ${pulse ? "coin-pulse" : ""}`}
    >
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]">
        <Zap className="h-3.5 w-3.5 fill-white text-white" />
      </span>
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
  return (
    <span className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[2px] border-2 ${veg ? "border-[#388E3C]" : "border-[#E43B4F]"}`}>
      <span className={`h-2 w-2 rounded-full ${veg ? "bg-[#388E3C]" : "bg-[#E43B4F]"}`} />
    </span>
  );
}

function SearchBox({
  query,
  setQuery,
  results,
  onSelect,
}: {
  query: string;
  setQuery: (value: string) => void;
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className="relative w-full">
      <div className={`flex h-11 items-center gap-3 rounded-full border bg-white px-4 ${showDropdown ? "border-[#2874F0] shadow-[0_4px_12px_rgba(40,116,240,0.12)]" : "border-[#2874F0]"}`}>
        <Search className="h-5 w-5 flex-shrink-0 text-[#2874F0]" />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(event.target.value.trim().length > 0);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Search for restaurants, dishes and more"
          aria-label="Search restaurants and dishes"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="food-search-results"
          aria-expanded={showDropdown}
          className="min-w-0 flex-1 bg-transparent text-[16px] text-[#212121] outline-none placeholder:text-[#878787]"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#878787] hover:bg-[#F1F3F6] hover:text-[#212121]"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {showDropdown ? (
        <div id="food-search-results" role="listbox" className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] max-h-[420px] overflow-y-auto rounded-[4px] border border-[#E0E0E0] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
          {results.length ? (
            results.map((result) => (
              <button
                type="button"
                role="option"
                aria-selected="false"
                key={result.id}
                onClick={() => {
                  onSelect(result);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#F5F8FF]"
              >
                <span className="w-[64px] flex-shrink-0"><Photo src={result.image} alt="" sizes="64px" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] font-semibold text-[#212121]">{result.label}</span>
                  <span className="block truncate text-[14px] text-[#878787]">{result.type} · {result.meta}</span>
                </span>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#878787]" />
              </button>
            ))
          ) : (
            <div className="px-4 py-5 text-center text-[14px] text-[#878787]">No matching restaurants or dishes</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function FlipkartFoodApp() {
  const [screen, setScreen] = useState<Screen>("food");
  const [coins, setCoins] = useState(FULL_COIN_BALANCE);
  const [coinPulse, setCoinPulse] = useState(false);
  const [superCoinsApplied, setSuperCoinsApplied] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [economicsOpen, setEconomicsOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [trackingStep, setTrackingStep] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(0);

  const pulseCoin = useCallback(() => {
    setCoinPulse(true);
    window.setTimeout(() => setCoinPulse(false), 650);
  }, []);

  const navigate = useCallback((nextScreen: Screen) => {
    if (nextScreen === "checkout") {
      setCartCount(1);
      setSuperCoinsApplied(true);
      setCoins(FULL_COIN_BALANCE - COINS_USED);
      pulseCoin();
    }
    if (nextScreen === "tracking") setTrackingStep(0);
    if (nextScreen === "confirmed") {
      const postOrderBalance = (superCoinsApplied ? FULL_COIN_BALANCE - COINS_USED : FULL_COIN_BALANCE) + COINS_EARNED;
      setCoins(postOrderBalance);
      pulseCoin();
    }
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pulseCoin, superCoinsApplied]);

  const openRestaurant = useCallback((restaurantId: number) => {
    setSelectedRestaurantId(restaurantId);
    setQuery("");
    navigate("restaurant");
  }, [navigate]);

  const toggleSuperCoins = useCallback(() => {
    setSuperCoinsApplied((currentlyApplied) => {
      const nextApplied = !currentlyApplied;
      setCoins(nextApplied ? FULL_COIN_BALANCE - COINS_USED : FULL_COIN_BALANCE);
      pulseCoin();
      return nextApplied;
    });
  }, [pulseCoin]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setBannerIndex((index) => (index + 1) % BANNERS.length), 5000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (screen !== "tracking") return;
    let progress = 0;
    let completionTimer: number | undefined;
    const interval = window.setInterval(() => {
      progress += 1;
      setTrackingStep(progress);
      if (progress >= 3) {
        window.clearInterval(interval);
        completionTimer = window.setTimeout(() => navigate("confirmed"), 1800);
      }
    }, 2200);
    return () => {
      window.clearInterval(interval);
      if (completionTimer) window.clearTimeout(completionTimer);
    };
  }, [navigate, screen]);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleRestaurants = useMemo(() => {
    if (!normalizedQuery) return RESTAURANTS;
    return RESTAURANTS.filter((restaurant) =>
      [restaurant.name, restaurant.cuisine, ...restaurant.dishes].join(" ").toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!normalizedQuery) return [];
    const restaurantMatches: SearchResult[] = RESTAURANTS
      .filter((restaurant) => [restaurant.name, restaurant.cuisine].join(" ").toLowerCase().includes(normalizedQuery))
      .map((restaurant) => ({
        id: `restaurant-${restaurant.id}`,
        label: restaurant.name,
        meta: `${restaurant.cuisine} · ${restaurant.time}`,
        image: restaurant.image,
        restaurantId: restaurant.id,
        type: "Restaurant",
      }));
    const dishMatches: SearchResult[] = DISH_SEARCH_INDEX
      .filter((entry) => entry.name.toLowerCase().includes(normalizedQuery))
      .map((entry) => {
        const restaurant = RESTAURANTS[entry.restaurantId];
        return {
          id: `dish-${entry.restaurantId}-${entry.name}`,
          label: entry.name,
          meta: restaurant.name,
          image: DISH_DETAILS[entry.name].image,
          restaurantId: entry.restaurantId,
          type: "Dish",
        };
      });
    return [...restaurantMatches, ...dishMatches].slice(0, 8);
  }, [normalizedQuery]);

  const selectedRestaurant = RESTAURANTS.find((restaurant) => restaurant.id === selectedRestaurantId) ?? RESTAURANTS[0];
  const currentTotal = superCoinsApplied ? 132 : 167;
  const headerCompact = scrolled && screen !== "checkout";

  const handleSearchSelect = (result: SearchResult) => openRestaurant(result.restaurantId);

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      <header className="sticky top-0 z-50 border-b border-[#E0E0E0] bg-white">
        {!headerCompact ? (
          <>
            <div className="border-b border-[#F0F0F0] bg-white">
              <div className="page-shell flex min-h-11 items-center justify-between gap-4 py-1.5">
                <div className="flex items-center gap-3">
                  <FlipkartLogo />
                  <div className="hidden items-center gap-2 sm:flex">
                    {[{ icon: Plane, label: "Travel" }, { icon: ShoppingBasket, label: "Grocery" }].map(({ icon: Icon, label }) => (
                      <button key={label} type="button" className="flex items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-white px-3 py-1.5 text-[14px] text-[#5F6368] hover:border-[#2874F0] hover:text-[#2874F0]">
                        <Icon className="h-4 w-4" /> {label}
                      </button>
                    ))}
                    <button type="button" onClick={() => navigate("food")} className="flex items-center gap-1.5 rounded-full border-2 border-[#2874F0] bg-[#F0F5FF] px-3 py-1.5 text-[14px] font-semibold text-[#2874F0] hover:bg-[#E3EDFF]">
                      <UtensilsCrossed className="h-4 w-4" /> Food
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-5">
                  <button type="button" className="hidden items-center gap-1.5 text-[14px] text-[#212121] hover:text-[#2874F0] md:flex">
                    <MapPin className="h-4 w-4 text-[#2874F0]" />
                    <span className="max-w-[220px] truncate">Hostel Block C, Sector 12</span>
                    <ChevronDown className="h-3.5 w-3.5 text-[#878787]" />
                  </button>
                  <SuperCoinChip coins={coins} pulse={coinPulse} />
                </div>
              </div>
            </div>

            <div className="bg-white">
              <div className="page-shell flex min-h-16 items-center gap-5 py-2">
                <div className="min-w-0 flex-1">
                  <SearchBox query={query} setQuery={setQuery} results={searchResults} onSelect={handleSearchSelect} />
                </div>
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
                <div className="hide-scrollbar flex h-[84px] items-end gap-7 overflow-x-auto">
                  {CATEGORIES.map(({ icon: Icon, label }) => {
                    const active = label === "Food";
                    return (
                      <button key={label} type="button" onClick={() => active && navigate("food")} className={`relative flex min-w-[60px] flex-shrink-0 flex-col items-center gap-1.5 pb-3 ${active ? "text-[#2874F0]" : "text-[#6B7280] hover:text-[#212121]"}`}>
                        <span className={`flex h-9 w-9 items-center justify-center rounded-[4px] ${active ? "bg-[#F0F5FF]" : ""}`}><Icon className="h-5 w-5" strokeWidth={1.6} /></span>
                        <span className={`whitespace-nowrap text-[13px] ${active ? "font-bold" : "font-medium"}`}>{label}</span>
                        {active ? <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t bg-[#2874F0]" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white">
            <div className="page-shell flex min-h-16 items-center gap-4 py-2">
              <div onClick={() => navigate("food")} className="flex items-center gap-1"><FlipkartLogo /><ChevronDown className="h-4 w-4 text-[#878787]" /></div>
              <div className="min-w-0 flex-1"><SearchBox query={query} setQuery={setQuery} results={searchResults} onSelect={handleSearchSelect} /></div>
              <div className="flex items-center gap-4">
                <SuperCoinChip coins={coins} pulse={coinPulse} />
                <button type="button" className="hidden items-center gap-2 text-[15px] text-[#212121] lg:flex"><User className="h-5 w-5" /> Ashwin</button>
                <button type="button" onClick={() => cartCount > 0 && navigate("checkout")} className="relative flex items-center gap-2 text-[15px] text-[#212121] hover:text-[#2874F0]"><ShoppingCart className="h-5 w-5" /><span className="hidden sm:inline">Cart</span>{cartCount > 0 ? <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6161] text-[12px] font-bold text-white">{cartCount}</span> : null}</button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="page-shell">
        {screen === "food" ? <FoodLanding navigate={navigate} openRestaurant={openRestaurant} restaurants={visibleRestaurants} query={query} bannerIndex={bannerIndex} setBannerIndex={setBannerIndex} /> : null}
        {screen === "restaurant" ? <RestaurantPage navigate={navigate} restaurant={selectedRestaurant} /> : null}
        {screen === "checkout" ? <CheckoutPage navigate={navigate} superCoinsApplied={superCoinsApplied} toggleSuperCoins={toggleSuperCoins} total={currentTotal} /> : null}
        {screen === "tracking" ? <TrackingPage step={trackingStep} total={currentTotal} /> : null}
        {screen === "confirmed" ? <ConfirmedPage navigate={navigate} coins={coins} /> : null}
      </main>

      <footer className="mt-8 bg-[#172337] text-[14px] text-[#A8B0BC]">
        <div className="page-shell py-8">
          <div className="mb-6 flex flex-wrap gap-12">
            {[
              { title: "About", links: ["Contact Us", "About Us", "Careers"] },
              { title: "Help", links: ["Payments", "Shipping", "Returns"] },
              { title: "Policy", links: ["Return Policy", "Terms of Use", "Security"] },
              { title: "Social", links: ["Facebook", "X", "YouTube"] },
            ].map((group) => (
              <div key={group.title}><span className="text-[14px] font-semibold uppercase tracking-wider text-white">{group.title}</span><div className="mt-2 space-y-1.5">{group.links.map((link) => <button type="button" key={link} className="block hover:text-white">{link}</button>)}</div></div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2B3A4E] pt-5">
            <p>&copy; 2007–2026 Flipkart.com</p>
            <button type="button" onClick={() => setEconomicsOpen(true)} className="underline hover:text-white">The economics behind Flipkart Food</button>
          </div>
        </div>
      </footer>

      {economicsOpen ? <EconomicsDrawer onClose={() => setEconomicsOpen(false)} /> : null}
    </div>
  );
}

function RestaurantCard({ restaurant, onOpen, rail = false }: { restaurant: Restaurant; onOpen: () => void; rail?: boolean }) {
  return (
    <button type="button" onClick={onOpen} className={`restaurant-card group flex-shrink-0 overflow-hidden border border-[#E0E0E0] bg-white text-left ${rail ? "w-[260px]" : "w-full"}`}>
      <Photo src={restaurant.image} alt={`${restaurant.name} food`} className="min-h-[180px]" sizes={rail ? "260px" : "(max-width: 640px) 100vw, 280px"} />
      <span className="block p-4">
        <span className="block truncate text-[18px] font-semibold text-[#212121] group-hover:text-[#2874F0]">{restaurant.name}</span>
        <span className="mt-1 block truncate text-[14px] text-[#878787]">{restaurant.cuisine}</span>
        <span className="mt-2 flex items-center gap-2.5"><RatingPill rating={restaurant.rating} /><span className="flex items-center gap-1 text-[14px] text-[#878787]"><Clock className="h-4 w-4" /> {restaurant.time}</span></span>
        <span className="mt-2 flex items-center gap-2"><span className="text-[14px] text-[#878787] line-through">₹{restaurant.original}</span><span className="text-[18px] font-bold text-[#212121]">₹{restaurant.price}</span></span>
        <span className="mt-1.5 flex items-center gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]"><Zap className="h-2.5 w-2.5 fill-white text-white" /></span><span className="text-[14px] text-[#878787]">SuperCoins applied</span></span>
      </span>
    </button>
  );
}

function FoodLanding({
  navigate,
  openRestaurant,
  restaurants,
  query,
  bannerIndex,
  setBannerIndex,
}: {
  navigate: (screen: Screen) => void;
  openRestaurant: (id: number) => void;
  restaurants: Restaurant[];
  query: string;
  bannerIndex: number;
  setBannerIndex: (index: number) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const occasions = [
    { title: "Sunday", detail: "mess closed", image: FOOD_IMAGES.vegThali },
    { title: "Late night", detail: "after 9:30pm", image: FOOD_IMAGES.chowmein },
    { title: "Group order", detail: "match night", image: FOOD_IMAGES.biryani },
    { title: "Craving", detail: "something special", image: FOOD_IMAGES.paneerTikka },
  ];

  return (
    <div className="fade-in py-6">
      <section aria-label="Featured food offers" className="relative mb-7">
        <div className="overflow-hidden rounded-[4px]">
          <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${bannerIndex * 100}%)` }}>
            {BANNERS.map((banner, index) => (
              <button type="button" key={banner.title} onClick={() => openRestaurant(index === 2 ? 4 : index === 1 ? 3 : 0)} className={`relative min-h-[240px] min-w-full overflow-hidden rounded-[4px] text-left sm:min-h-[300px] ${banner.background}`}>
                <span className="absolute right-4 top-1/2 w-[400px] max-w-[48%] -translate-y-1/2 overflow-hidden rounded-[4px] shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
                  <Photo src={banner.image} alt="" priority={index === 0} sizes="(max-width: 640px) 48vw, 400px" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
                <span className="relative z-10 block max-w-[58%] px-16 py-10 text-white sm:px-20 sm:py-16">
                  <span className="mb-3 block text-[13px] font-bold tracking-[0.16em] text-white/80">{banner.eyebrow}</span>
                  <span className="block text-[28px] font-bold leading-tight sm:text-[36px]">{banner.title}</span>
                  <span className="mt-3 block text-[16px] leading-relaxed text-white/85 sm:text-[18px]">{banner.subtitle}</span>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-[4px] bg-white px-4 py-2 text-[15px] font-semibold text-[#2874F0]">Explore now <ChevronRight className="h-4 w-4" /></span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <button type="button" aria-label="Previous banner" onClick={() => setBannerIndex((bannerIndex - 1 + BANNERS.length) % BANNERS.length)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow hover:bg-[#F5F5F5] hover:shadow-md"><ChevronLeft className="h-5 w-5 text-[#212121]" /></button>
        <button type="button" aria-label="Next banner" onClick={() => setBannerIndex((bannerIndex + 1) % BANNERS.length)} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow hover:bg-[#F5F5F5] hover:shadow-md"><ChevronRight className="h-5 w-5 text-[#212121]" /></button>
        <div className="mt-3 flex justify-center gap-2">{BANNERS.map((banner, index) => <button type="button" aria-label={`Show banner ${index + 1}`} key={banner.title} onClick={() => setBannerIndex(index)} className={`h-2.5 rounded-full ${bannerIndex === index ? "w-7 bg-[#2874F0]" : "w-2.5 bg-[#C7C7C7] hover:bg-[#878787]"}`} />)}</div>
      </section>

      <section className="mb-5 rounded-[4px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between px-5 pb-3 pt-5">
          <div><h2 className="text-[22px] font-semibold text-[#212121]">{query ? `Results for “${query}”` : "Ashwin, hungry again?"}</h2><p className="mt-1 text-[14px] text-[#878787]">Real menus, campus-friendly delivery times</p></div>
          <button type="button" onClick={() => railRef.current?.scrollTo({ left: 0, behavior: "smooth" })} className="text-[14px] font-semibold text-[#2874F0] hover:text-[#1A5DC8]">VIEW ALL</button>
        </div>
        {restaurants.length ? (
          <div className="relative px-5 pb-5">
            <div ref={railRef} className="hide-scrollbar flex gap-4 overflow-x-auto pr-14">{restaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} rail onOpen={() => openRestaurant(restaurant.id)} />)}</div>
            <button type="button" aria-label="Scroll restaurants" onClick={() => railRef.current?.scrollBy({ left: 552, behavior: "smooth" })} className="absolute right-3 top-[128px] flex h-11 w-11 items-center justify-center rounded-full border border-[#E0E0E0] bg-white shadow hover:bg-[#F5F5F5] hover:shadow-md"><ChevronRight className="h-5 w-5" /></button>
          </div>
        ) : <div className="px-5 pb-7 text-[16px] text-[#878787]">No restaurants match this search. Try a dish or cuisine.</div>}
      </section>

      <section className="rounded-[4px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
        <div className="px-5 pb-3 pt-5"><h2 className="text-[22px] font-semibold text-[#212121]">Under 20 minutes near Hostel Block C</h2><p className="mt-1 text-[14px] text-[#878787]">Delivered by eKart — Flipkart’s own fleet</p></div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 px-5 pb-5">{restaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} onOpen={() => openRestaurant(restaurant.id)} />)}</div>
      </section>

      <section className="mt-5 rounded-[4px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
        <div className="mb-4"><h2 className="text-[22px] font-semibold text-[#212121]">Why he comes back</h2><p className="mt-1 text-[14px] text-[#878787]">Four moments where convenience matters more than a routine meal.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((occasion) => (
            <button type="button" key={occasion.title} onClick={() => navigate("food")} className="restaurant-card overflow-hidden border border-[#E0E0E0] bg-white text-left">
              <Photo src={occasion.image} alt={`${occasion.title} food occasion`} sizes="(max-width: 640px) 100vw, 300px" />
              <span className="block p-4"><span className="block text-[18px] font-semibold text-[#212121]">{occasion.title}</span><span className="mt-1 block text-[14px] text-[#878787]">{occasion.detail}</span></span>
            </button>
          ))}
        </div>
        <p className="mt-5 rounded-[4px] bg-[#F0F5FF] px-4 py-3 text-[16px] font-medium text-[#2874F0]">The mess is free on weekdays. We win the four times a month it can&apos;t serve.</p>
      </section>
    </div>
  );
}

function RestaurantPage({ navigate, restaurant }: { navigate: (screen: Screen) => void; restaurant: Restaurant }) {
  const [added, setAdded] = useState<Set<number>>(new Set());
  const menu = restaurant.id === 0
    ? BIRYANI_MENU
    : restaurant.dishes.map((dish) => DISH_DETAILS[dish]).filter((item): item is MenuItem => Boolean(item));
  const gallery = [restaurant.image, FOOD_IMAGES.biryani, FOOD_IMAGES.paneerTikka, FOOD_IMAGES.vegThali];

  return (
    <div className="fade-in py-6">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-[14px] text-[#878787]">
        <button type="button" onClick={() => navigate("food")} className="hover:text-[#2874F0]">Food</button><ChevronRight className="h-4 w-4" /><span className="text-[#212121]">{restaurant.name}</span>
      </nav>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-[40%]">
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((image, index) => (
              <div key={`${image}-${index}`} className="relative overflow-hidden rounded-[4px]">
                <Photo src={image} alt={`${restaurant.name} food ${index + 1}`} sizes="(max-width: 1024px) 50vw, 280px" priority={index === 0} />
                {index === 0 ? <div className="absolute right-2 top-2 flex gap-2"><button type="button" aria-label="Save restaurant" className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow hover:bg-[#F5F5F5]"><Heart className="h-4.5 w-4.5 text-[#616161]" /></button><button type="button" aria-label="Share restaurant" className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow hover:bg-[#F5F5F5]"><Share2 className="h-4.5 w-4.5 text-[#616161]" /></button></div> : null}
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
              <div>
                {menu.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex gap-4 border-b border-[#ECECEC] py-4 last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2"><VegIndicator veg={item.veg} /><h3 className="text-[18px] font-semibold text-[#212121]">{item.name}</h3>{item.popular ? <span className="rounded-[4px] border border-[#FF6161] px-2 py-0.5 text-[12px] font-semibold text-[#E43B4F]">BESTSELLER</span> : null}</div>
                      <p className="mt-2 text-[16px] font-medium text-[#212121]">₹{item.price}</p>
                      <p className="mt-1 max-w-[600px] text-[14px] leading-relaxed text-[#878787]">{item.desc}</p>
                    </div>
                    <div className="w-[132px] flex-shrink-0">
                      <Photo src={item.image} alt={item.name} sizes="132px" />
                      <button type="button" onClick={() => setAdded((previous) => new Set(previous).add(index))} className={`mx-auto -mt-4 flex h-9 min-w-[92px] items-center justify-center rounded-[4px] border bg-white px-4 text-[14px] font-semibold shadow ${added.has(index) ? "border-[#388E3C] text-[#388E3C]" : "border-[#2874F0] text-[#2874F0] hover:bg-[#F0F5FF]"}`}>
                        {added.has(index) ? <><Check className="mr-1 h-4 w-4" /> Added</> : "ADD"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button type="button" onClick={() => navigate("checkout")} className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-[4px] bg-[#2874F0] text-[16px] font-semibold text-white hover:bg-[#1A5DC8]">Proceed to checkout <ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
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

function CheckoutPage({ navigate, superCoinsApplied, toggleSuperCoins, total }: { navigate: (screen: Screen) => void; superCoinsApplied: boolean; toggleSuperCoins: () => void; total: number }) {
  const savings = 241 - total;
  const savingsPercent = Math.round((savings / 241) * 100);
  return (
    <div className="fade-in py-6">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-[14px] text-[#878787]"><button type="button" onClick={() => navigate("food")} className="hover:text-[#2874F0]">Food</button><ChevronRight className="h-4 w-4" /><button type="button" onClick={() => navigate("restaurant")} className="hover:text-[#2874F0]">Biryani Blues</button><ChevronRight className="h-4 w-4" /><span className="text-[#212121]">Checkout</span></nav>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <div>
          <section className="overflow-hidden rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
            <div className="flex min-h-14 items-center justify-between gap-3 bg-[#2874F0] px-5 py-3 text-white">
              <div className="flex flex-wrap items-center gap-3"><span className="rounded-[4px] bg-[#FFE11B] px-2.5 py-1 text-[13px] font-bold tracking-wider text-[#174EA6]">WOW! DEAL</span><h1 className="text-[18px] font-semibold">Apply SuperCoins for maximum savings</h1></div><ChevronDown className="h-5 w-5 flex-shrink-0" />
            </div>
            <div className="border border-t-0 border-[#D6E4FF] bg-[#F0F5FF] p-5">
              <div className={`mb-5 flex items-center justify-between gap-4 rounded-[4px] border bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${superCoinsApplied ? "border-[#2874F0] ring-2 ring-[#2874F0]/10" : "border-[#E0E0E0]"}`}>
                <div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow"><Zap className="h-6 w-6 fill-white text-white" /></span><div><p className="text-[18px] font-semibold text-[#212121]">Apply SuperCoins</p><p className="mt-0.5 text-[14px] text-[#878787]">Use 35 coins to save ₹35 instantly</p></div></div>
                <button type="button" role="switch" aria-checked={superCoinsApplied} aria-label="Apply SuperCoins" onClick={toggleSuperCoins} className={`relative h-8 w-14 flex-shrink-0 rounded-full ${superCoinsApplied ? "bg-[#2874F0]" : "bg-[#BDBDBD]"}`}><span className={`absolute left-0 top-1 h-6 w-6 rounded-full bg-white shadow-md ${superCoinsApplied ? "translate-x-7" : "translate-x-1"}`} /></button>
              </div>

              <div className="overflow-hidden rounded-[4px] border border-[#E0E0E0] bg-white">
                <div className="space-y-4 p-5">
                  <BillRow label="Hyderabadi Biryani × 1" value="₹120" subtext="ONDC direct · same price as in-store" />
                  <BillRow label="Delivery fee" original="₹45" value="₹12" subtext="batched to Hostel Block C · split across 8 orders" />
                  <BillRow label="Platform fee" value="₹12" />
                  <BillRow label="Packaging" value="₹15" />
                  <BillRow label="GST" value="₹8" />
                  {superCoinsApplied ? <div className="fade-in flex items-center justify-between gap-3 rounded-[4px] bg-[#FFFBE6] px-3 py-2.5"><div className="flex flex-wrap items-center gap-2"><span className="text-[16px] font-medium text-[#212121]">SuperCoins applied</span><span className="rounded-[4px] bg-[#FFE11B] px-2 py-1 text-[12px] font-bold text-[#174EA6]">Best value for you</span></div><span className="flex-shrink-0 text-[16px] font-semibold text-[#388E3C]">−35 coins (₹35)</span></div> : null}
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
            <p className="mt-2 text-[36px] font-bold tabular-nums text-[#212121]">₹241</p>
            <div className="mt-5 space-y-5">
              <div><div className="mb-1.5 flex items-center justify-between text-[14px] text-[#616161]"><span>Other platforms</span><span>₹241</span></div><div className="relative h-9 overflow-hidden rounded-[4px] bg-[#FFEBEE]"><div className="h-full w-full rounded-[4px] bg-[#E53935]" /><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] font-bold text-white">₹241</span></div></div>
              <div><div className="mb-1.5 flex items-center justify-between text-[14px] text-[#616161]"><span>Flipkart Food</span><span className="animate-num">₹{total}</span></div><div className="relative h-9 overflow-hidden rounded-[4px] bg-[#E3F2FD]"><div className="h-full rounded-[4px] bg-[#2874F0]" style={{ width: `${(total / 241) * 100}%` }} /><span key={total} className="total-change absolute left-3 top-1/2 -translate-y-1/2 text-[15px] font-bold text-white">₹{total}</span></div></div>
            </div>
            <div className="mt-5 border-t border-[#E0E0E0] pt-4"><p className="text-[17px] font-semibold text-[#388E3C]">You save ₹{savings} — {savingsPercent}% less.</p><p className="mt-2 text-[14px] leading-relaxed text-[#878787]">Comparison assumes identical dish from the same restaurant, including all fees and taxes.</p></div>
          </section>
          <section className="rounded-[4px] border border-[#E0E0E0] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <div className="space-y-4">
              {["SuperCoins earned on your Flipkart shopping", "ONDC-powered — no menu inflation", "Batched campus delivery — fees split, not subsidised"].map((badge) => <div key={badge} className="flex items-center gap-3 text-[15px] text-[#212121]"><span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#E8F5E9]"><Check className="h-4 w-4 text-[#388E3C]" /></span><span>{badge}</span></div>)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function TrackingPage({ step, total }: { step: number; total: number }) {
  const steps = ["Confirmed", "Preparing", "Picked up", "Arriving"];
  return (
    <div className="fade-in py-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-[60%]">
          <div className="relative h-[420px] overflow-hidden rounded-[4px] border border-[#C8E6C9] bg-[#E8F5E9]">
            <div className="absolute inset-0 flex items-center justify-center"><div className="relative h-[240px] w-[360px]"><div className="absolute left-0 right-0 top-1/2 h-[3px] bg-[#A5D6A7]" /><div className="absolute bottom-0 left-1/2 top-0 w-[3px] bg-[#A5D6A7]" /><div className="absolute left-1/2 top-0 -translate-x-1/2 text-center"><span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#2874F0] shadow"><UtensilsCrossed className="h-5 w-5 text-white" /></span><span className="mt-1 inline-block rounded-[4px] bg-white px-2 py-1 text-[13px] font-medium shadow">Restaurant</span></div><div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"><span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6161] shadow"><MapPin className="h-5 w-5 text-white" /></span><span className="mt-1 inline-block rounded-[4px] bg-white px-2 py-1 text-[13px] font-medium shadow">Hostel Block C</span></div>{step >= 2 ? <div className={`absolute left-1/2 -translate-x-1/2 ${step >= 3 ? "top-[172px]" : "top-[82px]"}`}><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#FFE11B] shadow"><Bike className="h-4 w-4 text-[#212121]" /></span></div> : null}</div></div>
            <div className="absolute bottom-4 left-4 rounded-[4px] bg-white px-4 py-3 shadow"><p className="text-[16px] font-bold text-[#212121]">Arriving in 14 minutes</p><p className="mt-0.5 text-[14px] text-[#878787]">900 m away</p></div>
          </div>
        </div>
        <div className="lg:w-[40%]">
          <section className="rounded-[4px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"><h1 className="mb-5 text-[22px] font-semibold text-[#212121]">Order Status</h1><div className="relative ml-3">{steps.map((label, index) => <div key={label} className="relative flex items-start gap-3 pb-7 last:pb-0">{index < steps.length - 1 ? <span className={`absolute left-[8px] top-[20px] h-[calc(100%-4px)] w-[2px] ${index < step ? "bg-[#388E3C]" : "bg-[#E0E0E0]"}`} /> : null}<span className={`mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 ${index <= step ? "border-[#388E3C] bg-[#388E3C]" : "border-[#E0E0E0] bg-white"}`}>{index <= step ? <Check className="h-3 w-3 text-white" /> : null}</span><span><span className={`block text-[16px] ${index <= step ? "font-semibold text-[#212121]" : "text-[#878787]"}`}>{label}</span>{index === step ? <span className="mt-0.5 block text-[14px] text-[#388E3C]">In progress</span> : null}</span></div>)}</div></section>
          <section className="mt-4 rounded-[4px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"><div className="flex items-start gap-3"><span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[4px] bg-[#F0F5FF]"><UtensilsCrossed className="h-5 w-5 text-[#2874F0]" /></span><div><p className="text-[16px] font-medium text-[#212121]">Prepared at Biryani Blues, Sector 12</p><p className="mt-1 text-[14px] text-[#878787]">900 m away · delivered by eKart</p></div></div></section>
          <section className="mt-4 rounded-[4px] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"><p className="text-[14px] text-[#878787]">Order #FK-FD-2026081742 · Hyderabadi Biryani × 1 · ₹{total}</p></section>
        </div>
      </div>
    </div>
  );
}

function ConfirmedPage({ navigate, coins }: { navigate: (screen: Screen) => void; coins: number }) {
  const products = [
    { name: "Wireless Headphones", price: 999, original: 2990, image: "/images/products/headphones-over-ear.webp", rating: 4.1 },
    { name: "Classic Cotton T-Shirt", price: 399, original: 999, image: "/images/products/tshirt.webp", rating: 4.3 },
    { name: "10000mAh Power Bank", price: 599, original: 1499, image: "/images/products/power-bank.webp", rating: 4.2 },
  ];
  return (
    <div className="fade-in py-6">
      <div className="mx-auto max-w-[920px]">
        <section className="rounded-[4px] bg-white p-7 text-center shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
          <span className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-[#E8F5E9]"><CheckCircle2 className="h-11 w-11 text-[#388E3C]" /></span>
          <h1 className="text-[28px] font-semibold text-[#212121]">Order delivered!</h1><p className="mt-1 text-[16px] text-[#878787]">Your Hyderabadi Biryani from Biryani Blues has arrived</p>
          <div className="mt-5 inline-flex items-center gap-4 rounded-[4px] bg-gradient-to-r from-[#FFF8E1] to-[#FFF3E0] p-5 text-left"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]"><Zap className="h-6 w-6 fill-white text-white" /></span><div><p className="text-[18px] font-semibold text-[#212121]">You earned 30 SuperCoins on this order.</p><p className="mt-0.5 text-[14px] text-[#878787]">New balance: {coins.toLocaleString()} SuperCoins</p></div></div>
          <div className="mt-5 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => navigate("food")} className="h-11 rounded-[4px] bg-[#2874F0] px-7 text-[16px] font-semibold text-white hover:bg-[#1A5DC8]">Order Again</button><button type="button" className="h-11 rounded-[4px] border border-[#E0E0E0] px-7 text-[16px] font-semibold text-[#212121] hover:bg-[#F5F5F5]">Rate Order</button></div>
        </section>

        <section className="mt-5 rounded-[4px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between px-5 pb-3 pt-5"><div><h2 className="text-[22px] font-semibold text-[#212121]">Spend them on Flipkart</h2><p className="mt-1 text-[14px] text-[#878787]">Use your {coins.toLocaleString()} SuperCoins on these deals</p></div><button type="button" className="text-[14px] font-semibold text-[#2874F0] hover:text-[#1A5DC8]">VIEW ALL</button></div>
          <div className="hide-scrollbar flex gap-4 overflow-x-auto px-5 pb-5">
            {products.map((product) => <button type="button" key={product.name} className="restaurant-card group w-[260px] flex-shrink-0 overflow-hidden border border-[#E0E0E0] bg-white text-left"><Photo src={product.image} alt={product.name} sizes="260px" /><span className="block p-4"><span className="block truncate text-[18px] font-semibold text-[#212121] group-hover:text-[#2874F0]">{product.name}</span><span className="mt-2 flex items-center gap-2"><span className="text-[18px] font-bold text-[#212121]">₹{product.price}</span><span className="text-[14px] text-[#878787] line-through">₹{product.original}</span></span><span className="mt-2 block"><RatingPill rating={product.rating} /></span><span className="mt-2 flex items-center gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500]"><Zap className="h-2.5 w-2.5 fill-white text-white" /></span><span className="text-[14px] text-[#878787]">Pay with SuperCoins</span></span></span></button>)}
          </div>
        </section>

        <section className="mt-5 rounded-[4px] border border-[#D6E4FF] bg-[#F0F5FF] p-5 text-center"><p className="text-[18px] font-semibold text-[#2874F0]">The Flipkart loop</p><p className="mt-1 text-[14px] text-[#878787]">Shop on Flipkart → earn SuperCoins → spend on food → earn more coins → shop again</p><div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[14px] text-[#212121]">{["Shopping", "SuperCoins", "Food", "More Coins"].map((label, index) => <React.Fragment key={label}><span className={`rounded-[4px] border border-[#E0E0E0] px-3 py-1.5 ${index % 2 ? "bg-[#FFE11B] font-semibold" : "bg-white"}`}>{label}</span>{index < 3 ? <ChevronRight className="h-4 w-4 text-[#878787]" /> : null}</React.Fragment>)}</div></section>
      </div>
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
    <div className="fixed inset-0 z-[100] flex justify-end" onClick={onClose}><div className="absolute inset-0 bg-black/40" /><aside className="slide-up relative h-full w-full max-w-[560px] overflow-y-auto bg-white" onClick={(event) => event.stopPropagation()}><div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E0E0E0] bg-white px-6 py-5"><h2 className="text-[22px] font-semibold text-[#212121]">The Economics of Flipkart Food</h2><button type="button" onClick={onClose} aria-label="Close economics panel" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#F1F3F6]"><X className="h-5 w-5 text-[#878787]" /></button></div><div className="space-y-5 p-6">{blocks.map(([number, title, copy]) => <div key={number} className="rounded-[4px] bg-[#F1F3F6] p-5"><div className="mb-2 flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2874F0] text-[14px] font-bold text-white">{number}</span><h3 className="text-[18px] font-semibold text-[#212121]">{title}</h3></div><p className="text-[15px] leading-relaxed text-[#4B5563]">{copy}</p></div>)}</div></aside></div>
  );
}
