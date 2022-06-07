import {createDraftSafeSelector} from '@reduxjs/toolkit';
import {RootState} from '../../store';

const selectSelf = (state: RootState) => state;

export const DrawerNavigationSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.navigations.drawer;
  });

export const TabsNavigationSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.navigations.bar;
  });

export const SelectedNavigationSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.selectedNavigation;
  });

export const ColorSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return {
      color_accent: state.configuration.logo_color_ci?.color_accent,
      color_accent_text_color:
        state.configuration.logo_color_ci?.color_accent_text_color,
      color_navigation_background:
        state.configuration.logo_color_ci?.color_navigation_background,
      color_navigation_text:
        state.configuration.logo_color_ci?.color_navigation_text,
      color_error_alert: state.configuration.logo_color_ci?.color_error_alert,
      color_success_alert:
        state.configuration.logo_color_ci?.color_success_alert,
      color_warning_alert:
        state.configuration.logo_color_ci?.color_warning_alert,
    };
  });

export const FontSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.configuration.logo_color_ci?.font_app;
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
