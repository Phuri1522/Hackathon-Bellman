import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mutantHuntingRequestRouter from "./modules/MutantHuntingRequestSystem/routes/MutantHuntingRequestSystem.routes.js";
import authRouter from "./routes/auth.route.js"; // ดึงไฟล์เราเตอร์มา

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api", mutantHuntingRequestRouter);

app.get("/", (req, res) => {
  res.send("Ready");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
