import {configureStore} from '@reduxjs/toolkit';
import {logger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
// \custom
import RootReducers from './reducers';

const logs = [];
if (__DEV__) {
  logs.push(logger);
}

export const Store = configureStore({
  reducer: RootReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunkMiddleware),
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export const Persistor = persistStore(Store);
