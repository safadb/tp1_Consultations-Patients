require("dotenv").config({ quiet: true });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/cabinet";

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

//routes des patients
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/consultations", require("./routes/consultationRoutes"));
app.use((req, res) => {
  res.status(404).json({
    message: "Route introuvable"
  });
});
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "JSON invalide"
    });
  }

  console.error(err);

  res.status(500).json({
    message: "Erreur serveur"
  });
});
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connecté à MongoDB");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Serveur lancé sur http://localhost:${PORT}`
      );
    });
  })
  .catch(err => {
    console.error("Erreur MongoDB :", err.message);
    process.exit(1);
  });