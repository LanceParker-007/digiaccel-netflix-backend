import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

const app = express();

const corsOptions = {
  origin: "*",
  methods: "*",
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/user", userRouter);

export default app;
