import mongoose from "mongoose";
import { Server } from "http";
import app from "./app";

const port = 5000;
let server: Server;

const user = "library22";
const pass = "library22_system";

const uri = `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(
  pass
)}@cluster0.1jen4.mongodb.net/libraryDB?retryWrites=true&w=majority&appName=Cluster0`;

async function main() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB Atlas");

    server = app.listen(port, () => {
      console.log(` library management is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

main();
