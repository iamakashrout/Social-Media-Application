import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  // user: null,
  // token: null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");  // Clear user from localStorage
      localStorage.removeItem("token"); // Clear token from localStorage
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload.post._id ? action.payload.post : post
      );
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload.postId);
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, removePost } =
  authSlice.actions;
export default authSlice.reducer;
