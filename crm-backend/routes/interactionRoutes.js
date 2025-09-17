import express from "express";
import protect from "../middleware/authMiddleware.js";
// --> FIX: Import the new, clearer function names
import { 
  createInteraction, 
  getInteractionsForCustomer 
} from "../controllers/interactionController.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  // --> FIX: Use the new function names here
  .post(protect, createInteraction)
  .get(protect, getInteractionsForCustomer);

export default router;