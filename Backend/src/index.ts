import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"
import authRouter from "./routes/auth.route.js";
import mutantHuntingRequestRouter from "./modules/MutantHuntingRequestSystem/routes/MutantHuntingRequestSystem.routes.js";
import mapRoutes from "./routes/map.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"))

app.use("/api/auth", authRouter);
app.use("/api", mutantHuntingRequestRouter);
app.use("/api/map", mapRoutes);

app.get("/", (req, res) => {
  res.send("Ready");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
