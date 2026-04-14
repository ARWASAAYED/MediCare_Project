import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    mobileOpen: false,
  },
  reducers: {
    toggleMobile(state) {
      state.mobileOpen = !state.mobileOpen;
    },
    closeMobile(state) {
      state.mobileOpen = false;
    },
  },
});

export const { toggleMobile, closeMobile } = uiSlice.actions;
export default uiSlice.reducer;
