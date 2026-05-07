import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Flag, Clock, Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMonasteries } from "../services/api";

// Fallback static data if backend not available
const STATIC_MONASTERIES = [
  { id: 1, slug: "rumtek", name: "Rumtek Monastery", district: "Gangtok", location: "Rumtek, East Sikkim", founded: "18th c., rebuilt 1960s", sect: "Kagyu", imageUrl: "/images/Rumtek_Monastery.jpeg", shortDescription: "Seat-in-exile of the Karmapa lineage; intricate murals, golden stupa and monastic college.", highlights: ["Kora path", "Assembly hall", "Black Hat dance"] },
  { id: 2, slug: "pemayangtse", name: "Pemayangtse Monastery", district: "Gyalshing", location: "Pelling, West Sikkim", founded: "1705", sect: "Nyingma", imageUrl: "/images/Pemayangtse-Monastery.jpg", shortDescription: "One of Sikkim's oldest; houses the famed wooden reliquary 'Zangdok Palri'.", highlights: ["Zangdok Palri model", "Museum", "Himalayan vistas"] },
  { id: 3, slug: "tashiding", name: "Tashiding Monastery", district: "Namchi", location: "Tashiding, South Sikkim", founded: "1717", sect: "Nyingma", imageUrl: "/images/Tashiding-Monastery.jpg", shortDescription: "Sacred site famed for 'Bumchu' holy water festival.", highlights: ["Bumchu festival", "Chortens", "Panoramic trail"] },
  { id: 4, slug: "phodong", name: "Phodong Monastery", district: "Mangan", location: "North Sikkim", founded: "1740", sect: "Kagyu", imageUrl: "/images/Phodong Monastery.jpg", shortDescription: "Known for vibrant Cham dances and 18th-century murals.", highlights: ["Cham dances", "Monastic library", "Countryside views"] },
  { id: 5, slug: "enchey", name: "Enchey Monastery", district: "Gangtok", location: "Ridge Road, Gangtok", founded: "1909", sect: "Nyingma", imageUrl: "/images/Enchey Monastery.jpg", shortDescription: "Guardian monastery of Gangtok; elegant woodwork and protective deities.", highlights: ["Losoong festival", "Prayer wheels", "City overlook"] },
  { id: 6, slug: "ralang", name: "Ralang Monastery", district: "Namchi", location: "Ralang, South Sikkim", founded: "1768", sect: "Kagyu", imageUrl: "/images/Rumtek_Monastery.jpeg", shortDescription: "Ancient monastery with stunning architecture set amidst dense forests.", highlights: ["Pang Lhabsol", "Sacred thangkas", "Forest walks"] },
  { id: 7, slug: "sinon", name: "Sinon Monastery", district: "Mangan", location: "Sinon, North Sikkim", founded: "1641", sect: "Nyingma", imageUrl: "/images/Pemayangtse-Monastery.jpg", shortDescription: "One of the oldest in Sikkim with rare manuscripts.", highlights: ["Ancient manuscripts", "Butter lamp rituals", "Mountain views"] },
  { id: 8, slug: "phensang", name: "Phensang Monastery", district: "Mangan", location: "Phensang, North Sikkim", founded: "1721", sect: "Nyingma", imageUrl: "/images/Tashiding-Monastery.jpg", shortDescription: "Serene monastery known for its peaceful ambience and annual Kagyed dance.", highlights: ["Kagyed dance", "Tranquil gardens", "Traditional art"] },
];

const DISTRICTS = ["All", "Gangtok", "Gyalshing", "Namchi", "Mangan"];
const SECTS = ["All", "Nyingma", "Kagyu", "Sakya", "Gelug"];

export default function AllMonasteriesPage() {
  const [monasteries, setMonasteries] = useState(STATIC_MONASTERIES);
  const [q, setQ] = useState("");
  const [district, setDistrict] = useState("All");
  const [sect, setSect] = useState("All");

  useEffect(() => {
    getMonasteries()
      .then((data) => { if (data?.length) setMonasteries(data); })
      .catch(() => {}); // use static fallback
  }, []);

  const filtered = useMemo(() =>
    monasteries.filter((m) => {
      const matchQ = (m.name + " " + m.location + " " + m.shortDescription).toLowerCase().includes(q.toLowerCase());
      const matchD = district === "All" || m.district === district;
      const matchS = sect === "All" || m.sect === sect;
      return matchQ && matchD && matchS;
    }), [monasteries, q, district, sect]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/buddhism.png" alt="Logo" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-bold text-slate-900">Monasteries of Sikkim</span>
          </Link>
          <Link to="/"><Button variant="outline" className="rounded-2xl">← Back to Home</Button></Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">All Monasteries</h1>
        <p className="text-slate-600 mb-8">Explore all {monasteries.length}+ documented monasteries across Sikkim</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2 bg-white border rounded-2xl px-3 py-2 flex-1 min-w-[200px]">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              className="border-0 bg-transparent focus:outline-none flex-1 text-sm"
              placeholder="Search monastery, sect, location..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger className="rounded-2xl w-40"><SelectValue placeholder="District" /></SelectTrigger>
            <SelectContent>{DISTRICTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sect} onValueChange={setSect}>
            <SelectTrigger className="rounded-2xl w-36"><SelectValue placeholder="Sect" /></SelectTrigger>
            <SelectContent>{SECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <span className="self-center text-sm text-slate-500">{filtered.length} results</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m, idx) => (
            <motion.div key={m.id || m.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.03 }}>
              <Card className="overflow-hidden rounded-2xl h-full flex flex-col">
                <div className="h-44 bg-slate-200">
                  <img src={m.imageUrl || m.image} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{m.name}</CardTitle>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-600 mt-1">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{m.location}</span>
                    <span className="flex items-center gap-1"><Flag className="h-3 w-3" />{m.sect}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{m.founded}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-sm text-slate-700 mb-3">{m.shortDescription}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(m.highlights || []).slice(0, 2).map((h) => <Badge key={h} variant="secondary" className="rounded-xl text-xs">{h}</Badge>)}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/monasteries/${m.slug}`} className="flex-1">
                      <Button className="rounded-xl w-full text-sm">Details</Button>
                    </Link>
                    <Button variant="outline" className="rounded-xl px-2" asChild>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.name)}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
