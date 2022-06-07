import {createAction, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {cancelAllNotifications} from '../../notifications';
import {FontType} from '../../types/request';
import {
  CheckoutSettingResponseType,
  CheckoutSettingType,
} from '../../types/responses/CheckoutSettingResponseType';
// custom
import {
  SettingResponseType,
  DashboardSettingResponseType,
  SettingType,
  StaticSlider,
  CourseSlider,
  CourseListSettings,
  NewsNavigationBarType,
} from '../../types/responses/SettingResponseType';
import {fetchLogout} from '../Auth';
import {
  fetchAppSettings,
  fetchCheckoutSettings,
  fetchDashboardSettings,
  fetchLoadAppFonts,
} from './ThunkActions';

interface Reminder {
  id?: number;
  name?: string;
  defaultTime?: string;
  enabled?: boolean;
  notificationTime?: string;
}

interface ConfigurationStore extends SettingType {
  fonts: Array<FontType>;
  dashboard: Array<
    StaticSlider | CourseSlider | CourseListSettings | NewsNavigationBarType
  >;
  checkout: CheckoutSettingType | undefined;
  selectedNavigation: {id: number; name: string};
  scheduledReminders: Array<Reminder>;
}

const initialState: ConfigurationStore = {
  logo_color_ci: undefined,
  on_boarding: undefined,
  settings: undefined,
  fonts: [],
  navigations: {
    drawer: [],
    bar: [],
  },
  dashboard: [],
  checkout: undefined,
  selectedNavigation: {id: -1, name: ''},
  scheduledReminders: [],
};

export const setSelectedNavigation = createAction<{id: number; name: string}>(
  'set-selected-navigation',
);
export const setScheduledReminders = createAction<Array<Reminder>>(
  'set-scheduled-reminders',
);

const ConfigurationSlice = createSlice({
  name: 'CONFIGURATION_SLICE',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      fetchAppSettings.fulfilled,
      (state, action: PayloadAction<SettingResponseType>) => {
        state.logo_color_ci = action.payload.data.logo_color_ci;
        state.on_boarding = action.payload.data.on_boarding;
        state.settings = action.payload.data.settings;
        state.navigations = action.payload.data.navigations;
      },
    );
    builder.addCase(
      fetchLoadAppFonts.fulfilled,
      (state, action: PayloadAction<Array<FontType>>) => {
        console.log(
          'loading App Fonts State update , fulfiled response',
          action.payload,
        );
        state.fonts = action.payload;
      },
    );
    // fetch app dashboard settings
    builder.addCase(
      fetchDashboardSettings.fulfilled,
      (state, action: PayloadAction<DashboardSettingResponseType>) => {
        state.dashboard = Object.values(action.payload.data);
      },
    );
    builder.addCase(
      fetchCheckoutSettings.fulfilled,
      (state, action: PayloadAction<CheckoutSettingResponseType>) => {
        state.checkout = action.payload.data;
      },
    );
    builder.addCase(setSelectedNavigation, (state, action) => {
      state.selectedNavigation = action.payload;
    });
    builder.addCase(setScheduledReminders, (state, action) => {
      state.scheduledReminders = action.payload;
    });
    builder.addCase(fetchLogout.fulfilled, state => {
      state.scheduledReminders = [];
      cancelAllNotifications();
    });
  },
});

export default ConfigurationSlice.reducer;

export * from './ThunkActions';
export * from './Selectors';
