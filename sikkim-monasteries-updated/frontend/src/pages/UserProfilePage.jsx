import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, QrCode, Heart, Video, LogOut, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { getMyDonations, getMyStamps, getMySessionRegistrations } from "../services/api";

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const [donations, setDonations] = useState([]);
  const [stamps, setStamps] = useState({ stamps: [], count: 0, total: 8 });
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState("stamps");

  useEffect(() => {
    getMyDonations().then(setDonations).catch(() => {});
    getMyStamps().then(setStamps).catch(() => {});
    getMySessionRegistrations().then(setSessions).catch(() => {});
  }, []);

  const stampPercent = Math.round((stamps.count / (stamps.total || 8)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/buddhism.png" alt="Logo" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-bold">Monasteries of Sikkim</span>
          </Link>
          <Button variant="outline" className="rounded-2xl" onClick={logout}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-10">
          <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center text-white text-2xl font-bold">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user?.username}</h1>
            <p className="text-slate-600">{user?.email}</p>
            <Badge variant="secondary" className="rounded-xl mt-1">{user?.role || "TOURIST"}</Badge>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="rounded-2xl text-center"><CardContent className="pt-5 pb-4"><div className="text-3xl font-bold text-slate-900">{stamps.count}</div><div className="text-sm text-slate-500 mt-1">Stamps Collected</div></CardContent></Card>
          <Card className="rounded-2xl text-center"><CardContent className="pt-5 pb-4"><div className="text-3xl font-bold text-slate-900">{donations.length}</div><div className="text-sm text-slate-500 mt-1">Donations Made</div></CardContent></Card>
          <Card className="rounded-2xl text-center"><CardContent className="pt-5 pb-4"><div className="text-3xl font-bold text-slate-900">{sessions.length}</div><div className="text-sm text-slate-500 mt-1">Sessions Joined</div></CardContent></Card>
        </div>

        {/* Stamp Progress */}
        <Card className="rounded-2xl mb-8 bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-amber-900"><Award className="h-5 w-5" />Monastery Passport Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-amber-800 mb-2">
              <span>{stamps.count} of {stamps.total} monasteries visited</span>
              <span className="font-bold">{stampPercent}%</span>
            </div>
            <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-600 rounded-full transition-all" style={{ width: `${stampPercent}%` }} />
            </div>
            {stampPercent === 100 && <p className="mt-2 text-sm text-amber-700 font-medium flex items-center gap-1"><Star className="h-4 w-4" />Congratulations! You've completed the Sikkim Monastery Passport!</p>}
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[["stamps", "QR Stamps", QrCode], ["donations", "Donations", Heart], ["sessions", "Sessions", Video]].map(([key, label, Icon]) => (
            <Button key={key} variant={tab === key ? "default" : "outline"} className="rounded-2xl" onClick={() => setTab(key)}>
              <Icon className="h-4 w-4 mr-2" />{label}
            </Button>
          ))}
        </div>

        {tab === "stamps" && (
          <div>
            {stamps.stamps?.length === 0 ? (
              <div className="text-center py-16">
                <QrCode className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No stamps yet. Visit a monastery and scan the QR code!</p>
                <Link to="/monasteries"><Button className="mt-4 rounded-2xl">Explore Monasteries</Button></Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {stamps.stamps.map((s) => (
                  <Card key={s.id} className="rounded-2xl">
                    <CardContent className="pt-4 flex items-center gap-3">
                      <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center"><QrCode className="h-5 w-5 text-amber-700" /></div>
                      <div><p className="font-medium text-slate-900">{s.monastery?.name || s.qrCode}</p><p className="text-xs text-slate-500">{new Date(s.stampedAt).toLocaleDateString("en-IN")}</p></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "donations" && (
          <div>
            {donations.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No donations yet. Support the monasteries!</p>
                <Link to="/donate"><Button className="mt-4 rounded-2xl">Make a Donation</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {donations.map((d) => (
                  <Card key={d.id} className="rounded-2xl"><CardContent className="py-4 flex items-center justify-between">
                    <div><p className="font-medium">{d.purpose}</p><p className="text-xs text-slate-500">{new Date(d.createdAt).toLocaleDateString("en-IN")}</p></div>
                    <div className="text-right"><p className="font-bold text-slate-900">₹{d.amount}</p><Badge variant="secondary" className="text-xs">{d.status || "COMPLETED"}</Badge></div>
                  </CardContent></Card>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "sessions" && (
          <div>
            {sessions.length === 0 ? (
              <div className="text-center py-16">
                <Video className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No sessions joined yet.</p>
                <Link to="/sessions"><Button className="mt-4 rounded-2xl">Browse Sessions</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((r) => (
                  <Card key={r.id} className="rounded-2xl"><CardContent className="py-4">
                    <p className="font-medium">{r.session?.title}</p>
                    <p className="text-xs text-slate-500 mt-1">Registered: {new Date(r.registeredAt).toLocaleDateString("en-IN")}</p>
                  </CardContent></Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
