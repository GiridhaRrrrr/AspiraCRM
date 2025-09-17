import asyncHandler from 'express-async-handler';
import Interaction from "../models/Interaction.js";
import Customer from "../models/customer.js";
import mongoose from 'mongoose';

// @desc    Create a new interaction for a customer
// @route   POST /api/customers/:customerId/interactions
// @access  Private
export const createInteraction = asyncHandler(async (req, res) => {
  const { id: customerId } = req.params;
  const { type, note, date } = req.body;

  // Security Check: Ensure the customer exists and belongs to the user
  const customer = await Customer.findById(customerId);
  if (!customer || customer.createdBy.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Customer not found");
  }

  // Validation
  if (!type || !note || !date) {
    res.status(400);
    throw new Error('Please provide type, note, and date.');
  }

  const interaction = await Interaction.create({
    customerId,
    type,
    note,
    date: new Date(date), // Ensure date is a Date object
    createdBy: req.user._id,
  });

  res.status(201).json(interaction);
});

// @desc    Get all interactions for a specific customer
// @route   GET /api/customers/:customerId/interactions
// @access  Private
export const getInteractionsForCustomer = asyncHandler(async (req, res) => {
  const { id: customerId } = req.params;

  // Security Check: Ensure the customer belongs to the user
  const customer = await Customer.findById(customerId);
  if (!customer || customer.createdBy.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Customer not found");
  }

  // Find interactions for that customer, sorted by most recent
  const interactions = await Interaction.find({ customerId: customerId }).sort({ date: -1 });
  res.status(200).json(interactions);
});


// @desc    Update a specific interaction
// @route   PUT /api/interactions/:interactionId
// @access  Private
export const updateInteraction = asyncHandler(async (req, res) => {
  const interaction = await Interaction.findById(req.params.interactionId);

  // Security check: Ensure the interaction exists and belongs to the logged-in user
  if (!interaction || interaction.createdBy.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Interaction not found");
  }
  
  interaction.type = req.body.type || interaction.type;
  interaction.note = req.body.note || interaction.note;
  interaction.date = req.body.date ? new Date(req.body.date) : interaction.date;

  const updatedInteraction = await interaction.save();
  res.status(200).json(updatedInteraction);
});


// @desc    Delete a specific interaction
// @route   DELETE /api/interactions/:interactionId
// @access  Private
export const deleteInteraction = asyncHandler(async (req, res) => {
  const interaction = await Interaction.findById(req.params.interactionId);

  // Security check: Ensure the interaction exists and belongs to the logged-in user
  if (!interaction || interaction.createdBy.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Interaction not found");
  }

  await Interaction.deleteOne({ _id: req.params.interactionId });
  res.status(200).json({ message: "Interaction removed" });
});