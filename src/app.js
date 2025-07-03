"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bookroutes_1 = __importDefault(require("./routes/bookroutes"));
const borrow_routes_1 = __importDefault(require("./routes/borrow.routes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: "https://librarymanagement-gilt.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Library Management API is running");
});
app.use("/api/books", bookroutes_1.default);
app.use("/api/borrow", borrow_routes_1.default);
exports.default = app;
