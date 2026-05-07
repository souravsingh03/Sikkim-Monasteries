import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Filter, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHandicrafts } from "../services/api";

const STATIC_CRAFTS = [
  { id: 1, name: "Silk Thangka — Guru Rinpoche", artisan: "Tashi Wangchuk", monastery: "Rumtek", category: "Thangka", description: "Exquisitely painted silk thangka depicting Guru Rinpoche, hand-painted using traditional mineral pigments.", price: 12500, imageUrl: "/images/Rumtek_Monastery.jpeg", available: true },
  { id: 2, name: "Hand-carved Prayer Wheel", artisan: "Dorje Lama", monastery: "Pemayangtse", category: "Wood Carving", description: "Intricately hand-carved brass-inlaid prayer wheel with Om Mani mantra inscribed on copper scroll inside.", price: 3500, imageUrl: "/images/Pemayangtse-Monastery.jpg", available: true },
  { id: 3, name: "Hand-woven Tibetan Carpet (2x3 ft)", artisan: "Pema Dolma", monastery: "Tashiding", category: "Textile", description: "Traditional Tibetan-style carpet woven by local artisans using pure wool with auspicious dragon motif.", price: 8000, imageUrl: "/images/Tashiding-Monastery.jpg", available: true },
  { id: 4, name: "Bronze Singing Bowl Set", artisan: "Monastery Craft Guild", monastery: "Enchey", category: "Metal Craft", description: "Hand-hammered bronze singing bowl with striker and cushion; produces resonant tones used in meditation.", price: 2200, imageUrl: "/images/Enchey Monastery.jpg", available: true },
  { id: 5, name: "Butter Lamp (Traditional Brass)", artisan: "Nima Sherpa", monastery: "Phodong", category: "Metal Craft", description: "Traditional brass butter lamp used in monastery rituals. Handcrafted with lotus engravings.", price: 1800, imageUrl: "/images/Phodong Monastery.jpg", available: true },
  { id: 6, name: "Appliqué Thangka — Green Tara", artisan: "Khenchen Studios", monastery: "Rumtek", category: "Thangka", description: "Beautiful appliqué-style thangka of Green Tara made from fine silk brocade fabrics.", price: 15000, imageUrl: "/images/Rumtek_Monastery.jpeg", available: true },
  { id: 7, name: "Lokta Paper Journals", artisan: "Monastery Press", monastery: "Tashiding", category: "Paper Craft", description: "Handmade journals using traditional Himalayan lokta paper, decorated with prayer flag print cover.", price: 450, imageUrl: "/images/Tashiding-Monastery.jpg", available: true },
  { id: 8, name: "Incense Bundle (30 sticks)", artisan: "Monastery Kitchen", monastery: "Pemayangtse", category: "Incense", description: "Pure Himalayan herbal incense sticks made from natural ingredients following age-old monastery recipes.", price: 280, imageUrl: "/images/Pemayangtse-Monastery.jpg", available: true },
];

const CATEGORIES = ["All", "Thangka", "Wood Carving", "Textile", "Metal Craft", "Paper Craft", "Incense"];

export default function HandicraftPage() {
  const [crafts, setCrafts] = useState(STATIC_CRAFTS);
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    getHandicrafts().then((d) => { if (d?.length) setCrafts(d); }).catch(() => {});
  }, []);

  const filtered = crafts
    .filter((c) => category === "All" || c.category === category)
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/buddhism.png" alt="Logo" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-bold">Monasteries of Sikkim</span>
          </Link>
          <Link to="/"><Button variant="outline" className="rounded-2xl">← Back to Home</Button></Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="h-7 w-7 text-slate-700" />
          <h1 className="text-3xl font-bold text-slate-900">Monastery Handicrafts</h1>
        </div>
        <p className="text-slate-600 mb-8">Authentic handcrafted items made by local artisans. Every purchase directly supports the monastery and its craftspeople.</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <Filter className="h-4 w-4 text-slate-500" />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <Button key={c} size="sm" variant={category === c ? "default" : "outline"} className="rounded-2xl" onClick={() => setCategory(c)}>{c}</Button>
            ))}
          </div>
          <div className="ml-auto">
            <select className="border rounded-xl px-3 py-2 text-sm text-slate-700" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6">{filtered.length} items</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((craft, idx) => (
            <motion.div key={craft.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.04 }}>
              <Card className="overflow-hidden rounded-2xl flex flex-col h-full">
                <div className="h-48 bg-slate-200 relative">
                  <img src={craft.imageUrl} alt={craft.name} className="h-full w-full object-cover" loading="lazy" />
                  <Badge className="absolute top-2 right-2 bg-white/90 text-slate-700 rounded-xl text-xs">{craft.category}</Badge>
                </div>
                <CardContent className="flex flex-col flex-1 p-4">
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{craft.name}</h3>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Tag className="h-3 w-3" />{craft.artisan} · {craft.monastery}</p>
                  <p className="text-xs text-slate-600 flex-1 mt-1 mb-3 line-clamp-3">{craft.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-slate-900">₹{craft.price.toLocaleString("en-IN")}</span>
                    <Button size="sm" className="rounded-xl">Enquire</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-2">How to Purchase</h3>
          <p className="text-sm text-amber-800">To purchase handicrafts, click "Enquire" and we'll connect you directly with the artisan or monastery gift shop. Items can be shipped across India, or picked up at the monastery. All proceeds go directly to the artisans and monastery preservation fund.</p>
        </div>
      </div>
    </div>
  );
}
