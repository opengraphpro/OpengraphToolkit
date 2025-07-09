import express from "express";
import generateRoute from "./generate";

const router = express.Router();

router.use("/api", generateRoute);

export default router;
