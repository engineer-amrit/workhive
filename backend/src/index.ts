import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from "./config/db.js";
import os from 'os';
import router from "./routers/index.js";
import errorMiddleware from "./middleware/error-middleware.js";
import cors from "cors"
import config from "./config/config.js";


const app = express();

app.use(cors(
  {
    origin: [
      config.CLIENT_URL,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    credentials: true,
    optionsSuccessStatus: 204,
  }
));

app.set('trust proxy', 1); // or 'loopback', or true




// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.disable('x-powered-by');


// Global Middlewares
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// all routers
app.use(router);


// error handling middleware
app.use(errorMiddleware);

// Connect to Database & Start Server

await connectDB()
  .then(() => {
    app.listen(config.PORT, config.HOST, () => {
      if (config.HOST != 'localhost') {
        const interfaces = os.networkInterfaces();

        for (const name of Object.keys(interfaces)) {
          for (const net of interfaces[name] || []) {
            // Skip internal (i.e., 127.0.0.1) and non-IPv4 addresses
            if (net.family === 'IPv4' && !net.internal) {
              console.log(`Server is running at http://${net.address}:${config.PORT}`);

            }
          }

        }
      }
      console.log(`Server is running at http://localhost:${config.PORT}`);
      console.log("[DEBUG] Server running under PID:", process.pid);
    });
  })
