import express from "express";
import protect  from "../middleware/authMiddleware.js";
import { 
  createCustomer, 
  getCustomers, 
  getCustomer, 
  updateCustomer, 
  deleteCustomer 
} from "../controllers/customerController.js";

import interactionRouter from './interactionRoutes.js';

const router = express.Router();

router.route("/")
  .post(protect, createCustomer)
  .get(protect, getCustomers);

router.route("/:id")
  .get(protect, getCustomer)
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

// Use '/:id/interactions' to be consistent with the routes above
router.use('/:id/interactions', interactionRouter);

export default router;