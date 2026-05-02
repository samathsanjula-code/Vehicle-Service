# MotoHub Full Project Documentation & Guide

මෙම ලේඛනය මගින් MotoHub ව්‍යාපෘතියේ සම්පූර්ණ තාක්ෂණික ව්‍යුහය (Architecture) සහ සංවර්ධන ක්‍රියාවලිය (Development Workflow) පැහැදිලි කරයි.

---

## 1. ව්‍යාපෘති ව්‍යුහය (Project Structure)
ව්‍යාපෘතිය ප්‍රධාන කොටස් දෙකකට බෙදා ඇත:
- **`/backend`**: Node.js & Express API එක. Database එක (MongoDB) සමඟ සම්බන්ධ වන්නේ මෙයයි.
- **`/frontend`**: React Native & Expo App එක. පරිශීලකයා දකින අතුරුමුහුණත මෙයයි.

---

## 2. Backend Architecture (Routes vs Controllers)
අපි Code එක පිරිසිදුව තබා ගැනීමට "Separation of Concerns" ක්‍රමය භාවිතා කරමු.

- **Models**: Database එකේ data structure එක (schema) මෙහි ඇත.
- **Controllers**: සියලුම logic (Data ගණනය කිරීම්, Database එකට save කිරීම්) මෙහි ඇත.
- **Routes**: API endpoints (ලින්ක් එක) මෙහි ඇත. මෙය controller එකේ ඇති logic එක ක්‍රියාත්මක කරයි.

**අලුත් Endpoint එකක් හදන පිළිවෙල:**
1. `models/` හි schema එක හදන්න.
2. `controllers/` හි අදාළ function එක ලියන්න.
3. `routes/` හි එම function එක endpoint එකකට සම්බන්ධ කරන්න.

---

## 3. Frontend Architecture (Shared Constants)
අපි `frontend/constants/api.ts` එක භාවිතා කරමින් local සහ online server දෙක අතර මාරු වීම ස්වයංක්‍රීයව සිදු කරමු.

- **`__DEV__`**: ඔයා PC එකේ වැඩ කරන විට මෙය `true` වේ, එවිට local IP එක පාවිච්චි කරයි.
- **`PRODUCTION_URL`**: App එක publish කළ පසු Render URL එක පාවිච්චි කරයි. (මෙය දැන් `frontend/.env` file එක හරහා වඩාත් ආරක්ෂිතව සිදු කෙරේ).

---

## 4. Environment Variables & Security
රහස්‍ය දත්ත (Secrets) GitHub එකට යැවීම වැළැක්වීමට අපි `.env` files භාවිතා කරමු.
- **Backend**: `MONGO_URI` වැනි දත්ත `backend/.env` හි ඇත.
- **Frontend**: `EXPO_PUBLIC_PRODUCTION_URL` වැනි දත්ත `frontend/.env` හි ඇත.
**සටහන:** මෙම `.env` files සැමවිටම `.gitignore` හි තිබිය යුතුය.

---

## 5. Git & Branching Strategy
වැඩ කරන විට වැරදීම් අවම කිරීමට branches භාවිතා කළ යුතුය.

1. **Master-Update**: මෙය සැමවිටම "Stable" code එක තබා ගන්නා branch එකයි.
2. **Feature Branches** (උදා: `feature/service-management`): අලුත් වැඩක් කරන විට මේ වගේ branch එකක් හදාගෙන වැඩ කරන්න.
   ```powershell
   git checkout -b feature/new-task
   ```
3. **Syncing**: Master එකේ අලුත් updates ආවොත් ඒවා ඔයාගේ branch එකට ගන්න:
   ```powershell
   git fetch origin
   git merge origin/Master-Update
   ```

---

## 5. Deployment Workflow (Update කරන හැටි)

ඔයා අලුත් update එකක් දාන විට අනුගමනය කළ යුතු සම්පූර්ණ චක්‍රය:

### පියවර 1: Local Development & Testing
- `./start.bat` run කරන්න.
- Code එක වෙනස් කරන්න.
- Phone එකේ Expo Go මගින් පරීක්ෂා කරන්න.

### පියවර 2: Backend Update (Render)
- Backend code එක GitHub එකට push කරන්න.
- Render Dashboard එකෙන් deployment එක සාර්ථකදැයි බලන්න.
- URL එක බ්‍රවුසරයේ දමා API එක පරීක්ෂා කරන්න.

### පියවර 3: Frontend Update (EAS)
- **UI Updates සඳහා**: `eas update --branch production` (මෙය වේගවත්ය).
- **ලොකු වෙනස්කම් සඳහා**: `eas build -p android --profile preview` (අලුත් APK එකක් ලැබේ).

---

## 6. අලුතින්ම Setup කරන හැටි (Cheat Sheet)
1. Repo එක Clone කරන්න: `git clone <url>`
2. Backend setup: `cd backend && npm install`
3. Frontend setup: `cd frontend && npm install`
4. Global setup: `npm install -g eas-cli`
5. App එක පණගැන්වීමට: `./start.bat` (Root එකේ සිට)

---
© 2024 MotoHub Engineering Guide
