import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import hunterRouter from "./modules/hunt-matching/routers/hunter.route.js";
import huntRequestRouter from "./modules/hunt-matching/routers/huntRequest.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/hunters", hunterRouter);
app.use("/api/hunt-requests", huntRequestRouter);

app.get("/", (req, res) => {
  res.send("Ready");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});