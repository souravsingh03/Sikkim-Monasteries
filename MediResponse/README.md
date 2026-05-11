# MediLink — Emergency Response System

A full-stack emergency coordination platform for paramedics, hospitals, and toll operators.

## Project Structure

```
medilink/
├── frontend/                        # React + TypeScript (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ambulance/
│   │   │   │   └── AmbulanceView.tsx   # Paramedic form with voice input & AI triage
│   │   │   ├── hospital/
│   │   │   │   └── HospitalView.tsx    # Live patient monitoring dashboard
│   │   │   ├── toll/
│   │   │   │   └── TollView.tsx        # Emergency lane clearance system
│   │   │   └── shared/
│   │   │       ├── Layout.tsx          # App shell / navigation
│   │   │       └── LoginView.tsx       # Auth screen
│   │   ├── hooks/
│   │   │   └── useSpeechRecognition.ts # Voice input hook (Web Speech API)
│   │   ├── services/
│   │   │   ├── geminiService.ts        # Gemini AI triage integration
│   │   │   ├── authService.ts          # Auth logic (demo + JWT-ready)
│   │   │   └── api.ts                  # Spring Boot REST client
│   │   ├── types/
│   │   │   └── index.ts                # Shared TypeScript types & enums
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── .env.example                    # Environment variable template
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                         # Spring Boot (Java 17 + Maven)
    ├── src/main/java/com/medilink/
    │   ├── controller/              # REST controllers
    │   ├── service/                 # Business logic
    │   ├── repository/              # JPA repositories
    │   ├── model/                   # JPA entities
    │   ├── dto/                     # Request/Response DTOs
    │   ├── config/                  # Spring config (CORS, beans)
    │   └── security/                # JWT filter, UserDetails
    └── src/main/resources/
        └── application.properties   # DB + server config
```

---

## Tech Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Frontend  | React 19, TypeScript, Vite 6          |
| Styling   | Tailwind CSS 3                        |
| AI        | Google Gemini 2.0 Flash               |
| Voice     | Web Speech API (built-in browser API) |
| Backend   | Spring Boot 3.2, Java 17              |
| Auth      | JWT (jjwt 0.12.3)                     |
| Database  | MySQL                                 |
| Build     | Maven                                 |

---

## Getting Started

### Frontend

```bash
cd frontend
cp .env.example .env          # Add your VITE_GEMINI_API_KEY
npm install
npm run dev                   # Starts at http://localhost:3000
```

### Backend

```bash
cd backend
# Set up MySQL and update src/main/resources/application.properties
./mvnw spring-boot:run        # Starts at http://localhost:8080
```

### Demo Credentials

| Role           | Employee ID | Password  |
|----------------|-------------|-----------|
| Paramedic      | AMB-001     | demo123   |
| Hospital Admin | HOSP-001    | demo123   |
| Toll Operator  | TOLL-001    | demo123   |

---

## Voice Input

Voice input uses the browser's native **Web Speech API** — no third-party service needed.

**Works in:** Chrome, Edge, Safari (iOS/macOS)  
**Does NOT work in:** Firefox (no support), HTTP (needs HTTPS in production)

The `useSpeechRecognition` hook in `src/hooks/useSpeechRecognition.ts` handles:
- Browser support detection
- Microphone permission errors
- Network/audio errors with friendly messages
- Auto-cleanup on unmount

---

## Deploying Live

### Frontend — Recommended: **Vercel** (free, instant)

1. Push the `frontend/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set root directory to `frontend`
4. Add environment variables: `VITE_GEMINI_API_KEY`, `VITE_API_BASE_URL`
5. Deploy — gets a `.vercel.app` URL automatically

> Voice input requires **HTTPS**, which Vercel provides automatically.

### Alternative Frontend hosts
- **Netlify** — similar to Vercel, also free
- **GitHub Pages** — free but no env vars (use Netlify/Vercel instead)

### Backend — Recommended: **Railway** (free tier)

1. Push `backend/` to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a MySQL plugin
4. Set environment variables (DB URL, JWT secret)
5. Railway auto-builds with Maven and gives a public URL

### Alternative Backend hosts
- **Render** — free tier, auto-deploys from GitHub
- **Fly.io** — more control, Docker-based

---

## Environment Variables

### Frontend (`frontend/.env`)
```
VITE_GEMINI_API_KEY=your_key_here
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

### Backend (`application.properties`)
```properties
spring.datasource.url=jdbc:mysql://your-db-host/medilink
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your-256-bit-secret
```
