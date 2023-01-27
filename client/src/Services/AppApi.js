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

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/user/reset/password",
        method: "POST",
        body: data,
      }),
    }),

    fetchTags: builder.mutation({
      query: () => ({
        url: "/tags",
        method: "GET",
      }),
    }),

  }),
});

export const {
  useSignUpUserMutation,
  useLoginUserMutation,
  useLogoutMutation,
  useRequestNewPasswordMutation,
  useResetPasswordMutation,
  useFetchTagsMutation,
} = appApi;
export default appApi;
