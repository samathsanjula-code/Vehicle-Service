# 🚗 MotoHub – Vehicle Service Mobile App

A full-stack mobile application built with **Expo (React Native)** and a **Node.js + Express + MongoDB** backend.

---

## 📁 Project Structure

```
service/                  ← Expo mobile app (run this folder)
├── app/                  ← Screens (file-based routing via Expo Router)
│   ├── (auth)/           ← Login & Signup screens
│   ├── (tabs)/           ← Main app tabs
│   └── (admin)/          ← Admin dashboard
├── backend/              ← Node.js + Express API server
│   ├── middleware/        ← JWT auth middleware
│   ├── models/            ← Mongoose schemas
│   ├── routes/            ← API route handlers
│   ├── server.js          ← Entry point
│   ├── .env.example       ← ⚠️ Copy this to .env and fill in your values
│   └── .env               ← ❌ NOT committed – create this yourself
├── constants/
│   └── api.ts             ← ⚠️ Change BASE_URL here to your PC's IP
├── context/
│   └── AuthContext.tsx    ← Auth state management
└── ...
```

---

## ✅ Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [Expo Go](https://expo.dev/go) app on your phone **or** an Android emulator
- A free [MongoDB Atlas](https://cloud.mongodb.com) account

---

## 🚀 Getting Started (After Cloning)

### Step 1 – Clone the repo

```bash
git clone <your-repo-url>
cd service
```

---

### Step 2 – Set up the Backend

#### 2a. Install backend dependencies

```bash
cd backend
npm install
```

#### 2b. Create your `.env` file

Copy the template and fill in your own values:

```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

Open `backend/.env` and fill in:

```env
MONGO_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster>.mongodb.net/motohub
JWT_SECRET=any_long_random_secret_string_here
PORT=5000
```

> **MongoDB Atlas setup:**
> 1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create a free cluster
> 2. Database Access → Add a user with a password
> 3. Network Access → Allow your IP (or `0.0.0.0/0` for development)
> 4. Connect → Drivers → Copy the connection string and paste into `MONGO_URI`

#### 2c. Start the backend server

```bash
npm run dev        # with auto-restart (nodemon)
# or
npm start          # without auto-restart
```

You should see:
```
✅ MongoDB connected successfully to Atlas
🚀 MotoHub API server running on port 5000
```

---

### Step 3 – Set your PC's IP in the mobile app

The mobile app needs to know your PC's local IP address to reach the backend.

**Find your IP:**
- **Windows:** Open Command Prompt → type `ipconfig` → look for **IPv4 Address**
- **Mac/Linux:** Open Terminal → type `ifconfig` → look for **inet** under your Wi-Fi adapter

Open **`constants/api.ts`** and update `BASE_URL`:

```ts
// constants/api.ts  ← THE ONLY FILE YOU NEED TO CHANGE
export const BASE_URL = 'http://YOUR_PC_IP:5000';   // e.g. 'http://192.168.1.105:5000'
```

> ⚠️ Your phone and PC must be on the **same Wi-Fi network**.

---

### Step 4 – Install mobile app dependencies

From the `service/` root folder:

```bash
npm install
```

---

### Step 5 – Start the mobile app

```bash
npx expo start
```

Then:
- Scan the QR code with **Expo Go** (Android/iOS)
- Or press `a` to open in Android emulator

---

## 🔑 Default Admin Account

An admin account is automatically created on first server start:

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@motohub.com`    |
| Password | `admin123`             |

> Change these credentials after first login.

---

## 🛠️ Common Issues

| Problem | Fix |
|--------|-----|
| **Network Error / Could not connect** | Wrong IP in `constants/api.ts` — update `BASE_URL` to your PC's IP |
| **MongoDB connection failed** | Check `MONGO_URI` in `backend/.env` — ensure Atlas IP whitelist includes your IP |
| **Port already in use** | Change `PORT` in `backend/.env` to another value (e.g. `5001`) and update `BASE_URL` accordingly |
| **Expo QR code not working** | Make sure phone and PC are on the same Wi-Fi network |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile App | Expo (React Native), Expo Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Styling | React Native StyleSheet |
