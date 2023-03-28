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

    createPost: builder.mutation({
      query: (data) => ({
        url: "/post/create",
        method: "post",
        body: data,
      }),
    }),

    fetchAllPosts: builder.mutation({
      query: (data) => ({
        url: "/post/fetch/all",
        method: "post",
        body: data,
      }),
    }),

    fetchPostWithOptions: builder.mutation({
      query: (data) => ({
        url: "/post/fetch/options",
        method: "post",
        body: data,
      }),
    }),

    addPostToFavourites: builder.mutation({
      query: (data) => ({
        url: "/user/add/starred",
        method: "post",
        body: data,
      }),
    }),

    fetchStarred: builder.mutation({
      query: (data) => ({
        url: "/user/fetch/favourites",
        method: "post",
        body: data,
      }),
    }),

    addVote: builder.mutation({
      query: (data) => ({
        url: "/post/vote",
        method: "post",
        body: data,
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      }),
    }),

    fetchUserData: builder.mutation({
      query: (data) => ({
        url: "/user/fetch/data",
        method: "post",
        body: data,
      }),
    }),

    fetchAllDoubts: builder.mutation({
      query: () => ({
        url: "/doubts/fetch/all",
        method: "get",
      }),
    }),

    createDoubt: builder.mutation({
      query: (data) => ({
        url: "/doubts/create",
        method: "post",
        body: data,
      }),
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/user/update/profile",
        method: "post",
        body: data,
      }),
    }),

    fetchSingleDoubt: builder.mutation({
      query: (data) => ({
        url: "/doubts/fetch/doubt",
        method: "post",
        body: data,
      }),
    }),

    addVoteToDoubt: builder.mutation({
      query: (data) => ({
        url: "/doubts/vote",
        method: "post",
        body: data,
      }),
    }),

    addReplyToDoubt: builder.mutation({
      query: (data) => ({
        url: "/doubts/create/reply",
        method: "post",
        body: data,
      }),
    }),

    addVoteToReply: builder.mutation({
      query: (data) => ({
        url: "/doubts/vote/reply",
        method: "post",
        body: data,
      }),
    }),

    sortReplies: builder.mutation({
      query: (data) => ({
        url: "/doubts/sort/reply",
        method: "post",
        body: data,
      }),
    }),

    deleteDoubt: builder.mutation({
      query: (data) => ({
        url: "/doubts/delete",
        method: "post",
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
  useResetPasswordMutation,
  useFetchTagsMutation,
  useCreatePostMutation,
  useFetchAllPostsMutation,
  useFetchPostWithOptionsMutation,
  useAddPostToFavouritesMutation,
  useFetchStarredMutation,
  useAddVoteMutation,
  useFetchUserDataMutation,
  useFetchAllDoubtsMutation,
  useCreateDoubtMutation,
  useUpdateUserProfileMutation,
  useFetchSingleDoubtMutation,
  useAddVoteToDoubtMutation,
  useAddReplyToDoubtMutation,
  useAddVoteToReplyMutation,
  useSortRepliesMutation,
  useDeleteDoubtMutation,
} = appApi;
export default appApi;
