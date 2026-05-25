import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    // الإضافة الجديدة لتحديث الكريديت والترقية فوراً دون الحاجة لعمل Refresh
    updateUserStatus: (state, action) => {
      if (state.userData) {
        state.userData.credits = action.payload.credits;
        state.userData.role = action.payload.role;
      }
    },
  },
});

export const { setUserData, updateUserStatus } = userSlice.actions;

export default userSlice.reducer;