// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import authRoute from './Routes/auth.js';
// import userRoute from "./Routes/user.js";
// import doctorRoute from "./Routes/doctor.js";
// import reviewRoute from "./Routes/review.js";

// dotenv.config();
// const app = express();
// const port = process.env.PORT || 8000;

// const corsOptions = {
//   origin: true, // Allow all origins for development, refine for production
// };

// app.get("/", (req, res) => {
//   res.send("API is Working");
// });

// // Database connection
// mongoose.set('strictQuery', false); // Disable strict mode if needed
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB database is connected');
//   } catch (err) {
//     console.error('MongoDB connection error:', err.message);
//     process.exit(1); // Exit with failure code
//   }
// };

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors(corsOptions));

// // Routes
// app.use('/api/v1/auth', authRoute); // Example: domain/api/version1/auth/register
// app.use('/api/v1/users', userRoute);
// app.use('/api/v1/doctors', doctorRoute);
// app.use('/api/v1/reviews', reviewRoute);

// // Global error handler middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack); // Log the stack trace for debugging
//   res.status(500).json({ success: false, message: "Internal Server Error" });
// });

// // Start server and connect to database
// app.listen(port, () => {
//   connectDB();
//   console.log(`Server is running on port ${port}`);
// });


// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import authRoute from './Routes/auth.js';
// import userRoute from "./Routes/user.js";
// import doctorRoute from "./Routes/doctor.js";
// import reviewRoute from "./Routes/review.js";

// dotenv.config();
// const app = express();
// const port = process.env.PORT || 8000;

// const corsOptions = {
//   origin: true, // Allow all origins for development, refine for production
// };

// app.get("/", (req, res) => {
//   res.send("API is Working");
// });

// // Database connection
// mongoose.set('strictQuery', false); // Disable strict mode if needed
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB database is connected');
//   } catch (err) {
//     console.error('MongoDB connection error:', err.message);
//     process.exit(1); // Exit with failure code
//   }
// };

// // Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors(corsOptions));

// // Routes
// app.use('/api/v1/auth', authRoute); // Example: domain/api/version1/auth/register
// app.use('/api/v1/users', userRoute);
// app.use('/api/v1/doctors', doctorRoute);
// app.use('/api/v1/reviews', reviewRoute);

// // Global error handler middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack); // Log the stack trace for debugging
//   res.status(500).json({ success: false, message: "Internal Server Error" });
// });

// // Create an HTTP server
// const server = http.createServer(app);

// // Integrate socket.io
// export const io = new Server(server, {
//   cors: {
//     origin: "*", // Allow all origins for WebSocket connections
//     methods: ["GET", "POST"]
//   }
// });

// io.on('connection', (socket) => {
//   console.log('New client connected');

//   // Example: Broadcasting messages to all clients
//   socket.on('dataChanged', (data) => {
//     io.emit('updateData', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// // Start server and connect to database
// server.listen(port, () => {
//   connectDB();
//   console.log(`Server is running on port ${port}`);
// });


import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from './Routes/auth.js';
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRoute from "./Routes/review.js";
import bookingRoute from "./Routes/booking.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: true, // Allow all origins for development, refine for production
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Create an HTTP server
const server = http.createServer(app);

// Integrate socket.io
export const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for WebSocket connections
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Database connection
mongoose.set('strictQuery', false); // Disable strict mode if needed
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB database is connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit with failure code
  }
};

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/doctors', doctorRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings',bookingRoute);

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the stack trace for debugging
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Root route
app.get("/", (req, res) => {
  res.send("API is Working");
});

// Start server and connect to database
server.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});

