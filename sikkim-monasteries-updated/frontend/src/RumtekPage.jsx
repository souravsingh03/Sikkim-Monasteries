// src/RumtekPage.jsx
import React from "react";
import { BookOpen, motion } from "framer-motion";
import { BookOpen,
  MapPin,
  Calendar,
  Compass,
  Landmark,
  ExternalLink,
} from "lucide-react";
import { BookOpen, Button } from "@/components/ui/button";
import { BookOpen, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Badge } from "@/components/ui/badge";

const RumtekPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558981852-426c6c22a3d9?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 text-white flex flex-col justify-center items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl"
          >
            Rumtek Monastery (Dharma Chakra Centre)
          </motion.h1>
          <p className="mt-4 max-w-2xl text-white/90 text-lg">
            The seat-in-exile of the Karmapa, this monastery is a beacon of the Kagyu lineage and a center for learning.
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm text-white/90">
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> Rumtek, East Sikkim</span>
            <span className="inline-flex items-center gap-1"><Landmark className="h-4 w-4" /> Kagyu Sect</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> Rebuilt 1960s</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 grid gap-10 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> About the Monastery</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                Rumtek Monastery, also known as the Dharma Chakra Centre, is a crucial hub of the Kagyu sect of Tibetan Buddhism. Originally established in the 18th century, it was rebuilt in the 1960s by the 16th Karmapa, Rangjung Rigpe Dorje, as his main seat in India after fleeing Tibet.
              </p>
              <p>
                The monastery complex is a beautiful example of Tibetan monastic architecture, featuring a main temple, a shrine hall, a golden stupa containing the relics of the 16th Karmapa, and a monastic college (Shedra). The intricate murals, statues, and thangkas inside the shrine hall are breathtaking and depict scenes from Buddhist mythology.
              </p>
              <p>
                Rumtek is particularly famous for its sacred **Black Hat dance** (Tsechu), performed annually on the 10th day of the 5th Tibetan month. This ritual dance is a highlight for visitors and a profound spiritual experience for devotees.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> How to Visit</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                The monastery is located approximately 24 kilometers from Gangtok. You can hire a taxi or a shared jeep to reach the site. Visitors are required to show a valid ID at the entrance.
              </p>
              <h3 className="text-xl font-bold mt-4">Visitor Tips:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dress modestly, covering your shoulders and knees.</li>
                <li>Remove your shoes before entering the main shrine hall.</li>
                <li>Photography is often restricted inside the main hall, so be sure to ask for permission.</li>
                <li>Maintain silence and respect the peaceful atmosphere.</li>
                <li>The `kora` (circumambulation) path around the monastery is a beautiful walk.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Highlights & Map */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-xl">Black Hat Dance (Tsechu)</Badge>
                <Badge className="rounded-xl">Golden Stupa</Badge>
                <Badge className="rounded-xl">Monastic College</Badge>
                <Badge className="rounded-xl">Intricate Murals</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Getting Around</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full rounded-xl" asChild>
                <a href="https://maps.google.com/?q=Rumtek+Monastery+East+Sikkim" target="_blank" rel="noreferrer">
                  Open in Maps <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RumtekPage;