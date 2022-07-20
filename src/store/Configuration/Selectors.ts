import {createDraftSafeSelector} from '@reduxjs/toolkit';
import {RootState} from '../../store';

const selectSelf = (state: RootState) => state;

export const DrawerNavigationSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.navigations;
  });

export const TabsNavigationSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.navigations;
  });

export const SelectedNavigationSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.selectedNavigation;
  });

export const ColorSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return {
      color_accent:
        state.configuration.theme === 'dark'
          ? state.configuration.settings.accent_color_dark_mode
          : state.configuration.settings.accent_color,
      color_accent_text_color:
        state.configuration.theme === 'dark'
          ? state.configuration.settings.accent_text_color_dark_mode
          : state.configuration.settings.accent_text_color,
      color_error_alert: state.configuration.settings?.error_alert,
      color_success_alert: state.configuration.settings.success_alert,
      color_warning_alert: state.configuration.settings.warning_alert,
    };
  });

export const FontSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.settings?.font;
  });

export const FontsSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.fonts;
  });

export const SettingsSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.settings;
  });

export const onBoardingSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.on_boarding;
  });

export const DashBoardSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.dashboard;
  });

export const CheckoutSettingsSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.checkout;
  });

export const scheduledRemindersSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.scheduledReminders;
  });

export const ThemeSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.theme;
  });
export const ThemeSetttingTypeSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.themeSettingType;
  });
