import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Flag, ExternalLink, BookOpen, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getMonastery, scanQrCode } from "../services/api";
import { useAuth } from "../context/AuthContext";

const STATIC_DATA = {
  rumtek: { name: "Rumtek Monastery", district: "Gangtok", location: "Rumtek, East Sikkim", founded: "18th c., rebuilt 1960s", sect: "Kagyu", imageUrl: "/images/Rumtek_Monastery.jpeg", shortDescription: "Seat-in-exile of the Karmapa lineage.", longDescription: "Rumtek Monastery, also known as the Dharma Chakra Centre, is a crucial hub of the Kagyu sect of Tibetan Buddhism. Originally established in the 18th century, it was rebuilt in the 1960s by the 16th Karmapa as his main seat in India after fleeing Tibet. The monastery complex features a main temple, shrine hall, golden stupa containing the relics of the 16th Karmapa, and a monastic college (Shedra). It is particularly famous for its sacred Black Hat dance (Tsechu) performed annually.", highlights: ["Black Hat Dance (Tsechu)", "Golden Stupa", "Monastic College", "Kora Path"], latitude: 27.315, longitude: 88.611, visitingHours: "6 AM – 6 PM", entryFee: "Free (Donation welcome)", bestSeason: "Oct–Dec, Mar–May" },
  pemayangtse: { name: "Pemayangtse Monastery", district: "Gyalshing", location: "Pelling, West Sikkim", founded: "1705", sect: "Nyingma", imageUrl: "/images/Pemayangtse-Monastery.jpg", shortDescription: "One of Sikkim's oldest monasteries.", longDescription: "Pemayangtse Monastery is one of the most important monasteries in Sikkim. Established in 1705, it belongs to the Nyingmapa sect. The monastery houses the famous seven-tiered wooden sculpture 'Zangdok Palri' depicting the celestial palace of Guru Rinpoche. The museum contains valuable thangkas, statues, and religious artifacts. The monastery offers breathtaking views of the Himalayan ranges including Kanchenjunga.", highlights: ["Zangdok Palri model", "Museum", "Himalayan vistas", "Ancient thangkas"], latitude: 27.317, longitude: 88.197, visitingHours: "7 AM – 5 PM", entryFee: "₹20 entry", bestSeason: "Oct–Apr" },
  tashiding: { name: "Tashiding Monastery", district: "Namchi", location: "Tashiding, South Sikkim", founded: "1717", sect: "Nyingma", imageUrl: "/images/Tashiding-Monastery.jpg", shortDescription: "Sacred site between Rathong and Rangeet rivers.", longDescription: "Tashiding Monastery is considered the most sacred in all of Sikkim. Situated on a hilltop at the confluence of the Rathong and Rangit rivers, it was founded in 1717. The monastery is famous for the 'Bumchu' festival in February/March, where the level of holy water in a sacred pot is used to predict the coming year's fortune. The monastery's chorten ground is surrounded by 24 different types of chortens.", highlights: ["Bumchu festival", "Chortens", "Panoramic trail", "Sacred water pot"], latitude: 27.279, longitude: 88.322, visitingHours: "7 AM – 6 PM", entryFee: "Free", bestSeason: "Feb for Bumchu, Oct–May" },
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MonasteryDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [monastery, setMonastery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stampMsg, setStampMsg] = useState("");
  const [stampLoading, setStampLoading] = useState(false);

  useEffect(() => {
    getMonastery(slug)
      .then((data) => setMonastery(data))
      .catch(() => setMonastery(STATIC_DATA[slug] || null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleScanQr = async () => {
    if (!user) { setStampMsg("Please login to collect stamps!"); return; }
    setStampLoading(true);
    try {
      const res = await scanQrCode(slug);
      setStampMsg(res.message);
    } catch (e) {
      setStampMsg(e.message);
    } finally {
      setStampLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-slate-300 border-t-slate-800 rounded-full" /></div>;
  if (!monastery) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><p className="text-slate-600">Monastery not found.</p><Link to="/monasteries"><Button className="mt-4 rounded-2xl">Browse All</Button></Link></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/buddhism.png" alt="Logo" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-bold">Monasteries of Sikkim</span>
          </Link>
          <Link to="/monasteries"><Button variant="outline" className="rounded-2xl">← All Monasteries</Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden h-80">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${monastery.imageUrl || monastery.image}')` }} />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col justify-end pb-10 px-6 sm:px-12 text-white">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-bold">{monastery.name}</motion.h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-white/90">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{monastery.location}</span>
            <span className="flex items-center gap-1"><Flag className="h-4 w-4" />{monastery.sect}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{monastery.founded}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />About</CardTitle></CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">{monastery.longDescription || monastery.shortDescription}</p>
            </CardContent>
          </Card>

          {(monastery.latitude && monastery.longitude) && (
            <Card className="rounded-2xl overflow-hidden">
              <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Location</CardTitle></CardHeader>
              <CardContent className="p-0 h-64">
                <MapContainer center={[monastery.latitude, monastery.longitude]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[monastery.latitude, monastery.longitude]} icon={markerIcon}>
                    <Popup>{monastery.name}</Popup>
                  </Marker>
                </MapContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* QR Stamp */}
          <Card className="rounded-2xl border-2 border-amber-200 bg-amber-50">
            <CardHeader><CardTitle className="flex items-center gap-2 text-amber-800"><QrCode className="h-5 w-5" />Collect Your Stamp</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-amber-700 mb-4">Visited this monastery? Scan the QR code at the entrance to collect your digital stamp!</p>
              <Button onClick={handleScanQr} disabled={stampLoading} className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white">
                {stampLoading ? "Scanning..." : "Simulate QR Scan"}
              </Button>
              {stampMsg && <p className="mt-2 text-sm text-center text-amber-800 font-medium">{stampMsg}</p>}
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>Highlights</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(monastery.highlights || []).map((h) => <Badge key={h} className="rounded-xl">{h}</Badge>)}
              </div>
            </CardContent>
          </Card>

          {/* Visit Info */}
          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Visit Info</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              {monastery.visitingHours && <div><span className="font-medium">Hours: </span>{monastery.visitingHours}</div>}
              {monastery.entryFee && <div><span className="font-medium">Entry: </span>{monastery.entryFee}</div>}
              {monastery.bestSeason && <div><span className="font-medium">Best Season: </span>{monastery.bestSeason}</div>}
              <Button variant="outline" className="w-full rounded-xl mt-2" asChild>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(monastery.name)}`} target="_blank" rel="noreferrer">
                  Open in Maps <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
