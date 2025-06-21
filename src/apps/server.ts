import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT: number = Number(process.env.PORT) || 5000;

let server: ReturnType<typeof app.listen>;

const bootstrap = async () => {
  try {
    server = app.listen(PORT, () => {
      console.log(`library management system is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

bootstrap();
