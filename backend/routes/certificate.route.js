import express from "express";
import { generateAndSendCertificate, getCertificateStatus } from "../controllers/certificate.controller.js";
const router = express.Router();
// POST: Generate & send certificate
router.post("/generate-certificate", generateAndSendCertificate);
// GET: Check if certificate already sent
router.get("/status/:email", getCertificateStatus);
export default router;
