import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema({
  course:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount:{
    type: Number,
    required: true,
    min: 0
  },
  currency:{
    type: String,
    required: true,
    enum: ["USD", "INR", "EUR"]
  },
  status:{
    type: String,
    required: true,
    enum: {
      values: ["PENDING", "COMPLETED", "FAILED"],
      message: "Status is either: PENDING, COMPLETED, FAILED"
    }, default: "PENDING"
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  refundId: {
    type: String,
  },
  refundAmount: {
    type: Number,
    min: 0,
  },
  refundReason: {
    type: String,
  },
  metadata: {
    type: Map,
    of: String,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

coursePurchaseSchema.index({ course: 1, user: 1 });
coursePurchaseSchema.index({status: 1});
coursePurchaseSchema.index({createdAt: -1});

coursePurchaseSchema.virtual("isRefundable").get(function(){
  if (this.status !== "COMPLETED") return false;
  const refundPeriodDays = 30;
  const refundPeriodMs = refundPeriodDays * 24 * 60 * 60 * 1000;
  const timeSincePurchase = Date.now() - this.createdAt.getTime();
  return timeSincePurchase <= refundPeriodMs;
})

coursePurchaseSchema.methods.processRefund = async function(refundAmount, refundReason){
  this.status = "REFUNDED";
  this.refundAmount = refundAmount;
  this.refundReason = refundReason;
  if(this.status !== "COMPLETED"){
    throw new Error("Only completed purchases can be refunded.");
  }
  return this.save();
}

export const CoursePurchase = mongoose.model("CoursePurchase", coursePurchaseSchema);