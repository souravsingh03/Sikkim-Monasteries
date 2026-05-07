import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { subscribeNewsletter } from "./services/api";

import {
  MapPin,
  Calendar,
  Compass,
  Mountain,
  Flag,
  Search,
  Landmark,
  BookOpen,
  Clock,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Demo data (you can replace/extend with CMS or API later) ---
const MONASTERIES = [
  {
    id: "rumtek",
    name: "Rumtek Monastery (Dharma Chakra Centre)",
    district: "Gangtok",
    location: "Rumtek, East Sikkim",
    founded: "18th c., rebuilt 1960s",
    sect: "Kagyu",
    image:
      "/images/Rumtek_Monastery.jpeg",
    short:
      "Seat-in-exile of the Karmapa lineage; intricate murals, golden stupa and monastic college.",
    highlights: ["Kora path", "Assembly hall", "Black Hat dance (Tsechu)"],
    url: "/monasteries/rumtek", // Add this line
  },
  {
    id: "palzor",
    name: "Pemayangtse Monastery",
    district: "Gyalshing",
    location: "Pelling, West Sikkim",
    founded: "1705",
    sect: "Nyingma",
    image:
      "/images/Pemayangtse-Monastery.jpg",
    short:
      "One of Sikkim's oldest; houses the famed wooden reliquary 'Zangdok Palri'.",
    highlights: ["Zangdok Palri model", "Museum", "Himalayan vistas"],
    url: "/monasteries/rumtek", // Add this line
  },
  {
    id: "tashiding",
    name: "Tashiding Monastery",
    district: "Namchi",
    location: "Tashiding, South Sikkim",
    founded: "1717",
    sect: "Nyingma",
    image:
      "/images/Tashiding-Monastery.jpg",
    short:
      "Sacred site between Rathong and Rangeet rivers; famed for 'Bumchu' holy water festival.",
    highlights: ["Bumchu festival", "Chortens", "Panoramic trail"]
  },
  {
    id: "phodong",
    name: "Phodong Monastery",
    district: "Mangan",
    location: "North Sikkim",
    founded: "1740",
    sect: "Kagyu",
    image:
      "/images/Phodong Monastery.jpg",
    short:
      "Known for vibrant Cham dances and 18th‑century murals.",
    highlights: ["Cham dances", "Monastic library", "Countryside views"]
  },
  {
    id: "enchey",
    name: "Enchey Monastery",
    district: "Gangtok",
    location: "Ridge Road, Gangtok",
    founded: "1909",
    sect: "Nyingma",
    image:
      "/images/Enchey Monastery.jpg",
    short:
      "Guardian monastery of Gangtok; elegant woodwork and protective deities.",
    highlights: ["Losoong festival", "Prayer wheels", "City overlook"]
  },
];

// Custom icons for monasteries
const monasteryIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MAP_MARKERS = [
  { name: "Rumtek Monastery", lat: 27.315, lng: 88.611 },
  { name: "Pemayangtse Monastery", lat: 27.317, lng: 88.197 },
  { name: "Tashiding Monastery", lat: 27.279, lng: 88.322 },
  { name: "Phodong Monastery", lat: 27.676, lng: 88.572 },
  { name: "Enchey Monastery", lat: 27.343, lng: 88.609 },
];

const DISTRICTS = ["All", "Gangtok", "Gyalshing", "Namchi", "Mangan"];
const SECTS = ["All", "Nyingma", "Kagyu", "Sakya", "Gelug"];

export default function SikkimMonasteriesHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [district, setDistrict] = useState("All");
  const [sect, setSect] = useState("All");

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    try {
      const data = await subscribeNewsletter(newsletterEmail);
      setNewsletterStatus("success");
      setNewsletterMsg(data.message || "Subscribed! Thank you.");
      setNewsletterEmail("");
    } catch (err) {
      setNewsletterStatus("error");
      setNewsletterMsg(err.message || "Subscription failed. Try again.");
    }
  };

  const filtered = useMemo(() => {
    return MONASTERIES.filter((m) => {
      const matchQ = (m.name + " " + m.location + " " + m.short)
        .toLowerCase()
        .includes(q.toLowerCase());
      const matchDistrict = district === "All" || m.district === district;
      const matchSect = sect === "All" || m.sect === sect;
      return matchQ && matchDistrict && matchSect;
    });
  }, [q, district, sect]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Nav */}
      
     <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b shadow-sm">
  <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

    {/* Logo + Title */}
    <div className="flex items-center gap-3">
      <img 
        src="/images/buddhism.png" 
        alt="Buddha Logo" 
        className="h-10 w-10 rounded-full shadow-md object-cover"
      />
      <span className="text-lg font-bold tracking-tight text-black-700">
        Monasteries of Sikkim
      </span>
    </div>

    {/* Navigation */}
    <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-700">
      <a href="#discover" className="hover:text-blue-600 transition-colors">Discover</a>
      <a href="#preserve" className="hover:text-blue-600 transition-colors">Preservation</a>
      <a href="#plan" className="hover:text-blue-600 transition-colors">Plan Your Visit</a>
      <Link to="/sessions" className="hover:text-blue-600 transition-colors">Live Sessions</Link>
      <Link to="/handicrafts" className="hover:text-blue-600 transition-colors">Shop</Link>
    </nav>

    {/* Auth + Donate Buttons */}
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <span className="hidden sm:block text-sm text-slate-600">Hi, {user.username}</span>
          <Link to="/profile">
            <Button variant="outline" className="rounded-2xl">My Profile</Button>
          </Link>
          {user.role === "ADMIN" && (
            <Link to="/admin">
              <Button variant="outline" className="rounded-2xl">Admin</Button>
            </Link>
          )}
          <Button variant="outline" className="rounded-2xl" onClick={logout}>Logout</Button>
        </>
      ) : (
        <>
          <Link to="/login">
            <Button variant="outline" className="rounded-2xl">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="rounded-2xl">Register</Button>
          </Link>
        </>
      )}
      <Link to="/donate">
        <Button className="rounded-2xl bg-slate-900 hover:bg-slate-700 text-white shadow-md">
          Donate / Support
        </Button>
      </Link>
    </div>

  </div>
</header>


      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/images/hero-section_image.jpg')] bg-cover bg-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 text-white">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl"
          >
            Explore, Respect, and Help Preserve the Living Heritage of Sikkim's Monasteries
          </motion.h1>
          <p className="mt-4 max-w-2xl text-white/90">
            A curated guide to sacred spaces—built for mindful travel, community stories, and
            cultural conservation.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-[2fr,1fr,1fr]">
            <div className="flex items-center gap-2 bg-black/40 rounded-2xl p-2">
              <Search className="ml-2" aria-hidden />
              <Input
                className="border-0 bg-transparent focus-visible:ring-0"
                placeholder="Search monastery, town, or highlight"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="rounded-2xl bg-black/40">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                {DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sect} onValueChange={setSect}>
              <SelectTrigger className="rounded-2xl bg-black/0">
                <SelectValue placeholder="Sect" />
              </SelectTrigger>
              <SelectContent>
                {SECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm text-white/90">
            <Badge variant="secondary" className="bg-white/90 text-slate-900 rounded-xl">
              <Filter className="h-3.5 w-3.5 mr-1" /> Filters active
            </Badge>
            <span className="opacity-90">{filtered.length} places match</span>
          </div>
        </div>
      </section>

      {/* Discover grid */}
      <section id="discover" className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-14">

        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Monasteries</h2>
            <p className="text-slate-600 mt-1">Explore Sikkim’s iconic monasteries, each showcasing rich spiritual heritage, culture, and timeless traditions.</p>
          </div>
          <Link to="/monasteries"><Button variant="outline" className="rounded-2xl">View All</Button></Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
            >
              <Card className="overflow-hidden rounded-2xl">
                <div className="h-48 w-full bg-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.image}
                    alt={m.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{m.name}</CardTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {m.location}</span>
                    <span className="inline-flex items-center gap-1"><Flag className="h-4 w-4" /> {m.sect}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {m.founded}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700">{m.short}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.highlights.map((h) => (
                      <Badge key={h} variant="secondary" className="rounded-xl">{h}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/monasteries/${m.id}`}>
                      <Button className="rounded-xl">Details</Button>
                    </Link>
                    
                    <Button variant="outline" className="rounded-xl" asChild>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.name + ' ' + m.location)}`} target="_blank" rel="noreferrer">
                        Open in Maps <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Preservation section */}
      <section id="preserve" className="bg-slate-50 border-t">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-14">

          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Preservation & Community</h2>
              <p className="mt-3 text-slate-700">
                These monasteries are living institutions—homes of practice, learning, and local
                identity. Travel with care: follow dress codes, ask before photos, and keep silence in
                prayer halls. Contributions support conservation of manuscripts, murals, and
                earthquake retrofitting.
              </p>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li className="flex items-start gap-2"><BookOpen className="h-5 w-5 mt-0.5" /> Support digitization of texts and oral histories.</li>
                <li className="flex items-start gap-2"><Landmark className="h-5 w-5 mt-0.5" /> Fund structural conservation and heritage crafts.</li>
                <li className="flex items-start gap-2"><Compass className="h-5 w-5 mt-0.5" /> Encourage training of local guides and monks in visitor management.</li>
              </ul>
              <div className="mt-6 flex gap-3">
                <Button className="rounded-2xl">Volunteer</Button>
                <Button variant="outline" className="rounded-2xl">Read Project Charter</Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Monasteries mapped", value: 65, icon: <MapPin className="h-5 w-5" /> },
                { label: "Texts digitized", value: 4200, icon: <BookOpen className="h-5 w-5" /> },
                { label: "Festivals documented", value: 32, icon: <Calendar className="h-5 w-5" /> },
                { label: "Local guides trained", value: 118, icon: <Compass className="h-5 w-5" /> },
              ].map((i) => (
                <Card key={i.label} className="rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">{i.value}</div>
                      <div className="text-slate-500">{i.icon}</div>
                    </div>
                    <div className="mt-2 text-slate-600 text-sm">{i.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plan */}
      <section id="plan" className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-14">

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <Card className="rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mountain className="h-5 w-5" /> Plan Your Visit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-700">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <div className="font-medium">Best seasons</div>
                    <p className="text-sm">Oct–Dec and Mar–May for clear skies; winter can be cold, monsoon brings landslides.</p>
                  </div>
                  <div>
                    <div className="font-medium">Permits</div>
                    <p className="text-sm">Carry valid ID; some North Sikkim areas need special permits via tour operators.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <div className="font-medium">Etiquette</div>
                    <ul className="text-sm list-disc pl-5 mt-1 space-y-1">
                      <li>Dress modestly; remove hats inside shrines.</li>
                      <li>No flash in prayer halls; ask before photos.</li>
                      <li>Keep right during kora (circumambulation).</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium">Getting around</div>
                    <ul className="text-sm list-disc pl-5 mt-1 space-y-1">
                      <li>Shared jeeps between towns</li>
                      <li>Local taxis for short hops</li>
                      <li>Hire certified heritage guides</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium">Responsible travel</div>
                    <ul className="text-sm list-disc pl-5 mt-1 space-y-1">
                      <li>Carry refillable water bottles</li>
                      <li>Respect prayer flags and wheels</li>
                      <li>Support local homestays & crafts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Upcoming Festivals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Bumchu", when: "Feb/March", where: "Tashiding", note: "Holy water ceremony" },
                  { name: "Tsechu", when: "Aug/Sept", where: "Rumtek", note: "Kagyu Black Hat dance" },
                  { name: "Losoong/Namsoong", when: "Dec", where: "Statewide", note: "Harvest & new year" },
                ].map((e) => (
                  <div key={e.name} className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{e.name}</div>
                      <div className="text-sm text-slate-600">{e.note}</div>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <div>{e.when}</div>
                      <div className="flex items-center gap-1 justify-end"><MapPin className="h-4 w-4" /> {e.where}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
<section className="bg-slate-50 border-t">
  <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-14">
    <div className="grid gap-6 lg:grid-cols-3 items-center">
      {/* Left side */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Interactive Map</h2>
        <p className="mt-2 text-slate-700">
          Explore monasteries on the map, read visitor notes, and build your itinerary.
        </p>
        <div className="mt-4 flex gap-3">
          <Button className="rounded-2xl">Open Map</Button>
          <Button variant="outline" className="rounded-2xl">Save Itinerary</Button>
        </div>
      </div>

      {/* Right side - Actual Map */}
      <Card className="lg:col-span-2 rounded-2xl overflow-hidden h-80">
        <CardContent className="p-0 h-full w-full">
          <MapContainer
            center={[27.533, 88.512]} // Center on Sikkim
            zoom={8}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
             {MAP_MARKERS.map((m) => (
              <Marker key={m.name} position={[m.lat, m.lng]} icon={monasteryIcon}>
                <Popup>{m.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </CardContent>
      </Card>
    </div>
  </div>
</section>


     {/* Newsletter / CTA */}
<section className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
  <Card className="rounded-3xl overflow-hidden shadow-xl border-0">
    <div className="grid lg:grid-cols-2">
      {/* Left Content */}
      <div className="p-10 lg:p-12 flex flex-col justify-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Stay Connected with Sikkim’s Heritage
        </h3>
        <p className="mt-3 text-slate-600 text-base">
          Join our community for monthly insights on monastery conservation, cultural stories, 
          and mindful travel updates delivered straight to your inbox.
        </p>

        {/* Input + Button */}
        <form onSubmit={handleNewsletter} className="mt-6 flex gap-3">
          <Input
            className="rounded-2xl flex-1 px-4 py-3 text-base border border-gray-300 shadow-sm focus:ring-2 focus:ring-slate-400"
            placeholder="Enter your email"
            type="email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
            className="rounded-2xl px-6 py-3 text-base font-semibold shadow-md bg-slate-900 hover:bg-slate-700 text-white disabled:opacity-60"
          >
            {newsletterStatus === "loading" ? "..." : newsletterStatus === "success" ? "✓ Done" : "Subscribe"}
          </Button>
        </form>

        {newsletterMsg && (
          <p className={`mt-2 text-sm ${newsletterStatus === "success" ? "text-green-600" : "text-red-500"}`}>
            {newsletterMsg}
          </p>
        )}

        <p className="mt-3 text-xs text-slate-500">
          We respect your inbox — unsubscribe anytime.
        </p>
      </div>

      {/* Right Image with Gradient Overlay */}
      <div className="relative min-h-[260px]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 z-10" />
        <div
          className="absolute inset-0 bg-[url('/images/newsletter.jpg')] bg-cover bg-center"
          aria-hidden
        />
      </div>
    </div>
  </Card>
</section>


      {/*Footer */}
<footer className="bg-gray-900 text-gray-300">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-5 gap-12 border-b border-gray-700">
    
    {/* Company Info */}
    <div className="lg:col-span-2">
      <div className="flex items-center space-x-2">
        {/* Replace with your logo */}
        <span className="text-2xl font-bold text-white">Sikkim Atlas</span>
      </div>
      <p className="mt-4 text-sm text-gray-400 max-w-lg">
        A volunteer-led initiative to document Sikkim's monasteries and promote mindful tourism, preserving cultural heritage for future generations.
      </p>
      {/* Social Media Icons */}
      <div className="mt-6 flex space-x-4">
        {/* Example social links, replace href with actual links */}
        <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors duration-300">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.873v-6.985h-2.54V12h2.54V9.799c0-2.502 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.77l-.44 2.893h-2.33v6.985C18.343 21.128 22 16.991 22 12z"></path></svg>
        </a>
        <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors duration-300">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.013 4.85.07c3.252.145 4.771 1.691 4.916 4.916.057 1.266.07 1.646.07 4.85s-.013 3.584-.07 4.85c-.145 3.252-1.691 4.771-4.916 4.916-.057.019-1.266.07-4.85.07s-3.584-.013-4.85-.07c-3.252-.145-4.771-1.691-4.916-4.916-.057-1.266-.07-1.646-.07-4.85s.013-3.584.07-4.85c.145-3.252 1.691-4.771 4.916-4.916.057-.019 1.266-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.203-6.185 2.328-6.386 6.386-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.203 4.358 2.328 6.185 6.386 6.386 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c4.358-.203 6.185-2.328 6.386-6.386.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.203-4.358-2.328-6.185-6.386-6.386-1.28-.058-1.688-.072-4.947-.072zM12 5.163c-3.79 0-6.837 3.047-6.837 6.837s3.047 6.837 6.837 6.837 6.837-3.047 6.837-6.837-3.047-6.837-6.837-6.837zm0 11.371c-2.557 0-4.596-2.039-4.596-4.596s2.039-4.596 4.596-4.596 4.596 2.039 4.596 4.596-2.039 4.596-4.596 4.596z"></path></svg>
        </a>
      </div>
    </div>
    
    {/* Navigation Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:col-span-3">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">About</h3>
        <ul className="space-y-3 text-sm">
          <li><a href="#preserve" className="text-gray-400 hover:text-white transition-colors duration-300">Our Mission</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Team</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Partnerships</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
        <ul className="space-y-3 text-sm">
          <li><Link to="/monasteries" className="text-gray-400 hover:text-white transition-colors duration-300">All Monasteries</Link></li>
          <li><Link to="/sessions" className="text-gray-400 hover:text-white transition-colors duration-300">Live Sessions</Link></li>
          <li><Link to="/handicrafts" className="text-gray-400 hover:text-white transition-colors duration-300">Handicraft Shop</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Community</h3>
        <ul className="space-y-3 text-sm">
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Volunteer</a></li>
          <li><Link to="/donate" className="text-gray-400 hover:text-white transition-colors duration-300">Donate</Link></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Report Updates</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
        <ul className="space-y-3 text-sm">
          <li>Gangtok, Sikkim</li>
          <li><a href="mailto:heritage@sikkim.org" className="text-gray-400 hover:text-white transition-colors duration-300">heritage@sikkim.org</a></li>
        </ul>
      </div>
    </div>

  </div>
  
  {/* Copyright Section */}
  <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-gray-500">
    © {new Date().getFullYear()} Sikkim Monastery Atlas • Built for cultural preservation
  </div>
</footer>
    </div>
  );
}
