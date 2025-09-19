import Razorpay from "razorpay";
import { Course } from "../models/course.model";
import { CoursePurchase } from "../models/coursePurchase.model";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newPurchase = new CoursePurchase({
      course: courseId,
      user: userId,
      amount: course.price,
      status: "PENDING",
    });

    const options = {
      amount: course.price * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `course_${courseId}`,
      notes: {
        courseId: courseId,
        userId: userId,
      },
    };

    const order = await razorpay.orders.create(options);
    newPurchase.paymentId = order.id;
    await newPurchase.save();

    res.status(201).json({
      message: "Razorpay order created",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      coursePurchaseId: newPurchase._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isAuthentic = generated_signature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const coursePurchase = await CoursePurchase.findOne({
      paymentId: razorpay_order_id,
    });

    if (!coursePurchase) {
      return res.status(404).json({ message: "Course purchase not found" });
    }

    coursePurchase.status = "COMPLETED";
    await coursePurchase.save();

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
