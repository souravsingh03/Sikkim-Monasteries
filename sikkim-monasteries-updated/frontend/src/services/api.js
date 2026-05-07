const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders(), ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Something went wrong");
  return data;
}

// AUTH
export const register = (p) => request("/auth/register", { method: "POST", body: JSON.stringify(p) });
export const login = (p) => request("/auth/login", { method: "POST", body: JSON.stringify(p) });
export const getMe = () => request("/auth/me");

// NEWSLETTER
export const subscribeNewsletter = (email) =>
  request("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email }) });

// DONATIONS
export const submitDonation = (p) => request("/donations", { method: "POST", body: JSON.stringify(p) });
export const getMyDonations = () => request("/donations/my");

// MONASTERIES
export const getMonasteries = () => request("/monasteries");
export const getMonastery = (slug) => request(`/monasteries/${slug}`);

// QR STAMPS
export const getMyStamps = () => request("/stamps/my");
export const scanQrCode = (qrCode) =>
  request("/stamps/scan", { method: "POST", body: JSON.stringify({ qrCode }) });

// MONK SESSIONS
export const getSessions = () => request("/sessions");
export const getUpcomingSessions = () => request("/sessions/upcoming");
export const getLiveSessions = () => request("/sessions/live");
export const getSession = (id) => request(`/sessions/${id}`);
export const registerForSession = (id) => request(`/sessions/${id}/register`, { method: "POST" });
export const getMySessionRegistrations = () => request("/sessions/my");

// HANDICRAFTS
export const getHandicrafts = () => request("/handicrafts");
export const getHandicraft = (id) => request(`/handicrafts/${id}`);

// ADMIN
export const getAdminStats = () => request("/admin/stats");
export const getAdminUsers = () => request("/admin/users");
export const getAdminDonations = () => request("/admin/donations");
export const getAdminSubscribers = () => request("/admin/newsletter");
