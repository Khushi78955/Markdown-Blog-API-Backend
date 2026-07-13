import express from "express";
import helmet from "helmet";
import cors from "cors"
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Markdown Blog API is running",
    })
})

app.use("/auth", authRoutes);

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
    })
})



app.use(errorHandler)

export default app;