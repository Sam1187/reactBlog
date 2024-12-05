import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../axios";

const initialState = {
  data: null,
  status: "loading",
  error: '',
};

export const fetchUser = createAsyncThunk("user/fetchUser", async (params) => {
  return await axios.post(`/auth/login`, params).then((res) => {
    return res.data;
  }).catch((err) => {
    return err.response.data; 
  });
});

export const fetchUserAuth = createAsyncThunk(
  "user/fetchUserAuth",
  async () => {
    return await axios.get(`/auth/me`).then((res) => {
      return res.data;
    });
  }
);

export const fetchRegister = createAsyncThunk(
  "user/fetchRegister",
  async (params) => {
    return await axios.post(`/auth/register`, params).then((res) => {
      return res.data;
    }).catch((err) => {
      return err.response.data;
    });
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Logout the user by clearing the user data.
     * @param {Object} state - The state of the userSlice.
     */
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.error = action.error.message;
      state.status = "error";
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      if (action.payload.token) {
        state.data = action.payload;
        state.status = "success";
        state.error = '';
      } else {
        state.status = "error";
        state.error = action.payload.message;
      }
    });
    builder.addCase(fetchUserAuth.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = "success";
      state.error = '';
    });
    builder.addCase(fetchUserAuth.rejected, (state, action) => {
      state.error = action.error.message;
      state.status = "error";
    });
    builder.addCase(fetchRegister.fulfilled, (state, action) => {
      if (action.payload.token) {
        state.data = action.payload;
        state.status = "success";
        state.error = '';
      } else {
        state.status = "error";
        state.error = action.payload.message;
      }
    });
    builder.addCase(fetchRegister.rejected, (state, action) => {
      state.error = action.error.message;
      state.status = "error";
    });
  },
});

export const selectIsAuth = (state) => Boolean(state.user.data);

export default userSlice.reducer;
export const { logout } = userSlice.actions;
