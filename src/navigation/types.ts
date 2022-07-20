import {CheckoutRouteParams} from '../types/request';
import {PostType} from '../types/responses/PostsListResponseType';

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
  LegalTextDetail = 'LegalTextDetail',
  CouseDetails = 'CouseDetails',
  AllCourses = 'AllCourses',
  PostDetails = 'PostDetails',
  AllPosts = 'AllPosts',
  EventDetails = 'EventDetails',
  AllEvents = 'AllEvents',
  VideoPlayer = 'VideoPlayer',
  Profile = 'Profile',
  SetNewPassword = 'SetNewPassword',
  AppSearch = 'AppSearch',
  Reminders = 'Reminders',
  FullScreenImage = 'FullScreenImage',
  Settings = 'Settings',
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
  [ScreenID.LegalTextDetail]: undefined;
  [ScreenID.CouseDetails]: undefined;
  [ScreenID.AllCourses]: undefined;
  [ScreenID.AllPosts]: undefined;
  [ScreenID.EventDetails]: undefined;
  [ScreenID.AllEvents]: undefined;
  [ScreenID.VideoPlayer]: {post: PostType};
  [ScreenID.PostDetails]: undefined;
  [ScreenID.Profile]: undefined;
  [ScreenID.SetNewPassword]: undefined;
  [ScreenID.AppSearch]: undefined;
  [ScreenID.Reminders]: undefined;
  [ScreenID.FullScreenImage]: undefined;
  [ScreenID.Settings]: undefined;
};
