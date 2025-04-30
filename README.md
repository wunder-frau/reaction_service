````markdown
# 🧡 Reactions App

A React Native + Expo app for adding emoji reactions with animated feedback.

---

## 🚀 Getting Started

### 0. ⚙️ Backend Setup (Optional)

Before proceeding, run the Docker container for the reaction service.

### 1. Install dependencies

```bash
npm install
```
````

### 2. Start the development server

```bash
npm start
```

- This will launch **Expo Dev Tools** and show a **QR code** in the terminal.
- You can see the QR code with the **Expo Go** app on your mobile device to view the app.

✅ **Expo Go** is available on the **App Store** and **Google Play**.

---

## 💻 Run on Specific Platforms

- Android Emulator:

  ```bash
  npm run android
  ```

- iOS Simulator:

  ```bash
  npm run ios
  ```

- Web Browser:
  ```bash
  npm run web
  ```

---

## 🔄 Update API Base URL

After scanning the QR code:

1. Copy the IP address (under QR code) from the terminal (e.g., `exp://192.168.x.xxx:8081`)
2. Open `src/api/reactions.ts`
3. Replace `baseURL` with your local IP:

```ts
const api = axios.create({
  baseURL: "http://192.168.x.xxx:3000", // 👈 your machine's IP address
});
```

---

## 🧪 Run Tests

```bash
npm test
```

---

## ✅ Code Quality

Run ESLint to check for lint issues:

```bash
npm run lint
```

---

## 🔧 Tech Stack

- React Native + Expo
- TypeScript
- React Query
- Axios
- Reanimated 3
- Jest + Testing Library

---

Happy coding! ✨
