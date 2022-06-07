import DeviceHelper from './DeviceHelper';

export default {
  DefaultErrorMessage: 'Something were wrong. Please try again',
  VerifyEmailTypes: {
    ResetPassword: 'ResetPassword',
    SignUp: 'SignUp',
  },
  OrderAs: {
    Company: 'company',
    PrivateCitizen: 'consumer',
  },

  LawTextTypes: {
    LawText: 'law_text',
    CollectionNewsletter: 'collection_newsletter',
  },
  PaymentType: DeviceHelper.isIOS ? 'apple_pay' : 'google_pay',
  PaymentStatusErrorCode: {
    UserCancelled: 'E_USER_CANCELLED',
    UnKnown: 'E_UNKNOWN',
  },
  PageSize: 20,
  SortCourseDefault: '-id',
  salutations: [
    {id: 1, name: 'Frau'},
    {id: 2, name: 'Herr'},
  ],
  Reminders: [
    {
      id: 1,
      name: 'Guten Morgen! Starte den Tag mit deinem ayurvedischer Morgenritual (Ölziehen, Zungeschaben und warmes Wasser)',
      defaultTime: '06:30',
    },
    {id: 2, name: 'Hab einen wunderbaren Tag.', defaultTime: '08:30'},
    {
      id: 3,
      name: 'Ich verbinde mich bewusst mit meiner Intention für 2022 💫',
      defaultTime: '10:00',
    },
    {
      id: 4,
      name: 'Mini-Auszeit für dich: Atme ein paar Mal tief ein und aus. Lasse alles los und konzentriere dich auf den Moment.',
      defaultTime: '14:00',
    },
    {
      id: 5,
      name: 'Hast du heute schon genug getrunken?',
      defaultTime: '16:00',
    },
    {
      id: 6,
      name: 'Gönn dir Ruhe und starte in einen ruhigen Abend. Handy aus - Entspannung an. Schlaf gut!',
      defaultTime: '21:30',
    },
  ],
  androidNotificationChannelId:
    'niedersachsischerlandkreistag-notification-channel',
};
