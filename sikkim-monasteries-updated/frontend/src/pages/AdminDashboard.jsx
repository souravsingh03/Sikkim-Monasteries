import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Building2, Heart, Mail, Video, ShoppingBag, Stamp, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { getAdminStats, getAdminUsers, getAdminDonations, getAdminSubscribers } from "../services/api";

const STATIC_STATS = { totalUsers: 248, totalDonations: 134, totalMonasteries: 25, newsletterSubscribers: 892, totalSessions: 18, totalHandicrafts: 42, totalStamps: 1204 };

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(STATIC_STATS);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    getAdminStats().then(setStats).catch(() => {});
    getAdminUsers().then(setUsers).catch(() => {});
    getAdminDonations().then(setDonations).catch(() => {});
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Donations", value: stats.totalDonations, icon: Heart, color: "text-red-600", bg: "bg-red-50" },
    { label: "Monasteries", value: stats.totalMonasteries, icon: Building2, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Newsletter Subs", value: stats.newsletterSubscribers, icon: Mail, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Monk Sessions", value: stats.totalSessions, icon: Video, color: "text-green-600", bg: "bg-green-50" },
    { label: "Handicraft Items", value: stats.totalHandicrafts, icon: ShoppingBag, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "QR Stamps Given", value: stats.totalStamps, icon: Stamp, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/buddhism.png" alt="Logo" className="h-8 w-8 rounded-full" />
            <span className="font-bold">Admin Dashboard</span>
            <span className="text-slate-400 text-sm">· Sikkim Monasteries</span>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-sm text-slate-300">Hi, {user?.username}</span>
            <Link to="/"><Button variant="outline" size="sm" className="rounded-xl text-slate-800">View Site</Button></Link>
            <Button variant="ghost" size="sm" className="rounded-xl text-slate-300" onClick={logout}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Overview</h1>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="rounded-2xl">
              <CardContent className="pt-5 pb-4 flex items-center gap-4">
                <div className={`h-11 w-11 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{value?.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["overview", "users", "donations"].map((t) => (
            <Button key={t} variant={tab === t ? "default" : "outline"} className="rounded-2xl capitalize" onClick={() => setTab(t)}>{t}</Button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full rounded-xl justify-start" variant="outline"><Building2 className="h-4 w-4 mr-2" />Add New Monastery</Button>
                <Button className="w-full rounded-xl justify-start" variant="outline"><Video className="h-4 w-4 mr-2" />Schedule Monk Session</Button>
                <Button className="w-full rounded-xl justify-start" variant="outline"><ShoppingBag className="h-4 w-4 mr-2" />Add Handicraft Item</Button>
                <Button className="w-full rounded-xl justify-start" variant="outline"><Mail className="h-4 w-4 mr-2" />Send Newsletter</Button>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {[{ msg: "New user registered", time: "2 min ago" }, { msg: "Donation received ₹5,000", time: "15 min ago" }, { msg: "QR stamp collected at Rumtek", time: "1 hr ago" }, { msg: "New newsletter subscriber", time: "3 hrs ago" }].map((a, i) => (
                    <div key={i} className="flex justify-between text-slate-700">
                      <span>{a.msg}</span>
                      <span className="text-slate-400 text-xs">{a.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "users" && (
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>All Users ({users.length || "Loading..."})</CardTitle></CardHeader>
            <CardContent>
              {users.length === 0 ? <p className="text-slate-500 text-sm">No users data. Backend may not be running.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b text-slate-500 text-left">{["Username", "Email", "Role"].map((h) => <th key={h} className="pb-2 pr-6 font-medium">{h}</th>)}</tr></thead>
                    <tbody>{users.map((u) => <tr key={u.id} className="border-b last:border-0"><td className="py-2 pr-6 font-medium">{u.username}</td><td className="py-2 pr-6">{u.email}</td><td className="py-2"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg text-xs">{u.role}</span></td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {tab === "donations" && (
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>All Donations ({donations.length || "Loading..."})</CardTitle></CardHeader>
            <CardContent>
              {donations.length === 0 ? <p className="text-slate-500 text-sm">No donation data. Backend may not be running.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b text-slate-500 text-left">{["Name", "Email", "Amount", "Purpose", "Status"].map((h) => <th key={h} className="pb-2 pr-4 font-medium">{h}</th>)}</tr></thead>
                    <tbody>{donations.map((d) => <tr key={d.id} className="border-b last:border-0"><td className="py-2 pr-4">{d.name}</td><td className="py-2 pr-4">{d.email}</td><td className="py-2 pr-4 font-semibold">₹{d.amount}</td><td className="py-2 pr-4">{d.purpose}</td><td className="py-2"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg text-xs">{d.status}</span></td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
