const express = require("express");
const router = express.Router();

const Consultation = require("../models/consultation");
const Patient = require("../models/patient");
// Gestion des erreurs
function handleError(res, err) {
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({
      message: err.message
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Erreur serveur"
  });
}

// POST : créer une consultation
router.post("/", async (req, res) => {
  try {
    // Vérifier que le patient existe
    const patientExiste = await Patient.exists({
      _id: req.body.patient
    });

    if (!patientExiste) {
      return res.status(404).json({
        message: "Patient introuvable"
      });
    }

    // Créer la consultation
    const consultation = await Consultation.create(req.body);

    return res.status(201).json(consultation);

  } catch (err) {
    handleError(res, err);
  }
});

// GET : récupérer les consultations avec filtres et tri
router.get("/", async (req, res) => {
  try {
    const filtre = {};

    // Filtrer par patient
    if (req.query.patient) {
      filtre.patient = req.query.patient;
    }

    // Filtrer par statut
    if (req.query.statut) {
      filtre.statut = req.query.statut;
    }

    const consultations = await Consultation.find(filtre)
      .populate("patient", "nom prenom")
      .sort({ date: -1 });

    res.json(consultations);
  } catch (err) {
    handleError(res, err);
  }
});

// GET : récupérer une consultation par ID
router.get("/:id", async (req, res) => {
  try {
const consultation = await Consultation.findById(req.params.id)
  .populate("patient", "nom prenom");
    if (!consultation) {
      return res.status(404).json({
        message: "Consultation introuvable"
      });
    }

    res.json(consultation);
  } catch (err) {
    handleError(res, err);
  }
});

// PUT : modifier une consultation
router.put("/:id", async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!consultation) {
      return res.status(404).json({
        message: "Consultation introuvable"
      });
    }

    res.json(consultation);
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE : supprimer une consultation
router.delete("/:id", async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(
      req.params.id
    );

    if (!consultation) {
      return res.status(404).json({
        message: "Consultation introuvable"
      });
    }

    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;