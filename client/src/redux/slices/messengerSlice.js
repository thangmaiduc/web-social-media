import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import conversationApi from '../../api/conversationApi';
//  Thunk API
export const getConversations = createAsyncThunk(
  'messenger/get',
  async (params, thunkAPI) => {
    const response = await conversationApi.getOfUser();
    return response;
  }
);
export const viewMessenger = createAsyncThunk(
  'messenger/view',
  async (params, thunkAPI) => {
    const response = await conversationApi.viewMessenger();
    return response;
  }
);

// ---------------------
//      MAIN SLICE
// ---------------------
const messengerSlice = createSlice({
  name: 'messenger',
  initialState: {
    items: [],
    isFetching: false,
  },
  reducers: {
    updateLatestMessage: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      const conversation = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (index >= 0) state.items.splice(index, 1);
      state.items = [
        {
          ...conversation,
          ...action.payload,
        },
        ...state.items,
      ];
    },
    // receiveNotification: (state, action) => {
    //   const index = state.items.findIndex(
    //     (item) =>
    //       item.type === action.payload.type &&
    //       item.subjectId === action.payload.subjectId
    //   );
    //   if (index >= 0) state.items.splice(index, 1);
    //   state.items = [action.payload, ...state.items];
    // },
  },
  extraReducers: {
    [getConversations.pending]: (state, action) => {
      state.isFetching = true;
    },
    [getConversations.rejected]: (state, action) => {
      state.isFetching = false;
    },
    [getConversations.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.isFetching = false;
    },
    [viewMessenger.fulfilled]: (state, action) => {
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
export const messengerSelector = (state) => state?.messenger?.items;
export const amountConversationSelector = (state) =>
  state.messenger.items.reduce((acc, item) => {
    if (!item.isView) return acc + 1;
    return acc;
  }, 0);
export const fetchSelector = (state) => state.messenger.isFetching;

export default messengerSlice;
