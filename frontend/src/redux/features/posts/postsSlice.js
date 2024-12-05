import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../axios";

const initialState = {
  posts: [],
  total: 0,
  status: "idle",
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 1, limit = 10 } = {}) => {
    const { data } = await axios.get(`/posts?page=${page}&limit=${limit}`);
    return data;
  }
);

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (params) => {
    return await axios.delete(`/posts/${params}`).then((res) => {
      return res.data;
    });
  }
);

const userSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  /**
   * The extraReducers property is used to specify reducers for the fetchPosts and
   * fetchRemovePost actions. The fetchPosts action fetches the posts from the
   * server, and the fetchRemovePost action removes a single post from the Redux
   * store.
   *
   * The fetchPosts action sets the posts, total, and status properties of the
   * state. The fetchRemovePost action removes the post with the given ID from the
   * posts array.
   *
   * @param {Object} builder - The builder object.
   */
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        // Set the posts, total, and status properties of the state to the
        // values returned by the server.
        state.posts = action.payload.posts;
        state.total = action.payload.total;
        state.status = "succeeded";
      })
      .addCase(fetchPosts.pending, (state) => {
        // Set the status property of the state to "loading" when the fetchPosts
        // action is pending.
        state.status = "loading";
      })
      .addCase(fetchPosts.rejected, (state) => {
        // Set the status property of the state to "failed" when the fetchPosts
        // action is rejected.
        state.status = "failed";
      });

    builder.addCase(fetchRemovePost.pending, (state, action) => {
      // Remove the post with the given ID from the posts array when the
      // fetchRemovePost action is pending.
      state.posts = state.posts.filter((post) => post._id !== action.meta.arg);
    });
  },

});

export default userSlice.reducer;
