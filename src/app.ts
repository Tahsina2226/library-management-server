import express from "express";
import cors from "cors";
import bookRoutes from "./routes/bookroutes";
import borrowRoutes from "./routes/borrow.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Library Management API is running");
});

app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

export default app;
