import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Customer from "../models/customer.js";
import Interaction from "../models/Interaction.js";

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(customer);
});

// @desc    Get all customers for the logged-in user
// @route   GET /api/customers
// @access  Private
export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ createdBy: req.user._id });
  res.status(200).json(customers);
});

// @desc    Get a single customer by ID
// @route   GET /api/customers/:id
// @access  Private
export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  // CRITICAL: Add security check to ensure the customer belongs to the user
  if (customer && customer.createdBy.toString() === req.user._id.toString()) {
    res.status(200).json(customer);
  } else {
    res.status(404);
    throw new Error('Customer not found');
  }
});

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.id;

  // 1. Validate the ID format is correct
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    res.status(400);
    throw new Error('Invalid customer ID');
  }

  // 2. Find the customer by its ID
  const customer = await Customer.findById(customerId);

  // 3. IMPORTANT: Check if the customer exists AND belongs to the logged-in user
  if (!customer || customer.createdBy.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // 4. If checks pass, update the fields from the request body
  customer.name = req.body.name || customer.name;
  customer.email = req.body.email || customer.email;
  customer.phone = req.body.phone || customer.phone;
  customer.company = req.body.company || customer.company;
  customer.status = req.body.status || customer.status;

  // 5. Save the updated document back to the database
  const updatedCustomer = await customer.save();

  res.status(200).json(updatedCustomer);
});

// @desc    Delete a customer and their interactions
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.id;

  // 1. Find the customer to make sure it exists and belongs to the user
  const customer = await Customer.findById(customerId);

  if (!customer || customer.createdBy.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // 2. Delete all interactions associated with this customer
  await Interaction.deleteMany({ customerId: customerId });

  // 3. Delete the customer itself
  await Customer.findByIdAndDelete(customerId);

  res.status(200).json({ message: "Customer and associated interactions removed" });
});