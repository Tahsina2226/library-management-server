import express from "express";
import cors from "cors";
import bookRoutes from "./routes/bookroutes";
import borrowRoutes from "./routes/borrow.routes";

const app = express();

const allowedOrigins = [
  "https://library-management-projects.vercel.app",
  "https://librarymanagement-gilt.vercel.app",
  "https://library-management-system-delta-nine.vercel.app",
];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Library Management API is running");
});

app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

export default app;
