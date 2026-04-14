import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  doctors: [
    { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology", rating: 4.9 },
    { id: 2, name: "Dr. Michael Chen", specialty: "Neurology", rating: 4.8 },
    {
      id: 3,
      name: "Dr. Emily Williams",
      specialty: "General Surgery",
      rating: 4.9,
    },
  ],
};

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    addDoctor(state, action) {
      state.doctors.push(action.payload);
    },
    removeDoctor(state, action) {
      state.doctors = state.doctors.filter((d) => d.id !== action.payload);
    },
  },
});

export const { addDoctor, removeDoctor } = doctorsSlice.actions;
export default doctorsSlice.reducer;
