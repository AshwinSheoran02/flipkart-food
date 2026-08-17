"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, ShoppingCart, ChevronDown, ChevronRight, ChevronLeft,
  MapPin, User, MoreHorizontal, Heart, Share2, Star, Zap,
  Clock, Check, CheckCircle2, X, Plane, ShoppingBasket, UtensilsCrossed,
  Smartphone, Tv, Sparkles, Home, Wrench, Gamepad2, Car, Dumbbell,
  Sofa, BookOpen, Bike, Monitor, Baby,
} from "lucide-react";

type Screen = "food" | "restaurant" | "checkout" | "tracking" | "confirmed";

const CATEGORIES = [
  { icon: Sparkles, label: "For You" },
  { icon: UtensilsCrossed, label: "Fashion" },
  { icon: Smartphone, label: "Mobiles" },
  { icon: Tv, label: "Electronics" },
  { icon: Sparkles, label: "Beauty" },
  { icon: Home, label: "Home" },
  { icon: Wrench, label: "Appliances" },
  { icon: Baby, label: "Toys" },
  { icon: UtensilsCrossed, label: "Food", active: true },
  { icon: Car, label: "Auto" },
  { icon: Dumbbell, label: "Sports" },
  { icon: Sofa, label: "Furniture" },
  { icon: BookOpen, label: "Books" },
  { icon: Bike, label: "2 Wheeler" },
];

const RESTAURANTS = [
  { name: "Biryani Blues", rating: 4.3, time: "18 min", original: 400, price: 142, img: "🍛" },
  { name: "Pizza Paradise", rating: 4.1, time: "22 min", original: 350, price: 128, img: "🍕" },
  { name: "Burger Junction", rating: 4.5, time: "15 min", original: 280, price: 98, img: "🍔" },
  { name: "Tandoori Nights", rating: 4.2, time: "25 min", original: 450, price: 165, img: "🍗" },
  { name: "South Express", rating: 4.4, time: "12 min", original: 200, price: 82, img: "🥘" },
  { name: "Wok This Way", rating: 4.0, time: "20 min", original: 320, price: 115, img: "🥡" },
  { name: "Wrap Republic", rating: 4.3, time: "14 min", original: 250, price: 92, img: "🌯" },
  { name: "Chai & More", rating: 4.6, time: "10 min", original: 180, price: 68, img: "☕" },
];

const MENU_ITEMS = [
  { name: "Hyderabadi Biryani", veg: false, desc: "Aromatic basmati rice layered with tender chicken, slow-cooked with saffron and traditional spices", price: 120, popular: true },
  { name: "Paneer Butter Masala", veg: true, desc: "Cottage cheese cubes in rich tomato-butter gravy with kasuri methi", price: 140, popular: false },
  { name: "Chicken 65", veg: false, desc: "Spicy, deep-fried chicken bites with curry leaves and red chillies", price: 160, popular: true },
  { name: "Dal Makhani", veg: true, desc: "Black lentils slow-cooked overnight with butter and cream", price: 110, popular: false },
  { name: "Garlic Naan", veg: true, desc: "Tandoor-baked flatbread with fresh garlic and butter", price: 40, popular: false },
  { name: "Gulab Jamun (2 pcs)", veg: true, desc: "Deep-fried milk dumplings soaked in sugar syrup", price: 60, popular: false },
];

function SuperCoinChip({ coins, pulse }: { coins: number; pulse: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E0E0E0] bg-white cursor-pointer hover:shadow-sm transition-all ${pulse ? "coin-pulse" : ""}`}>
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center flex-shrink-0">
        <Zap className="w-3 h-3 text-white fill-white" />
      </div>
      <span className="text-xs font-semibold text-[#212121] animate-num tabular-nums">{coins.toLocaleString()}</span>
    </div>
  );
}

function FlipkartLogo() {
  return (
    <div className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#FFE11B] cursor-pointer flex-shrink-0">
      <span className="text-[#2874F0] font-bold text-lg italic tracking-tight">f</span>
      <span className="text-[#2874F0] font-semibold text-sm italic">Flipkart</span>
    </div>
  );
}

function RatingPill({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#388E3C] text-white text-xs font-semibold rounded-sm">
      {rating} <Star className="w-2.5 h-2.5 fill-white" />
      {count && <span className="text-white/80 ml-0.5">| {count.toLocaleString()}</span>}
    </span>
  );
}

function VegIndicator({ veg }: { veg: boolean }) {
  return (
    <div className={`w-4 h-4 border-2 ${veg ? "border-[#388E3C]" : "border-[#E43B4F]"} rounded-sm flex items-center justify-center flex-shrink-0`}>
      <div className={`w-2 h-2 rounded-full ${veg ? "bg-[#388E3C]" : "bg-[#E43B4F]"}`} />
    </div>
  );
}

function FoodImage({ emoji, className = "" }: { emoji: string; className?: string }) {
  const bgColors: Record<string, string> = {
    "🍛": "#FFF3E0", "🍕": "#FFF8E1", "🍔": "#FFF3E0", "🍗": "#FFEBEE",
    "🥘": "#FFF8E1", "🥡": "#E8F5E9", "🌯": "#FFF3E0", "☕": "#EFEBE9",
  };
  const bg = bgColors[emoji] || "#F5F5F5";
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ background: bg }}>
      <span className="text-4xl select-none" role="img">{emoji}</span>
    </div>
  );
}

export function FlipkartFoodApp() {
  const [screen, setScreen] = useState<Screen>("food");
  const [coins, setCoins] = useState(1240);
  const [coinPulse, setCoinPulse] = useState(false);
  const [superCoinsApplied, setSuperCoinsApplied] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [economicsOpen, setEconomicsOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [trackingStep, setTrackingStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  useEffect(() => {
    const interval = setInterval(() => setBannerIndex(i => (i + 1) % 3), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (screen === "tracking") {
      setTrackingStep(0);
      let step = 0;
      timerRef.current = setInterval(() => {
        step++;
        setTrackingStep(step);
        if (step >= 3) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeout(() => navigate("confirmed"), 2000);
        }
      }, 2500);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [screen]);

  const pulseCoin = useCallback(() => {
    setCoinPulse(true);
    setTimeout(() => setCoinPulse(false), 600);
  }, []);

  const navigate = useCallback((s: Screen) => {
    setScreen(s);
    if (s === "checkout") {
      setCartCount(1);
      setSuperCoinsApplied(true);
      setCoins(1000);
      pulseCoin();
    }
    if (s === "confirmed") {
      setCoins(1030);
      pulseCoin();
    }
  }, [pulseCoin]);

  const toggleSuperCoins = useCallback(() => {
    setSuperCoinsApplied(prev => {
      const next = !prev;
      setCoins(next ? 1000 : 1240);
      pulseCoin();
      return next;
    });
  }, [pulseCoin]);

  const headerCompact = scrolled && screen !== "checkout";

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E0E0E0]">
        {!headerCompact ? (
          <>
            {/* Row 1 — Utility strip */}
            <div className="bg-white border-b border-[#F0F0F0]">
              <div className="max-w-[1440px] mx-auto px-4 h-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FlipkartLogo />
                  <div className="flex items-center gap-2 ml-2">
                    <button className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E0E0E0] text-xs text-[#878787] hover:border-[#2874F0] hover:text-[#2874F0] transition-colors bg-white">
                      <Plane className="w-3.5 h-3.5" /> Travel
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E0E0E0] text-xs text-[#878787] hover:border-[#2874F0] hover:text-[#2874F0] transition-colors bg-white">
                      <ShoppingBasket className="w-3.5 h-3.5" /> Grocery
                    </button>
                    <button
                      onClick={() => navigate("food")}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#2874F0] text-xs text-[#2874F0] font-semibold bg-[#F0F5FF]"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" /> Food
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-xs text-[#212121] hover:text-[#2874F0] transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-[#2874F0]" />
                    <span className="max-w-[160px] truncate">Hostel Block C, Sector 12</span>
                    <ChevronDown className="w-3 h-3 text-[#878787]" />
                  </button>
                  <SuperCoinChip coins={coins} pulse={coinPulse} />
                </div>
              </div>
            </div>

            {/* Row 2 — Search bar */}
            <div className="bg-white">
              <div className="max-w-[1440px] mx-auto px-4 h-12 flex items-center gap-4">
                <div className="flex-1 relative">
                  <div className="flex items-center h-9 rounded-full border border-[#2874F0] bg-white px-3 gap-2">
                    <Search className="w-4 h-4 text-[#2874F0] flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search for restaurants, dishes and more"
                      className="flex-1 text-sm text-[#212121] placeholder:text-[#878787] outline-none bg-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <button className="flex items-center gap-1.5 text-sm text-[#212121] hover:text-[#2874F0] transition-colors">
                    <User className="w-4 h-4" /> Ashwin <ChevronDown className="w-3 h-3 text-[#878787]" />
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-[#212121] hover:text-[#2874F0] transition-colors">
                    <MoreHorizontal className="w-4 h-4" /> More <ChevronDown className="w-3 h-3 text-[#878787]" />
                  </button>
                  <button
                    onClick={() => cartCount > 0 ? navigate("checkout") : null}
                    className="flex items-center gap-1.5 text-sm text-[#212121] hover:text-[#2874F0] transition-colors relative"
                  >
                    <ShoppingCart className="w-4 h-4" /> Cart
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#FF6161] text-white text-[10px] font-bold flex items-center justify-center">{cartCount}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3 — Category nav */}
            <div className="bg-white overflow-x-auto hide-scrollbar">
              <div className="max-w-[1440px] mx-auto px-4 flex items-end gap-6 h-[72px]">
                {CATEGORIES.map((cat, i) => {
                  const Icon = cat.icon;
                  const active = cat.label === "Food";
                  return (
                    <button
                      key={i}
                      onClick={() => cat.label === "Food" ? navigate("food") : null}
                      className={`flex flex-col items-center gap-1 pb-2 min-w-[56px] relative flex-shrink-0 transition-colors ${active ? "text-[#2874F0]" : "text-[#878787] hover:text-[#212121]"}`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center rounded-md ${active ? "bg-[#F0F5FF]" : ""}`}>
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <span className={`text-[11px] ${active ? "font-bold" : "font-normal"} whitespace-nowrap`}>{cat.label}</span>
                      {active && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2874F0] rounded-t" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Compact header on scroll */
          <div className="bg-white">
            <div className="max-w-[1440px] mx-auto px-4 h-12 flex items-center gap-4">
              <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("food")}>
                <FlipkartLogo />
                <ChevronDown className="w-3 h-3 text-[#878787] ml-0.5" />
              </div>
              <div className="flex-1 relative">
                <div className="flex items-center h-9 rounded-full border border-[#2874F0] bg-white px-3 gap-2">
                  <Search className="w-4 h-4 text-[#2874F0] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search for restaurants, dishes and more"
                    className="flex-1 text-sm text-[#212121] placeholder:text-[#878787] outline-none bg-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <SuperCoinChip coins={coins} pulse={coinPulse} />
                <button className="flex items-center gap-1.5 text-sm text-[#212121]">
                  <User className="w-4 h-4" /> Ashwin
                </button>
                <button className="flex items-center gap-1.5 text-sm text-[#212121]">
                  <MoreHorizontal className="w-4 h-4" /> More
                </button>
                <button
                  onClick={() => cartCount > 0 ? navigate("checkout") : null}
                  className="flex items-center gap-1.5 text-sm text-[#212121] relative"
                >
                  <ShoppingCart className="w-4 h-4" /> Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#FF6161] text-white text-[10px] font-bold flex items-center justify-center">{cartCount}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===== CONTENT ===== */}
      <main className="max-w-[1440px] mx-auto">
        {screen === "food" && <FoodLanding navigate={navigate} bannerIndex={bannerIndex} setBannerIndex={setBannerIndex} />}
        {screen === "restaurant" && <RestaurantPage navigate={navigate} />}
        {screen === "checkout" && <CheckoutPage navigate={navigate} superCoinsApplied={superCoinsApplied} toggleSuperCoins={toggleSuperCoins} />}
        {screen === "tracking" && <TrackingPage navigate={navigate} step={trackingStep} />}
        {screen === "confirmed" && <ConfirmedPage navigate={navigate} coins={coins} />}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#172337] text-[#878787] text-xs mt-8">
        <div className="max-w-[1440px] mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-8 mb-4">
            <div><span className="text-white font-semibold text-xs uppercase tracking-wider">About</span><div className="mt-2 space-y-1"><p>Contact Us</p><p>About Us</p><p>Careers</p></div></div>
            <div><span className="text-white font-semibold text-xs uppercase tracking-wider">Help</span><div className="mt-2 space-y-1"><p>Payments</p><p>Shipping</p><p>Returns</p></div></div>
            <div><span className="text-white font-semibold text-xs uppercase tracking-wider">Policy</span><div className="mt-2 space-y-1"><p>Return Policy</p><p>Terms of Use</p><p>Security</p></div></div>
            <div><span className="text-white font-semibold text-xs uppercase tracking-wider">Social</span><div className="mt-2 space-y-1"><p>Facebook</p><p>Twitter</p><p>YouTube</p></div></div>
          </div>
          <div className="border-t border-[#2B3A4E] pt-4 flex items-center justify-between">
            <p>&copy; 2007-2026 Flipkart.com</p>
            <button onClick={() => setEconomicsOpen(true)} className="text-[#878787] hover:text-white underline transition-colors cursor-pointer">
              The economics behind Flipkart Food
            </button>
          </div>
        </div>
      </footer>

      {/* ===== ECONOMICS DRAWER ===== */}
      {economicsOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end" onClick={() => setEconomicsOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full max-w-[520px] bg-white h-full overflow-y-auto slide-up" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-[#E0E0E0] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-[#212121]">The Economics of Flipkart Food</h2>
              <button onClick={() => setEconomicsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F1F3F6]">
                <X className="w-5 h-5 text-[#878787]" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <EconBlock
                number="1"
                title="Breakage is margin"
                text="20–30% of issued loyalty points are statistically never redeemed. This 'breakage' converts a deferred liability into recognised revenue — a structural margin advantage that compounds at scale."
              />
              <EconBlock
                number="2"
                title="Deferred revenue, not expense"
                text="Under Ind AS 115, SuperCoins sit as deferred revenue on the balance sheet. Flipkart only recognises the cost when a coin is actually redeemed, creating a float-like timing benefit."
              />
              <EconBlock
                number="3"
                title="Redemption costs COGS, not face value"
                text="When coins are redeemed for delivery fee waivers, Flipkart's actual cost is the marginal cost of the service (~₹25–30 for last-mile delivery), not the ₹45 shown to the user. The spread is the subsidy."
              />
              <EconBlock
                number="4"
                title="Ad-tech funds the subsidy"
                text="Flipkart's ad-tech revenue was ₹6,317 Cr in FY25. Even a small allocation from that pool can underwrite 100% of food-delivery subsidies without touching the razor-thin 3% food-delivery margin."
              />
              <p className="text-[11px] text-[#878787] border-t border-[#E0E0E0] pt-4">
                Note: The 20–30% breakage figure is an industry benchmark range (ref: Colloquy, Bond Brand Loyalty). Flipkart does not publicly disclose breakage rates for SuperCoins in Indian filings. FY25 ad-tech revenue per Flipkart Commerce annual report.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EconBlock({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="bg-[#F1F3F6] rounded p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{number}</span>
        <h3 className="text-sm font-semibold text-[#212121]">{title}</h3>
      </div>
      <p className="text-sm text-[#212121] leading-relaxed">{text}</p>
    </div>
  );
}

/* ============================================================================
   SCREEN 1 — Food Landing
   ============================================================================ */
function FoodLanding({ navigate, bannerIndex, setBannerIndex }: { navigate: (s: Screen) => void; bannerIndex: number; setBannerIndex: (i: number) => void }) {
  const banners = [
    { bg: "from-[#2874F0] to-[#1A5DC8]", title: "Your SuperCoins buy dinner now", subtitle: "Use coins earned on shopping to pay for food", tag: false },
    { bg: "from-[#FF6B35] to-[#D4380D]", title: "McDonald's is now on Flipkart Food", subtitle: "Flat 40% off on first order", tag: true },
    { bg: "from-[#1A1A2E] to-[#16213E]", title: "Mess closed? We're open till 2 AM", subtitle: "Late night delivery from 50+ restaurants", tag: false },
  ];

  return (
    <div className="px-4 py-4 fade-in">
      {/* Banner carousel */}
      <div className="relative mb-6">
        <div className="overflow-hidden rounded">
          <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${bannerIndex * 100}%)` }}>
            {banners.map((b, i) => (
              <div
                key={i}
                className={`min-w-full h-[180px] bg-gradient-to-r ${b.bg} rounded flex items-center px-8 relative cursor-pointer`}
                onClick={() => navigate("restaurant")}
              >
                <div className="text-white max-w-[60%]">
                  <h2 className="text-2xl font-bold mb-1">{b.title}</h2>
                  <p className="text-sm text-white/80">{b.subtitle}</p>
                </div>
                {i === 0 && (
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-lg">
                      <Zap className="w-12 h-12 text-white fill-white" />
                    </div>
                  </div>
                )}
                {b.tag && (
                  <span className="absolute bottom-2 right-3 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">AD</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => setBannerIndex((bannerIndex - 1 + 3) % 3)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:shadow-md transition-shadow">
          <ChevronLeft className="w-4 h-4 text-[#212121]" />
        </button>
        <button onClick={() => setBannerIndex((bannerIndex + 1) % 3)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:shadow-md transition-shadow">
          <ChevronRight className="w-4 h-4 text-[#212121]" />
        </button>
        <div className="flex justify-center gap-1.5 mt-3">
          {[0, 1, 2].map(i => (
            <button key={i} onClick={() => setBannerIndex(i)} className={`w-2 h-2 rounded-full transition-all ${bannerIndex === i ? "bg-[#2874F0] w-5" : "bg-[#E0E0E0]"}`} />
          ))}
        </div>
      </div>

      {/* Hungry section */}
      <div className="bg-white rounded shadow-[0_1px_2px_rgba(0,0,0,0.08)] mb-4">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#212121]">
            Ashwin, hungry again?
          </h3>
          <span className="text-xs text-[#2874F0] font-semibold cursor-pointer">VIEW ALL</span>
        </div>
        <div className="px-4 pb-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-3" style={{ minWidth: "max-content" }}>
            {RESTAURANTS.map((r, i) => (
              <div
                key={i}
                onClick={() => navigate("restaurant")}
                className="w-[172px] flex-shrink-0 cursor-pointer group"
              >
                <FoodImage emoji={r.img} className="w-full h-[140px] rounded" />
                <div className="mt-2">
                  <p className="text-sm font-medium text-[#212121] truncate group-hover:text-[#2874F0] transition-colors">{r.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <RatingPill rating={r.rating} />
                    <span className="text-xs text-[#878787] flex items-center gap-0.5"><Clock className="w-3 h-3" /> {r.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-[#878787] line-through">₹{r.original}</span>
                    <span className="text-base font-bold text-[#212121]">₹{r.price}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                      <Zap className="w-2 h-2 text-white fill-white" />
                    </div>
                    <span className="text-[11px] text-[#878787]">SuperCoins applied</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-[56px] flex-shrink-0 flex items-center justify-center">
              <button className="w-10 h-10 rounded-full bg-white border border-[#E0E0E0] flex items-center justify-center shadow-sm hover:shadow transition-shadow">
                <ChevronRight className="w-5 h-5 text-[#212121]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Under 20 minutes grid */}
      <div className="bg-white rounded shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-lg font-semibold text-[#212121]">Under 20 minutes near Hostel Block C</h3>
          <p className="text-xs text-[#878787] mt-0.5">Delivered by eKart — Flipkart&apos;s own fleet</p>
        </div>
        <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {RESTAURANTS.map((r, i) => (
            <div
              key={i}
              onClick={() => navigate("restaurant")}
              className="cursor-pointer group border border-[#E0E0E0] rounded hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-shadow"
            >
              <FoodImage emoji={r.img} className="w-full h-[120px] rounded-t" />
              <div className="p-3">
                <p className="text-sm font-medium text-[#212121] truncate group-hover:text-[#2874F0] transition-colors">{r.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <RatingPill rating={r.rating} />
                  <span className="text-xs text-[#878787]">{r.time}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-[#878787] line-through">₹{r.original}</span>
                  <span className="text-base font-bold text-[#212121]">₹{r.price}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                    <Zap className="w-2 h-2 text-white fill-white" />
                  </div>
                  <span className="text-[11px] text-[#878787]">SuperCoins applied</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SCREEN 2 — Restaurant Page
   ============================================================================ */
function RestaurantPage({ navigate }: { navigate: (s: Screen) => void }) {
  const [added, setAdded] = useState<Set<number>>(new Set());

  const handleAdd = (idx: number) => {
    setAdded(prev => new Set(prev).add(idx));
  };

  return (
    <div className="px-4 py-4 fade-in">
      {/* Breadcrumb */}
      <div className="text-xs text-[#878787] mb-3 flex items-center gap-1">
        <span className="cursor-pointer hover:text-[#2874F0]" onClick={() => navigate("food")}>Food</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#212121]">Biryani Blues</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left — Image grid */}
        <div className="lg:w-[40%]">
          <div className="grid grid-cols-2 gap-2">
            {["🍛", "🍗", "🥘", "🍚"].map((e, i) => (
              <div key={i} className="relative rounded bg-[#F5F5F5] aspect-square flex items-center justify-center">
                <span className="text-5xl select-none" role="img">{e}</span>
                {i === 0 && (
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:shadow-md transition-shadow">
                      <Heart className="w-4 h-4 text-[#878787]" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:shadow-md transition-shadow">
                      <Share2 className="w-4 h-4 text-[#878787]" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Info + Menu */}
        <div className="lg:w-[60%]">
          <div className="bg-white rounded shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-4">
            <h1 className="text-xl font-semibold text-[#212121]">Biryani Blues</h1>
            <div className="flex items-center gap-3 mt-2">
              <RatingPill rating={4.3} count={2847} />
              <span className="text-xs text-[#878787]">North Indian, Biryani, Mughlai</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-[#878787]">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Sector 12, 900 m</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 18 min</span>
            </div>

            <div className="mt-4 border-t border-[#E0E0E0] pt-4">
              <h2 className="text-base font-semibold text-[#212121] mb-3">Menu</h2>
              <div className="space-y-0">
                {MENU_ITEMS.map((item, idx) => (
                  <div key={idx} className="py-3 border-b border-[#F0F0F0] last:border-b-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <VegIndicator veg={item.veg} />
                          <span className="text-sm font-medium text-[#212121]">{item.name}</span>
                          {item.popular && <span className="text-[10px] text-[#FF6161] font-semibold border border-[#FF6161] rounded px-1">BESTSELLER</span>}
                        </div>
                        <p className="text-sm font-bold text-[#212121] mt-1">₹{item.price}</p>
                        <p className="text-xs text-[#878787] mt-0.5 line-clamp-2">{item.desc}</p>
                        {idx === 0 && (
                          <p className="text-[11px] text-[#878787] mt-1 border-t border-dashed border-[#E0E0E0] pt-1">
                            Same price as in-store · ONDC direct — we don&apos;t inflate menu prices.
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {added.has(idx) ? (
                          <button className="w-[88px] h-[34px] rounded border border-[#388E3C] bg-white text-sm font-semibold text-[#388E3C] flex items-center justify-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Added
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAdd(idx)}
                            className="w-[88px] h-[34px] rounded border border-[#2874F0] bg-white text-sm font-semibold text-[#2874F0] hover:bg-[#F0F5FF] transition-colors"
                          >
                            ADD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout CTA */}
            {added.size > 0 && (
              <div className="mt-4 bg-[#2874F0] rounded p-3 flex items-center justify-between cursor-pointer hover:bg-[#1A5DC8] transition-colors" onClick={() => navigate("checkout")}>
                <div className="text-white">
                  <p className="text-sm font-semibold">{added.size} item{added.size > 1 ? "s" : ""} added</p>
                  <p className="text-xs text-white/70">Extra charges may apply</p>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  View Cart <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SCREEN 3 — Cart / Checkout (Hero Screen)
   ============================================================================ */
function CheckoutPage({ navigate, superCoinsApplied, toggleSuperCoins }: { navigate: (s: Screen) => void; superCoinsApplied: boolean; toggleSuperCoins: () => void }) {
  const deliveryFee = superCoinsApplied ? 0 : 45;
  const platformFee = superCoinsApplied ? 0 : 12;
  const gst = superCoinsApplied ? 0 : 10;
  const total = 120 + deliveryFee + platformFee + gst;
  const coinsUsed = superCoinsApplied ? 240 : 0;
  const finalAmount = superCoinsApplied ? 142 : 187;

  return (
    <div className="px-4 py-4 fade-in">
      <div className="text-xs text-[#878787] mb-3 flex items-center gap-1">
        <span className="cursor-pointer hover:text-[#2874F0]" onClick={() => navigate("food")}>Food</span>
        <ChevronRight className="w-3 h-3" />
        <span className="cursor-pointer hover:text-[#2874F0]" onClick={() => navigate("restaurant")}>Biryani Blues</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#212121]">Checkout</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left — Bill details */}
        <div className="lg:w-[60%]">
          {/* Blue header */}
          <div className="bg-[#2874F0] rounded-t px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider">WOW! DEAL</span>
              <span className="text-white text-sm font-semibold">Apply SuperCoins for maximum savings</span>
            </div>
            <ChevronDown className="w-4 h-4 text-white" />
          </div>

          <div className="bg-[#F0F5FF] rounded-b p-4 border border-t-0 border-[#D6E4FF]">
            {/* SuperCoin toggle */}
            <div className="bg-white rounded border border-[#E0E0E0] p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#212121]">Apply SuperCoins</p>
                  <p className="text-xs text-[#878787]">Use 240 coins to save ₹45 on fees</p>
                </div>
              </div>
              <button
                onClick={toggleSuperCoins}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${superCoinsApplied ? "bg-[#2874F0]" : "bg-[#E0E0E0]"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform duration-300 ${superCoinsApplied ? "translate-x-[26px]" : "translate-x-0.5"}`} />
              </button>
            </div>

            {/* Itemised bill */}
            <div className="bg-white rounded border border-[#E0E0E0] overflow-hidden">
              <div className="p-4 space-y-3">
                <BillRow label="Hyderabadi Biryani × 1" value="₹120" />
                <BillRow label="Menu markup" value="₹0" note="we don't inflate menu prices" />
                <BillRow
                  label="Delivery fee"
                  value={superCoinsApplied ? "₹0" : "₹45"}
                  original={superCoinsApplied ? "₹45" : undefined}
                  highlight={superCoinsApplied}
                />
                <BillRow
                  label="Platform fee"
                  value={superCoinsApplied ? "₹0" : "₹12"}
                  original={superCoinsApplied ? "₹12" : undefined}
                  highlight={superCoinsApplied}
                />
                <BillRow
                  label="GST on fees"
                  value={superCoinsApplied ? "₹0" : "₹10"}
                  original={superCoinsApplied ? "₹10" : undefined}
                  highlight={superCoinsApplied}
                />
                {superCoinsApplied && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-[#2874F0] bg-[#FFE11B] rounded-sm -rotate-2">Best value for you</span>
                      </div>
                      <span className="text-sm text-[#212121]">SuperCoins applied</span>
                    </div>
                    <span className="text-sm font-semibold text-[#388E3C] animate-num">−240 coins</span>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-[#212121] mx-4" />

              <div className="p-4 flex items-center justify-between">
                <span className="text-lg font-bold text-[#212121]">You pay</span>
                <span className="text-[28px] font-bold text-[#212121] animate-num tabular-nums">₹{superCoinsApplied ? "142" : total}</span>
              </div>
            </div>

            {/* Delivery info */}
            <div className="mt-3 bg-white rounded border border-[#E0E0E0] p-3">
              <div className="flex items-center gap-2 text-xs text-[#878787]">
                <MapPin className="w-3.5 h-3.5 text-[#2874F0]" />
                <span>Delivering to <strong className="text-[#212121]">Hostel Block C, Sector 12</strong></span>
                <button className="text-[#2874F0] font-semibold ml-auto">Change</button>
              </div>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            onClick={() => navigate("tracking")}
            className="w-full mt-3 h-12 bg-[#2874F0] hover:bg-[#1A5DC8] text-white font-semibold rounded flex items-center justify-center gap-2 transition-colors text-base tracking-wide"
          >
            Place Order · ₹{superCoinsApplied ? "142" : total}
          </button>
        </div>

        {/* Right — Comparison card */}
        <div className="lg:w-[40%]">
          <div className="bg-white rounded shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-4 border border-[#E0E0E0]">
            <h3 className="text-sm font-semibold text-[#212121] mb-3">On Swiggy or Zomato, this same order:</h3>
            <div className="text-2xl font-bold text-[#212121] mb-4">₹400+</div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-[#878787] mb-1">
                  <span>Others</span>
                  <span>₹400</span>
                </div>
                <div className="w-full h-6 bg-[#FFEBEE] rounded-sm relative overflow-hidden">
                  <div className="h-full bg-[#FF6161] rounded-sm" style={{ width: "100%" }} />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white">₹400</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-[#878787] mb-1">
                  <span>Flipkart Food</span>
                  <span>₹{superCoinsApplied ? "142" : total}</span>
                </div>
                <div className="w-full h-6 bg-[#E3F2FD] rounded-sm relative overflow-hidden">
                  <div className="h-full bg-[#2874F0] rounded-sm animate-num" style={{ width: superCoinsApplied ? "35.5%" : `${(total / 400) * 100}%` }} />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white animate-num">₹{superCoinsApplied ? "142" : total}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E0E0E0]">
              <p className="text-xs text-[#388E3C] font-semibold">
                You save ₹{superCoinsApplied ? "258" : 400 - total} with Flipkart Food
              </p>
              <p className="text-[11px] text-[#878787] mt-1">Price comparison based on identical items ordered from the same restaurant on competing platforms, including all fees and taxes.</p>
            </div>
          </div>

          <div className="bg-white rounded shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-4 border border-[#E0E0E0] mt-3">
            <p className="text-xs text-[#878787] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#388E3C]" />
              ONDC-powered · Direct from restaurant · No price inflation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillRow({ label, value, original, note, highlight }: { label: string; value: string; original?: string; note?: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-[#212121]">{label}</span>
        {note && <span className="text-[11px] text-[#878787]">— {note}</span>}
      </div>
      <div className="flex items-center gap-1.5">
        {original && <span className="text-xs text-[#878787] line-through">{original}</span>}
        <span className={`text-sm font-medium animate-num ${highlight ? "text-[#388E3C]" : "text-[#212121]"}`}>{value}</span>
      </div>
    </div>
  );
}

/* ============================================================================
   SCREEN 4 — Order Tracking
   ============================================================================ */
function TrackingPage({ navigate, step }: { navigate: (s: Screen) => void; step: number }) {
  const steps = ["Confirmed", "Preparing", "Picked up", "Arriving"];

  return (
    <div className="px-4 py-4 fade-in">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Map panel */}
        <div className="lg:w-[60%]">
          <div className="bg-[#E8F5E9] rounded h-[360px] relative overflow-hidden border border-[#C8E6C9]">
            {/* Simplified map illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="relative">
                  {/* Road lines */}
                  <div className="w-[300px] h-[2px] bg-[#A5D6A7] absolute top-1/2 left-1/2 -translate-x-1/2" />
                  <div className="w-[2px] h-[200px] bg-[#A5D6A7] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                  {/* Restaurant marker */}
                  <div className="absolute -top-[80px] left-1/2 -translate-x-1/2">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#2874F0] flex items-center justify-center shadow-md">
                        <UtensilsCrossed className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] font-medium mt-1 bg-white px-1.5 py-0.5 rounded shadow-sm">Restaurant</span>
                    </div>
                  </div>

                  {/* Delivery marker */}
                  <div className="absolute top-[60px] left-1/2 -translate-x-1/2">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#FF6161] flex items-center justify-center shadow-md">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] font-medium mt-1 bg-white px-1.5 py-0.5 rounded shadow-sm">Hostel Block C</span>
                    </div>
                  </div>

                  {/* Delivery person */}
                  {step >= 2 && (
                    <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ${step >= 3 ? "top-[30px]" : "top-[-20px]"}`}>
                      <div className="w-6 h-6 rounded-full bg-[#FFE11B] flex items-center justify-center shadow border-2 border-white">
                        <Bike className="w-3 h-3 text-[#212121]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 bg-white rounded shadow px-3 py-2">
              <p className="text-sm font-bold text-[#212121]">Arriving in 14 minutes</p>
              <p className="text-xs text-[#878787]">900 m away</p>
            </div>
          </div>
        </div>

        {/* Right — Stepper + Info */}
        <div className="lg:w-[40%]">
          <div className="bg-white rounded shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-4">
            <h2 className="text-base font-semibold text-[#212121] mb-4">Order Status</h2>

            {/* Progress stepper */}
            <div className="space-y-0 relative ml-3">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-3 relative pb-6 last:pb-0">
                  {/* Vertical line */}
                  {i < steps.length - 1 && (
                    <div className={`absolute left-[7px] top-[18px] w-[2px] h-[calc(100%-4px)] ${i < step ? "bg-[#388E3C]" : "bg-[#E0E0E0]"}`} />
                  )}
                  {/* Dot */}
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
                    i <= step ? "border-[#388E3C] bg-[#388E3C]" : "border-[#E0E0E0] bg-white"
                  }`}>
                    {i <= step && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div>
                    <p className={`text-sm ${i <= step ? "font-semibold text-[#212121]" : "text-[#878787]"}`}>{s}</p>
                    {i === step && <p className="text-xs text-[#388E3C] mt-0.5">In progress</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-4 mt-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#F0F5FF] flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed className="w-4 h-4 text-[#2874F0]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#212121]">Prepared at Flipkart Minutes, Sector 12</p>
                <p className="text-xs text-[#878787] mt-0.5">900 m away · delivered by eKart</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-3 mt-3">
            <p className="text-xs text-[#878787]">Order #FK-FD-2026081742 · Hyderabadi Biryani × 1 · ₹142</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SCREEN 5 — Order Confirmed / Loop Closes
   ============================================================================ */
function ConfirmedPage({ navigate, coins }: { navigate: (s: Screen) => void; coins: number }) {
  const products = [
    { name: "boAt Airdopes 141", price: 999, original: 2990, img: "🎧", rating: 4.1 },
    { name: "Campus Casual T-Shirt", price: 399, original: 999, img: "👕", rating: 4.3 },
    { name: "Ambrane 10000mAh", price: 599, original: 1499, img: "🔋", rating: 4.2 },
    { name: "Fire-Boltt Ring 3", price: 1499, original: 5999, img: "⌚", rating: 4.0 },
    { name: "Skybags Daypack", price: 699, original: 2350, img: "🎒", rating: 4.4 },
  ];

  return (
    <div className="px-4 py-4 fade-in">
      <div className="max-w-[640px] mx-auto">
        {/* Success card */}
        <div className="bg-white rounded shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-10 h-10 text-[#388E3C]" />
          </div>
          <h1 className="text-xl font-semibold text-[#212121]">Order delivered!</h1>
          <p className="text-sm text-[#878787] mt-1">Your Hyderabadi Biryani from Biryani Blues has arrived</p>

          <div className="mt-4 bg-gradient-to-r from-[#FFF8E1] to-[#FFF3E0] rounded p-4 inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#212121]">You earned 30 SuperCoins on this order</p>
              <p className="text-xs text-[#878787]">Balance: {coins.toLocaleString()} SuperCoins</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={() => navigate("food")}
              className="px-6 h-10 bg-[#2874F0] text-white text-sm font-semibold rounded hover:bg-[#1A5DC8] transition-colors"
            >
              Order Again
            </button>
            <button className="px-6 h-10 border border-[#E0E0E0] text-sm font-semibold text-[#212121] rounded hover:bg-[#F5F5F5] transition-colors">
              Rate Order
            </button>
          </div>
        </div>

        {/* Spend coins on Flipkart */}
        <div className="bg-white rounded shadow-[0_1px_2px_rgba(0,0,0,0.08)] mt-4">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#212121]">Spend them on Flipkart</h3>
              <p className="text-xs text-[#878787]">Use your {coins.toLocaleString()} SuperCoins on these deals</p>
            </div>
            <span className="text-xs text-[#2874F0] font-semibold cursor-pointer">VIEW ALL</span>
          </div>
          <div className="px-4 pb-4 overflow-x-auto hide-scrollbar">
            <div className="flex gap-3" style={{ minWidth: "max-content" }}>
              {products.map((p, i) => (
                <div key={i} className="w-[168px] flex-shrink-0 border border-[#E0E0E0] rounded p-3 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-shadow cursor-pointer group">
                  <div className="w-full h-[100px] bg-[#F5F5F5] rounded flex items-center justify-center">
                    <span className="text-4xl select-none" role="img">{p.img}</span>
                  </div>
                  <p className="text-sm text-[#212121] mt-2 truncate group-hover:text-[#2874F0] transition-colors">{p.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-base font-bold text-[#212121]">₹{p.price}</span>
                    <span className="text-xs text-[#878787] line-through">₹{p.original}</span>
                  </div>
                  <RatingPill rating={p.rating} />
                  <div className="flex items-center gap-1 mt-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                      <Zap className="w-2 h-2 text-white fill-white" />
                    </div>
                    <span className="text-[11px] text-[#878787]">Pay with SuperCoins</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loop closes message */}
        <div className="mt-4 bg-[#F0F5FF] rounded border border-[#D6E4FF] p-4 text-center">
          <p className="text-sm text-[#2874F0] font-semibold">The Flipkart loop</p>
          <p className="text-xs text-[#878787] mt-1">
            Shop on Flipkart → earn SuperCoins → spend on food → earn more coins → shop again
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-[#212121]">
            <span className="px-2 py-1 bg-white rounded border border-[#E0E0E0]">Shopping</span>
            <ChevronRight className="w-3 h-3 text-[#878787]" />
            <span className="px-2 py-1 bg-[#FFE11B] rounded border border-[#E0E0E0] font-semibold">SuperCoins</span>
            <ChevronRight className="w-3 h-3 text-[#878787]" />
            <span className="px-2 py-1 bg-white rounded border border-[#E0E0E0]">Food</span>
            <ChevronRight className="w-3 h-3 text-[#878787]" />
            <span className="px-2 py-1 bg-[#FFE11B] rounded border border-[#E0E0E0] font-semibold">More Coins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
