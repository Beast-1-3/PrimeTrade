import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import todoRoute from "./routes/todo.route.js";
import userRoute from "./routes/user.route.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const app = express();
app.set("trust proxy", 1); // Trust Render proxy for secure cookies
dotenv.config();

// port
const port = process.env.PORT || 4002;
app.listen(port, () => {
  console.log(`server up on ${port}`);
});

// Assert critical environment variables
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("CRITICAL: MONGODB_URI and JWT_SECRET must be set in the environment.");
  process.exit(1);
}

// database connection
const DB_URI = process.env.MONGODB_URI;
try {
  await mongoose.connect(DB_URI);
  console.log(`Connected to MongoDB`);
} catch (error) {
  console.log(error);
}

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigin = process.env.ALLOWED_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5173";

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin matches expected patterns
    if (origin === allowedOrigin ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin.endsWith(".onrender.com")) {
      return callback(null, true);
    }

    // If not matching, reject the CORS request
    return callback(new Error("The CORS policy for this site does not allow access from the specified Origin."), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(helmet({
  crossOriginResourcePolicy: false
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});
app.use("/user/sign-in", limiter); // Apply rate limiting to login
app.use("/user/sign-up", limiter); // Apply rate limiting to register

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/todo", todoRoute);
app.use("/user", userRoute);

app.get(`/`, (req, res) => {
  res.send(`TODO App`);
})
