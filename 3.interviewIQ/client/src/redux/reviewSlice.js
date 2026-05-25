
import { createSlice } from "@reduxjs/toolkit";

// 1. جلب التقييمات المخزنة سابقاً في المتصفح (إذا وُجدت)
const savedReviews = localStorage.getItem("reviews");
const initialState = {
  // إذا كانت هناك تقييمات مخزنة نحولها لمصفوفة، وإذا لم توجد نضع تقييمات افتراضية كبداية
  reviews: savedReviews ? JSON.parse(savedReviews) : [
    {
      name: "Alex Johnson",
      role: "Frontend Developer",
      text: "The technical interview mode felt exactly like my real interview at Google. Highly recommended!",
      rating: 5
    },
    {
      name: "Sarah Amine",
      role: "Full-Stack Developer",
      text: "The AI feedback on my confidence level completely changed how I deliver my answers.",
      rating: 4
    }
  ]
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    // 2. دالة إضافة تقييم جديد
    addReview: (state, action) => {
      // نضع التقييم الجديد في أول المصفوفة ليظهر أولاً في الصفحة الرئيسية
      state.reviews.unshift(action.payload);
      // حفظ المصفوفة الجديدة في الـ LocalStorage ليتم حفظها بشكل دائم
      localStorage.setItem("reviews", JSON.stringify(state.reviews));
    }
  }
});

export const { addReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;