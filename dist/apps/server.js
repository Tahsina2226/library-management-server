"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const port = 5000;
let server;
const user = "library22";
const pass = "library22_system";
const uri = `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@cluster0.1jen4.mongodb.net/libraryDB?retryWrites=true&w=majority&appName=Cluster0`;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(uri);
            console.log("✅ Connected to MongoDB Atlas");
            server = app_1.default.listen(port, () => {
                console.log(` library management is running at http://localhost:${port}`);
            });
        }
        catch (error) {
            console.error("MongoDB connection failed:", error);
            process.exit(1);
        }
    });
}
main();
