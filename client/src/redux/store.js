import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import userSlice from './slices/userSlice';
import notificationSlice from './slices/notificationSlice';
import messengerSlice from './slices/messengerSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
const reducers = combineReducers({
  user: userSlice.reducer,
  notification: notificationSlice.reducer,
  messenger: messengerSlice.reducer,
});
const rootReducer = (state, action) => {
  if (action.type === 'user/logout') {
    state = undefined;
  }
  return reducers(state, action);
};
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
