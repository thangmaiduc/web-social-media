import postApi from '../../api/postApi';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
//  Thunk API
export const getNotification = createAsyncThunk(
  'notification/get',
  async (params, thunkAPI) => {
    const response = await postApi.getNotify();
    return response;
  }
);
export const viewNotification = createAsyncThunk(
  'notification/view',
  async (params, thunkAPI) => {
    const response = await postApi.viewNotify();
    return response;
  }
);

// ---------------------
//      MAIN SLICE
// ---------------------
const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    items: [],
    isFetching: false,
  },
  reducers: {
    receiveNotification: (state, action) => {
      const index = state.items.findIndex(
        (item) =>
          item.type === action.payload.type &&
          item.subjectId === action.payload.subjectId
      );
      if (index >= 0) state.items.splice(index, 1);
      state.items = [action.payload, ...state.items];
    },
  },
  extraReducers: {
    [getNotification.pending]: (state, action) => {
      state.isFetching = true;
    },
    [getNotification.rejected]: (state, action) => {
      state.isFetching = false;
    },
    [getNotification.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.isFetching = false;
    },
    [viewNotification.fulfilled]: (state, action) => {
      state.items = state.items.map((item) => {
        return {
          ...item,
          isView: true,
        };
      });
      state.isFetching = false;
    },
  },
});

// selector
export const notificationSelector = (state) => state?.notification?.items;
export const amountNotificationSelector = (state) =>
  state.notification.items.reduce((acc, item) => {
    if (!item.isView) return acc + 1;
    return acc;
  }, 0);
export const fetchSelector = (state) => state.notification.isFetching;

export default notificationSlice;
