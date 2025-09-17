import asyncHandler from 'express-async-handler';
import Customer from "../models/customer.js";
import Interaction from "../models/Interaction.js";


export const getDashboardSummary = asyncHandler(async (req, res) => {
  // Use Promise.all to run all database queries in parallel for better performance
  const [
    totalCustomers,
    totalLeads,
    convertedCustomers,
    pendingFollowUps,
  ] = await Promise.all([
    // 1. Get the total count of all customers
    Customer.countDocuments({ createdBy: req.user._id }),

    // 2. Get the count of customers with 'lead' status
    Customer.countDocuments({ status: 'lead', createdBy: req.user._id }),

    // 3. Get the count of customers with 'customer' status
    Customer.countDocuments({ status: 'customer', createdBy: req.user._id }),

    // 4. Get the count of interactions that are 3 or more days old
    Interaction.countDocuments({
      createdBy: req.user._id,
      date: { $lte: new Date(new Date().setDate(new Date().getDate() - 3)) },
    }),
  ]);

  // Send the aggregated data as a JSON response
  res.status(200).json({
    totalCustomers,
    totalLeads,
    convertedCustomers,
    pendingFollowUps,
  });
});

