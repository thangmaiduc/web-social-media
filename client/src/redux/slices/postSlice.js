import postApi from '../../api/postApi';
import moment from 'moment'
import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
//  Thunk API
export const getTimeLine = createAsyncThunk(
  'post/getTimeLine',
  async (params, thunkAPI) => {
    console.log(params);
    const response = await postApi.getTimeLine();

    // Save access token to storage
    console.log(response);
    // const accessToken = `${token_type} ${access_token}`;
  
    return response.data;
  }
);



// ---------------------
//      MAIN SLICE
// ---------------------
const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    isFetching: false,
  },
  reducers: {},
  extraReducers: {
    [getTimeLine.pending]: (state, action) => {
      state.isFetching = true;
    },
    [getTimeLine.rejected]: (state, action) => {
      console.log({ action });
      state.isFetching = false;
    },
    [getTimeLine.fulfilled]: (state, action) => {
      console.log({ action });
      state.posts = action.payload;
      state.isFetching = false;
    },

    
  },
});

// selector
export const postsSelector = (state) => state.post.posts;
export const fetchSelector = (state) => state.post.isFetching;

// const { reducer: userReducer } = userSlice;
export default postSlice;

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
