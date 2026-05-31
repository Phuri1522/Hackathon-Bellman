import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"
import authRouter from "./routes/auth.route.js";
import mutantHuntingRequestRouter from "./modules/MutantHuntingRequestSystem/routes/MutantHuntingRequestSystem.routes.js";
import mapRoutes from "./routes/map.routes.js";
import hunterRouter from "./modules/hunt-matching/routers/hunter.route.js"
import huntRequestRouter from "./modules/hunt-matching/routers/huntRequest.route.js"
import userRouter from "./modules/hunt-matching/routers/user.route.js"
import { authMiddleware } from "./middlewares/auth.js"
import { upload, uploadToCloudinary } from "./middlewares/upload.js"
import { autoMatchPost } from "./modules/hunt-matching/services/huntRequest.service.js"
import { prisma } from "./db.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"))

app.use("/api/auth", authRouter);
app.post("/api/upload/image", upload.single("image"), async (req: any, res: any) => {
  try {
    const buffer = req.file?.buffer
    if (!buffer) return res.status(400).json({ message: "No file uploaded" })
    const url = await uploadToCloudinary(buffer, "mutant-hunter/posts")
    res.json({ url })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})
app.use("/api", mutantHuntingRequestRouter);
app.use("/api/map", mapRoutes);

app.get("/", (_req, res) => {
  res.send("Ready");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// background retry: re-try auto-match every 20s for unmatched MATCHMAKING posts
setInterval(async () => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "MATCHMAKING",
        huntRequests: { none: { status: { in: ["PENDING", "ACCEPTED_BY_USER"] } } },
      },
    })
    for (const post of posts) {
      autoMatchPost(post.id).catch(() => {})
    }
  } catch {}
}, 20000)

app.use("/api/hunters", hunterRouter);
app.use("/api/hunt-requests", huntRequestRouter);
app.use("/api/users", userRouter);