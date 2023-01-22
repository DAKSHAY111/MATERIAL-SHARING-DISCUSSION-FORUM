import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/",
  }),
  endpoints: (builder) => ({
    signUpUser: builder.mutation({
      query: (user) => ({
        url: "/user/signup",
        method: "POST",
        body: user,
      }),
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: "/user/login",
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: (data) => ({
        url: "/user/logout",
        method: "POST",
        body: data,
      }),
    }),

    requestNewPassword: builder.mutation({
      query: (data) => ({
        url: "/user/new/password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useSignUpUserMutation,
  useLoginUserMutation,
  useLogoutMutation,
  useRequestNewPasswordMutation,
} = appApi;
export default appApi;
