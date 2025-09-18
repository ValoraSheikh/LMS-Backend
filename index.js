import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import cors from 'cors';
import xssClean from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import router from './routes/health.route.js';

dotenv.config()
const app = express();
const PORT = process.env.PORT;

//Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  message: "Too many request from this IP, please try again",
})

// Security Middleware
app.use("/api", limiter);
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(hpp());
app.use(xssClean());


if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}

// Body parser midlleware
app.use(express.json({ limit: "10kb"}));
app.use(express.urlencoded({ extended: true, limit: "10kb"}))
app.use(cookieParser());

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    status: "error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
  
})

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "User-Agent",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials"
  ]
}));

// API routes
app.use("/health", router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not here baccha !!"
  })
})

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT} in ${process.env.NODE_ENV}`);
})

