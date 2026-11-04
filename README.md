# Chess Coach Frontend (React + Vite + Tailwind)

Modern Chess.com match review and evaluator UI powered by Stockfish.

## 🚀 Deploying to Vercel

### Steps:
1. Push this repository to GitHub (e.g. `your-username/chess-coach-frontend`).
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your GitHub repository `chess-coach-frontend`.
4. Framework Preset will be automatically detected as **Vite**.
5. Add an **Environment Variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL (e.g. `https://chess-coach-backend.onrender.com`)
6. Click **Deploy**.

Vercel will build and assign you a free production domain (e.g. `https://chess-coach.vercel.app`)!

---

## 💻 Local Development

```bash
npm install
npm run dev
```

Runs on [http://localhost:5173](http://localhost:5173).
By default, the Vite dev server proxies `/api` requests to `http://127.0.0.1:8000` (your local backend).
To point local frontend to your deployed Render backend instead, create a `.env.local` file:
```env
VITE_API_URL=https://chess-coach-backend.onrender.com
```
