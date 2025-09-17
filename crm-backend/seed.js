import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from 'bcryptjs'; // <-- Import bcrypt
import Customer from "./models/customer.js";
import User from "./models/user.js";
import Interaction from "./models/Interaction.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    // Clear existing data
    await Customer.deleteMany();
    await User.deleteMany();
    await Interaction.deleteMany();

    // --> FIX: Hash the password before creating the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Insert mock user
    const user = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword, // Store the hashed password
    });

    // --> FIX: Add 'createdBy' to each customer
    const customersToCreate = [
      { name: "Alice Johnson", email: "alice@company.com", phone: "9876543210", company: "TechCorp", status: "customer", createdBy: user._id },
      { name: "Bob Smith", email: "bob@business.com", phone: "9123456780", company: "BizGroup", status: "lead", createdBy: user._id },
    ];

    const customers = await Customer.insertMany(customersToCreate);

    // --> FIX: Add 'createdBy' to each interaction
    const interactionsToCreate = [
      { customerId: customers[0]._id, type: "email", note: "Sent onboarding email", date: new Date(), createdBy: user._id },
      { customerId: customers[1]._id, type: "call", note: "Follow-up call scheduled", date: new Date(new Date().setDate(new Date().getDate() - 4)), createdBy: user._id },
    ];
    
    await Interaction.insertMany(interactionsToCreate);

    console.log("✅ Mock data inserted successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedData();