import express from "express";
import cors from "cors";
import bookRoutes from "../routes/bookroutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);

export default app;
