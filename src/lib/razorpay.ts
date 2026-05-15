import Razorpay from "razorpay";
import env from "../config/env";

let _razorpay: Razorpay | null = null;

export const getRazorpay = (): Razorpay => {
  if (!_razorpay) {
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw new Error(
        "Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file."
      );
    }
    _razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
};
