import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  type: { type: String, enum: ['Call', 'Email', 'Meeting', 'Note', 'call', 'email', 'meeting', 'note'], required: true },
  description: String,
   date: {
    type: Date,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
   timestamps: true,
   toJSON: { virtuals: true },
  toObject: { virtuals: true },

 });

 interactionSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

export default mongoose.model("Interaction", interactionSchema);
