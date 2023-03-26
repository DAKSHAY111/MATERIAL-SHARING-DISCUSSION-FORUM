import { createSlice } from "@reduxjs/toolkit";
import AppApi from "./appApi";

export const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    logout: (state) => null,
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      AppApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => payload
    );
    builder.addMatcher(
      AppApi.endpoints.logout.matchFulfilled,
      (state, { payload }) => payload
    );
    builder.addMatcher(
      AppApi.endpoints.addPostToFavourites.matchFulfilled,
      (state, {payload}) => payload
    );
    builder.addMatcher(
      AppApi.endpoints.updateUserProfile.matchFulfilled,
      (state, { payload }) => payload
    )
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
