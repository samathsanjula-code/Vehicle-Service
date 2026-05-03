# 🚗 MotoHub – Vehicle Service Mobile App

A full-stack mobile application built with **Expo (React Native)** and a **Node.js + Express + MongoDB** backend. This system manages vehicle service records, fleet management for admins, and service booking for customers.

---

## 📁 Project Structure

```text
Vehicle-Service/
├── frontend/              ← Expo mobile app (React Native)
│   ├── app/               ← Screens (Expo Router)
│   ├── components/        ← Reusable UI components
│   ├── constants/         ← API endpoints & IP config (api.ts)
│   └── context/           ← Auth state management
├── backend/               ← Node.js + Express API server
│   ├── controllers/       ← Business logic
│   ├── models/            ← MongoDB / Mongoose schemas
│   ├── routes/            ← API route handlers
│   └── middleware/        ← JWT Authentication
├── start.bat              ← 🚀 One-click start script (Windows)
└── README.md
```

---

## ✅ Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [Expo Go](https://expo.dev/go) app on your phone **or** an Android emulator
- A free [MongoDB Atlas](https://cloud.mongodb.com) account

---

## 🚀 Getting Started

### ⚡ Option 1: The Fast Way (One-Click Start)
If you are on Windows, this is the easiest way:
1.  **Configure Backend:** Create a `.env` file in the `backend/` folder (see step 2b below).
2.  **Install:** Run `npm install` inside both `frontend` and `backend` folders.
3.  **Launch:** Double-click **`start.bat`** in the root folder. 
    *   *It will auto-detect your IP and start both servers.*

---

### 🛠️ Option 2: Manual Step-by-Step

#### Step 1 – Clone the repo
```bash
git clone <your-repo-url>
cd Vehicle-Service
```

#### Step 2 – Set up the Backend
1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Create your `.env` file:**
   Copy the template and fill in your values:
   ```env
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/motohub
   JWT_SECRET=any_long_secret_string
   PORT=5000
   ```
3. **Start backend:** `npm run dev`

#### Step 3 – Set up the Mobile App (Frontend)
1. **Install dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```
2. **Set your PC's IP:**
   Open **`frontend/constants/api.ts`** and update `DEFAULT_LOCAL_URL` with your PC's local IP (find it by running `ipconfig` in terminal).
3. **Start Expo:** `npx expo start`
4. **Run on phone:** Scan the QR code with **Expo Go**.

---

## 🔑 Default Admin Account
| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@motohub.com`    |
| Password | `admin123`             |

---

## 🔌 API Endpoints Summary

### 🚘 Vehicle Management
| METHOD | ENDPOINT | DESCRIPTION | AUTH |
| :--- | :--- | :--- | :--- |
| GET | `/api/vehicles` | User's vehicle list | Yes |
| GET | `/api/vehicles/admin/all` | Full fleet (Admin view) | Yes |
| POST | `/api/vehicles` | Register new vehicle | Yes |
| PUT | `/api/vehicles/:id` | Update vehicle | Yes |
| DELETE | `/api/vehicles/:id` | Remove vehicle | Yes |

### 🛠️ Service Catalog
| METHOD | ENDPOINT | DESCRIPTION | AUTH |
| :--- | :--- | :--- | :--- |
| GET | `/api/services` | List all services | No |
| POST | `/api/services` | Add service | Yes (Admin) |
| PUT | `/api/services/:id` | Update service | Yes (Admin) |

---

## 🛠️ Common Issues & Fixes

| Problem | Fix |
|--------|-----|
| **Infinite Loading** | Ensure phone and PC are on the same Wi-Fi. Check if IP in `api.ts` matches your current IP. |
| **"Property user doesn't exist"** | Ensure you are using the latest code where `useAuth` destructuring is fixed. |
| **Duplicate Reg Number** | Change the registration number. If it says 'licensePlate' is duplicate, restart the backend. |
| **MongoDB Connection Failed** | Check your `MONGO_URI` and ensure Atlas IP Whitelist allows your connection. |

---

## 📦 Tech Stack
| Layer | Technology |
|-------|-----------|
| Mobile App | Expo (React Native), Expo Router, Axios |
| Backend | Node.js, Express.js, JWT |
| Database | MongoDB Atlas, Mongoose |
| Styling | Custom CSS-like StyleSheet (Card-based UI) |
