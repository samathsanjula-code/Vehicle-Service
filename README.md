# Vehicle Service App

A mobile application for managing vehicle service payments, built with **React Native (Expo)** and **Node.js + Express**.

---

## Project Structure

```
Vehicle-Service/
├── frontend/              ← Expo mobile app (React Native)
│   ├── app/               ← Screens (Expo Router)
│   │   ├── (tabs)/        ← Tab screens (Payments)
│   │   ├── create-payment.tsx
│   │   └── services/      ← API service layer (axios)
│   ├── components/        ← Reusable UI components
│   ├── constants/         ← API endpoints & config (api.ts)
│   └── context/           ← Auth state management (AuthContext)
├── backend/               ← Node.js + Express API server
│   ├── controllers/       ← Business logic
│   ├── models/            ← MongoDB / Mongoose schemas
│   ├── routes/            ← API route handlers
│   └── middleware/        ← JWT Authentication
├── start.bat              ← 🚀 One-click start script (Windows)
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Expo Go](https://expo.dev/go) app on your phone
- MongoDB Atlas account (connection string in `backend/.env`)

---

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

### 2. Frontend

```bash
cd frontend
npm install
```

The frontend auto-detects the backend IP — no `.env` changes needed.

---

## Running the App

### Windows (one-click)
Double-click **`start.bat`** — opens both servers in separate windows automatically.

### Mac / Linux

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npx expo start --clear
```

Then scan the QR code with **Expo Go** on your phone.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/payments` | Get all payments |
| POST | `/api/payments` | Create a payment |
| GET | `/api/payments/:id` | Get payment by ID |
| PATCH | `/api/payments/:id/status` | Update payment status |
| DELETE | `/api/payments/:id` | Delete a payment |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native + Expo Router |
| Styling | NativeWind (Tailwind CSS) |
| HTTP | Axios |
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (middleware ready) |
