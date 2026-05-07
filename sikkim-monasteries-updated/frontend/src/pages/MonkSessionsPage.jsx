import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Video, Calendar, Clock, Users, Radio, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSessions, registerForSession } from "../services/api";
import { useAuth } from "../context/AuthContext";

const STATIC_SESSIONS = [
  { id: 1, title: "Introduction to Buddhist Meditation", monkName: "Lama Tenzin Dorje", monastery: "Rumtek", topic: "Meditation", description: "A beginner-friendly session on mindfulness and breathing meditation practices as taught in the Kagyu tradition.", scheduledAt: "2025-11-10T10:00:00", durationMinutes: 60, status: "UPCOMING", maxParticipants: 50, registeredCount: 34 },
  { id: 2, title: "Live Puja Ceremony — Losar Celebrations", monkName: "Geshe Karma Rinpoche", monastery: "Pemayangtse", topic: "Ceremony", description: "Watch a live traditional Tibetan New Year puja ceremony streamed directly from the monastery hall.", scheduledAt: "2025-11-15T08:00:00", durationMinutes: 120, status: "LIVE", maxParticipants: 200, registeredCount: 187 },
  { id: 3, title: "Buddhist Philosophy: The Four Noble Truths", monkName: "Khenpo Sonam Wangchuk", monastery: "Enchey", topic: "Philosophy", description: "An interactive lecture exploring the foundational teachings of the Buddha on suffering and liberation.", scheduledAt: "2025-11-20T16:00:00", durationMinutes: 90, status: "UPCOMING", maxParticipants: 80, registeredCount: 52 },
  { id: 4, title: "Thangka Painting Demonstration", monkName: "Tulku Pema", monastery: "Tashiding", topic: "Art", description: "Watch a master thangka artist demonstrate the intricate process of creating sacred Buddhist paintings.", scheduledAt: "2025-10-05T14:00:00", durationMinutes: 60, status: "COMPLETED", maxParticipants: 100, registeredCount: 100 },
];

function SessionCard({ session, onRegister, registering }) {
  const statusColor = { LIVE: "bg-red-100 text-red-700", UPCOMING: "bg-blue-100 text-blue-700", COMPLETED: "bg-slate-100 text-slate-600" };
  const date = new Date(session.scheduledAt);

  return (
    <Card className={`rounded-2xl overflow-hidden ${session.status === "LIVE" ? "border-2 border-red-300" : ""}`}>
      {session.status === "LIVE" && (
        <div className="bg-red-500 text-white text-xs font-bold text-center py-1 flex items-center justify-center gap-2">
          <Radio className="h-3 w-3 animate-pulse" /> LIVE NOW
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base leading-tight">{session.title}</CardTitle>
          <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusColor[session.status]}`}>{session.status}</span>
        </div>
        <p className="text-sm text-slate-500">{session.monkName} · {session.monastery} Monastery</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700 mb-3">{session.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{session.durationMinutes} mins</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{session.registeredCount}/{session.maxParticipants}</span>
        </div>
        <Badge variant="secondary" className="rounded-xl mb-3">{session.topic}</Badge>
        {session.status !== "COMPLETED" && (
          <Button
            className={`w-full rounded-xl ${session.status === "LIVE" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
            disabled={registering === session.id || session.registeredCount >= session.maxParticipants}
            onClick={() => onRegister(session.id)}
          >
            {registering === session.id ? "Registering..." : session.status === "LIVE" ? "Join Live Session" : "Register Now"}
          </Button>
        )}
        {session.status === "COMPLETED" && <p className="text-sm text-center text-slate-400">This session has ended</p>}
      </CardContent>
    </Card>
  );
}

export default function MonkSessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState(STATIC_SESSIONS);
  const [registering, setRegistering] = useState(null);
  const [msgs, setMsgs] = useState({});
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    getSessions().then((d) => { if (d?.length) setSessions(d); }).catch(() => {});
  }, []);

  const handleRegister = async (id) => {
    if (!user) { setMsgs((m) => ({ ...m, [id]: "Please login to register." })); return; }
    setRegistering(id);
    try {
      const res = await registerForSession(id);
      setMsgs((m) => ({ ...m, [id]: res.message }));
    } catch (e) {
      setMsgs((m) => ({ ...m, [id]: e.message }));
    } finally { setRegistering(null); }
  };

  const filtered = filter === "ALL" ? sessions : sessions.filter((s) => s.status === filter);

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
          <Video className="h-7 w-7 text-slate-700" />
          <h1 className="text-3xl font-bold text-slate-900">Live Monk Sessions</h1>
        </div>
        <p className="text-slate-600 mb-8">Connect with monks for live meditation sessions, puja ceremonies, and philosophical discourses.</p>

        <div className="flex gap-2 mb-8 flex-wrap">
          {["ALL", "LIVE", "UPCOMING", "COMPLETED"].map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} className="rounded-2xl" onClick={() => setFilter(f)}>
              {f === "LIVE" && <Radio className="h-3.5 w-3.5 mr-1 text-red-500" />}{f}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((session, idx) => (
            <motion.div key={session.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
              <SessionCard session={session} onRegister={handleRegister} registering={registering} />
              {msgs[session.id] && <p className="mt-2 text-sm text-center text-green-700">{msgs[session.id]}</p>}
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-slate-500 py-20">No sessions found for this filter.</p>}
      </div>
    </div>
  );
}
