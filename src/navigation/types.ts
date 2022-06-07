import {CheckoutRouteParams} from '../types/request';

export enum ScreenID {
  Onboarding = 'Onboarding',
  Login = 'Login',
  Memberships = 'Memberships',
  Register = 'Register',
  Checkout = 'Checkout',
  ForgotPassword = 'ForgotPassword',
  ChangePassword = 'ChangePassword',
  Dashboard = 'Dashboard',
  Main = 'Main',
  LawTextDetail = 'LawTextDetail',
  CouseDetails = 'CouseDetails',
  AllCourses = 'AllCourses',
  NewsDetails = 'NewsDetails',
  AllNews = 'AllNews',
  EventDetails = 'EventDetails',
  AllEvents = 'AllEvents',
  CourseVideoPlayer = 'CourseVideoPlayer',
  Profile = 'Profile',
  SetNewPassword = 'SetNewPassword',
  AppSearch = 'AppSearch',
  Reminders = 'Reminders',
  FullScreenImage = 'FullScreenImage',
}

export type RootStackParams = {
  [ScreenID.Onboarding]: undefined;
  [ScreenID.Login]: undefined;
  [ScreenID.Memberships]: undefined;
  [ScreenID.Register]: undefined;
  [ScreenID.Checkout]: CheckoutRouteParams;
  [ScreenID.ForgotPassword]: undefined;
  [ScreenID.ChangePassword]: undefined;
  [ScreenID.Dashboard]: undefined;
  [ScreenID.Main]: undefined;
  [ScreenID.LawTextDetail]: undefined;
  [ScreenID.CouseDetails]: undefined;
  [ScreenID.AllCourses]: undefined;
  [ScreenID.AllNews]: undefined;
  [ScreenID.EventDetails]: undefined;
  [ScreenID.AllEvents]: undefined;
  [ScreenID.CourseVideoPlayer]: undefined;
  [ScreenID.NewsDetails]: undefined;
  [ScreenID.Profile]: undefined;
  [ScreenID.SetNewPassword]: undefined;
  [ScreenID.AppSearch]: undefined;
  [ScreenID.Reminders]: undefined;
  [ScreenID.FullScreenImage]: undefined;
};
