import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import interactionRoutes from "./routes/interactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("AspiraCRM API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
// app.use("/api/interactions", interactionRoutes);
app.use('/api/dashboard', dashboardRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
