import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.loading = false;
    },
    loginFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
});

export const { setLoading, loginSuccess, loginFailure, setUser, logout } =
  authSlice.actions;
export default authSlice.reducer;
