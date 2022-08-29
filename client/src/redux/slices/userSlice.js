import userApi from '../../api/userApi';
import moment from 'moment';
import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
//  Thunk API
export const signIn = createAsyncThunk('user/signIn', async (params, thunkAPI) => {
  const response = await userApi.signIn(params);
  // Save access token to storage
  const { token } = response;
  // const accessToken = `${token_type} ${access_token}`;
  localStorage.setItem('token', token);
  const expiredAt = moment().add(3, 'days');
  localStorage.setItem('expired_at', expiredAt); // expired_at is a timestamp
  return response.user;
});
export const signInGoogle = createAsyncThunk('user/signInGoogle', async (params, thunkAPI) => {
  const response = await userApi.signInGoogle();

  // Save access token to storage
  console.log('response', response);
  const { token } = response;
  // const accessToken = `${token_type} ${access_token}`;
  localStorage.setItem('token', token);
  const expiredAt = moment().add(3, 'days');
  console.log(expiredAt.toISOString());
  localStorage.setItem('expired_at', expiredAt); // expired_at is a timestamp
  return response.user;
});
export const getFriends = createAsyncThunk('user/getFriends', async (params, thunkAPI) => {
  console.log(params);
  const response = await userApi.getFriends(params);
  console.log(response);
  return response.data;
});
export const followUser = createAsyncThunk('user/followUser', async (followerId, thunkAPI) => {
  console.log(followerId);
  const response = await userApi.follow(followerId);
  console.log(response);
  return response.data;
});
export const unfollowUser = createAsyncThunk('user/unfollowUser', async (params, thunkAPI) => {
  console.log(params);
  const response = await userApi.unfollow(params);
  console.log(response);
  return response.message;
});

export const getMe = createAsyncThunk('user/getMe', async (params) => userApi.getMe(params));

// ---------------------
//      MAIN SLICE
// ---------------------
const userSlice = createSlice({
  name: 'user',
  initialState: {
    current: null,
    isFetching: false,
    friends: [],
  },
  reducers: {
    updateUser: (state, action) => {
      state.current = {
        ...state.current,
        ...action.payload,
      };
    },
    logout: (state) => {},
    follow: (state, action) => {
      const newFriends = action.payload;
      state.friends.push(newFriends);
    },
    unfollow: (state, action) => {
      state.friends = state.friends.filter((f) => f.followedId !== action.payload);
    },
  },
  extraReducers: {
    [signIn.pending]: (state, action) => {
      state.isFetching = true;
    },
    [signIn.rejected]: (state, action) => {
      console.log({ action });
      state.isFetching = false;
    },
    [signIn.fulfilled]: (state, action) => {
      console.log({ action });
      state.current = action.payload;
      state.isFetching = false;
    },

    [signInGoogle.fulfilled]: (state, action) => {
      console.log({ action });
      state.current = action.payload;
      state.isFetching = false;
    },

    [followUser.fulfilled]: (state, action) => {
      console.log({ action });
      const followedUser = action.payload;
      state.friends = [
        ...state.friends,
        {
          followerId: followedUser.id,
          username: followedUser.username,
          profilePicture: followedUser.profilePicture,
          coverPicture: followedUser.coverPicture,
          fullName: followedUser.fullName,
        },
      ];
      // state.isFetching = false;
    },
    [getFriends.fulfilled]: (state, action) => {
      console.log({ action });
      state.friends = action.payload;
      // state.isFetching = false;
    },

    [getMe.fulfilled]: (state, action) => {
      state.current = action.payload || {};
    },
    [getMe.rejected]: (state, action) => {
      state.current = {};
    },
  },
});

// selector
export const userSelector = (state) => state.user.current;
export const friendSelector = (state) => state.user.friends;
export const fetchSelector = (state) => state.user.isFetching;

// const { reducer: userReducer } = userSlice;
export default userSlice;

//* create slice and reducer
// const todosSlice = createSlice({
//   name: 'todoList',
//   initialState: { status: 'idle', todos: [] },
//   reducers: {
//     // IMMER
//     addTodo: (state, action) => {
//       state.push(action.payload);
//     }, // action creators
//     toggleTodoStatus: (state, action) => {
//       const currentTodo = state.find((todo) => todo.id === action.payload);
//       if (currentTodo) {
//         currentTodo.completed = !currentTodo.completed;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchTodos.pending, (state, action) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchTodos.fulfilled, (state, action) => {
//         console.log({ action });
//         state.todos = action.payload;
//         state.status = 'idle';
//       })
//       .addCase(addNewTodo.fulfilled, (state, action) => {
//         state.todos.push(action.payload);
//       })
//       .addCase(updateTodo.fulfilled, (state, action) => {
//         let currentTodo = state.todos.find(
//           (todo) => todo.id === action.payload
//         );
//         currentTodo = action.payload;
//       });
//   },
// });

// export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
//   const res = await fetch('/api/todos');
//   const data = await res.json();
//   return data.todos;
// });

// export const addNewTodo = createAsyncThunk(
//   'todos/addNewTodo',
//   async (newTodo) => {
//     const res = await fetch('/api/todos', {
//       method: 'POST',
//       body: JSON.stringify(newTodo),
//     });
//     const data = await res.json();
//     console.log({ data });
//     return data.todos;
//   }
// );

// export const updateTodo = createAsyncThunk(
//   'todos/updateTodo',
//   async (updatedTodo) => {
//     const res = await fetch('/api/updateTodo', {
//       method: 'POST',
//       body: JSON.stringify(updatedTodo),
//     });

//     const data = await res.json();
//     console.log('[updateTodo]', { data });
//     return data.todos;
//   }
// );

// *create selector

// import { createSelector } from '@reduxjs/toolkit';

// export const searchTextSelector = (state) => state.filters.search;
// export const filterStatusSelector = (state) => state.filters.status;
// export const filterPrioritiesSelector = (state) => state.filters.priorities;
// export const todoListSelector = (state) => state.todoList.todos;

// export const todosRemainingSelector = createSelector(
//   todoListSelector,
//   filterStatusSelector,
//   searchTextSelector,
//   filterPrioritiesSelector,
//   (todoList, status, searchText, priorities) => {
//     return todoList.filter((todo) => {
//       if (status === 'All') {
//         return priorities.length
//           ? todo.name.includes(searchText) && priorities.includes(todo.priority)
//           : todo.name.includes(searchText);
//       }

//       return (
//         todo.name.includes(searchText) &&
//         (status === 'Completed' ? todo.completed : !todo.completed) &&
//         (priorities.length ? priorities.includes(todo.priority) : true)
//       );
//     });
//   }
// );
