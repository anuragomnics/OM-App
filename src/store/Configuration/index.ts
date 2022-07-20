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
  CourseSlider,
  CourseListSettings,
  NewsNavigationBarType,
  SettingTypeNew,
  BannerSectionType,
} from '../../types/responses/SettingResponseType';
import {
  NavigationsResponseType,
  NavigationType,
} from '../../types/responses/NavigationsResponseType';
import {fetchLogout} from '../Auth';
import {
  fetchAppNavigations,
  fetchAppSettings,
  fetchAppSettingsNew,
  fetchCheckoutSettings,
  fetchDashboardSettings,
  fetchLoadAppFonts,
} from './ThunkActions';
import {PostType} from '../../types/responses/PostsListResponseType';

export type ThemeSettingType = 'system' | 'dark' | 'light';

interface Reminder {
  id?: number;
  name?: string;
  defaultTime?: string;
  enabled?: boolean;
  notificationTime?: string;
}

interface ConfigurationStore {
  settings: SettingTypeNew;
  fonts: Array<FontType>;
  navigations: Array<NavigationType>;
  dashboard: Array<BannerSectionType>;
  checkout: CheckoutSettingType | undefined;
  selectedNavigation: {id: number; name: string};
  scheduledReminders: Array<Reminder>;
  theme: 'light' | 'dark';
  themeSettingType: ThemeSettingType;
}

const initialState: ConfigurationStore = {
  // @ts-ignore
  settings: undefined,
  // logo_color_ci: undefined,
  // on_boarding: undefined,
  // settings: undefined,
  fonts: [],
  navigations: [],
  dashboard: [],
  checkout: undefined,
  selectedNavigation: {id: -1, name: ''},
  scheduledReminders: [],
  theme: 'light',
  themeSettingType: 'system',
};

export const setSelectedNavigation = createAction<{id: number; name: string}>(
  'set-selected-navigation',
);
export const setScheduledReminders = createAction<Array<Reminder>>(
  'set-scheduled-reminders',
);
export const setAppThemeSettingType = createAction<ThemeSettingType>(
  'set-app-theme-setting-type',
);
export const setAppTheme = createAction<'light' | 'dark'>('set-app-theme');

const ConfigurationSlice = createSlice({
  name: 'CONFIGURATION_SLICE',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // builder.addCase(
    //   fetchAppSettingsNew.fulfilled,
    //   (state, action: PayloadAction<SettingResponseType>) => {
    //     // state.logo_color_ci = action.payload.data.logo_color_ci;
    //     // state.on_boarding = action.payload.data.on_boarding;
    //     // state.settings = action.payload.data.settings;
    //     // state.navigations = action.payload.data.navigations;
    //   },
    // );
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
    // // fetch app dashboard settings
    // builder.addCase(
    //   fetchDashboardSettings.fulfilled,
    //   (state, action: PayloadAction<DashboardSettingResponseType>) => {
    //     state.dashboard = Object.values(action.payload.data);
    //   },
    // );
    // builder.addCase(
    //   fetchCheckoutSettings.fulfilled,
    //   (state, action: PayloadAction<CheckoutSettingResponseType>) => {
    //     state.checkout = action.payload.data;
    //   },
    // );
    builder.addCase(
      fetchAppSettingsNew.fulfilled,
      (state, action: PayloadAction<SettingResponseType>) => {
        state.settings = action.payload.generalDetails;
      },
    );
    builder.addCase(
      fetchAppNavigations.fulfilled,
      (state, action: PayloadAction<NavigationsResponseType>) => {
        state.navigations = action.payload.navigationMenu;
      },
    );
    builder.addCase(
      fetchDashboardSettings.fulfilled,
      (state, action: PayloadAction<DashboardSettingResponseType>) => {
        state.dashboard = action.payload.pageSettingsDetails.sections;
      },
    );
    builder.addCase(setSelectedNavigation, (state, action) => {
      state.selectedNavigation = action.payload;
    });
    builder.addCase(setScheduledReminders, (state, action) => {
      state.scheduledReminders = action.payload;
    });
    builder.addCase(setAppTheme, (state, action) => {
      state.theme = action.payload;
    });
    builder.addCase(setAppThemeSettingType, (state, action) => {
      state.themeSettingType = action.payload;
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
