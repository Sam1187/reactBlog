// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import cors from "cors";

import { handleValidationErrors, checkAuth } from "./utils/index.js";


import { UserControler, PostControler } from "./controlers/index.js";

const connectDB = async () => {
  try {
    // deaktiviert den "strict query"-Modus, was bedeutet,
    //  dass bei der Abfrage von Datenbankdokumenten auch Felder akzeptiert werden,
    //  die nicht im Schema definiert sind
    mongoose.set("strictQuery", false);
    // verbindet sich mit der MongoDB-Datenbank,
    //  wobei die URI aus der Umgebungsvariable MONGODB_URI entnommen wird
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

const app = express();
const PORT = process.env.PORT || 7530;

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// verarbeiten Formulardaten und JSON-Daten.
// app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to DB
connectDB();

app.post("/auth/login", loginValidation, handleValidationErrors, UserControler.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserControler.register);
app.get("/auth/me", checkAuth, UserControler.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts/search", PostControler.search);

app.get("/posts", PostControler.getAll);
app.get("/posts/:id", PostControler.getOne);
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostControler.create);
app.delete("/posts/:id", checkAuth, PostControler.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostControler.update);





// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
