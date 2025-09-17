import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  company: String,
  status: { type: String, enum: ['lead', 'prospect', 'customer'], default: "Lead" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
},
 {  timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
} );

customerSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

export default mongoose.model("Customer", customerSchema);