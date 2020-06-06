import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
import clusterIsMaster from './core/cluster.js'
import express from "express";
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import profileRouter from "./routes/profiles.js";
import authRouter from "./routes/auth.js";
import errorHandler from './middleware/errorHandler.js';

if(!clusterIsMaster) {

const PORT = process.env.PORT || 80;
const app = express();
app.use(express.json());
app.use(cookieParser());

//Protection: NoSQL injection and XSS
app.use([
  mongoSanitize(),
  helmet(),
  xss()
])

// Mounting of routes
app.use("/api/job/profiles", profileRouter);
app.use("/api/job/auth", authRouter);

app.use(errorHandler);

app.listen(
  PORT,
  console.log(`Server run in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.log(`UnhadledRejection: ${err.message}`);
});
process.on('uncaughtException', (err) => {
  console.error(`UncaughtException: ${err.message}`);
  (process.env.NODE_ENV === 'development') ? process.exit(1) : null;
})
}