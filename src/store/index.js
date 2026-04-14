import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import doctorsReducer from "./doctorsSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    ui: uiReducer,
    doctors: doctorsReducer,
    auth: authReducer,
  },
});

export default store;
