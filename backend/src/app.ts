import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

sequelize.sync().then(() => {
  console.log("Database connected");
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});
