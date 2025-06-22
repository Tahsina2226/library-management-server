import mongoose from "mongoose";
import { Server } from "http";
import dotenv from "dotenv";
import path from "path";
import app from "../apps/app";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const port = process.env.PORT || 5000;
let server: Server;

const uri = `mongodb+srv://${encodeURIComponent(
  process.env.DB_USER as string
)}:${encodeURIComponent(
  process.env.DB_PASS as string
)}@cluster0.1jen4.mongodb.net/libraryDB?retryWrites=true&w=majority&appName=Cluster0`;

async function main() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas");

    server = app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

main();
