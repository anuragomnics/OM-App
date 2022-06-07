import {combineReducers} from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import {persistReducer} from 'redux-persist';

//custom
import AuthSlice from './Auth';
import ConfigurationSlice from './Configuration';
import StatusSlice from './Status';
import CourseSlice from './Course';
import NewsSlice from './News';
import EventsSlice from './Events';
import MasterData from './MasterData';

const RootReducers = combineReducers({
  auth: AuthSlice,
  configuration: ConfigurationSlice,
  status: StatusSlice,
  course: CourseSlice,
  news: NewsSlice,
  events: EventsSlice,
  masterData: MasterData,
});

const config = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['configuration', 'auth'],
};

const PersistReducer = persistReducer(config, RootReducers);
export default PersistReducer;
