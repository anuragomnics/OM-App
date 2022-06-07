import {PaymentDataParams, StoreMembershipOrderParams} from '../types/request';
import HttpService from '../services/HttpService';
import IAP, {
  getAvailablePurchases,
  Subscription as SubscriptionType,
  SubscriptionPurchase,
  validateReceiptIos,
} from 'react-native-iap';
import DeviceHelper from '../config/DeviceHelper';
import {CreateMembershipOrderResponseType} from '../types/responses/CreateMembershipOrderResponseType';
import dayjs, {OpUnitType} from 'dayjs';
import Localize from 'react-native-localize';
import {ReceiptValidationResponse} from 'react-native-iap/src/types/apple';
import DeviceInfo from 'react-native-device-info';
import {CheckoutSettingResponseType} from '../types/responses/CheckoutSettingResponseType';
import {Alert} from 'react-native';

const fetchGetSubscriptions = async (subscriptionID: string) => {
  return await IAP.getSubscriptions([subscriptionID]);
};

const fetchRequestSubscription = async (subscriptionId: string) => {
  return await IAP.requestSubscription(subscriptionId);
};

const fetchGetCheckoutSettings = async () => {
  return await HttpService.Get<CheckoutSettingResponseType>(
    '/web-and-app/get-checkout-setting',
  );
};

const fetchCreateMembershipOrder = async (data: StoreMembershipOrderParams) => {
  const result = await HttpService.Post<CreateMembershipOrderResponseType>(
    '/app-purchase-store-order',
    data,
    {
      params: {
        channel: DeviceHelper.platform.toLowerCase(),
        lang: 'en',
      },
    },
  );

  return result;
};

const fetchCancelPayment = async (order_id: number) => {
  return await HttpService.Post(
    '/order/payment/app/cancel',
    {order_id},
    {
      params: {
        channel: DeviceHelper.platform.toLowerCase(),
        lang: 'en',
      },
    },
  );
};

const fetchSuccessPayment = async ({
  order_id,
  payment_data: {subscription, receipt},
}: {
  order_id: number;
  payment_data: {
    receipt: SubscriptionPurchase;
    subscription: SubscriptionType;
  };
}) => {
  const period = DeviceHelper.isIOS
    ? `${subscription.subscriptionPeriodNumberIOS}_${subscription.subscriptionPeriodUnitIOS}`
    : subscription.subscriptionPeriodAndroid;
  const data: PaymentDataParams = {
    auto_renewing: true,
    // @ts-ignore
    country_code: subscription?.countryCode ?? Localize.getCountry(),
    currency_code: subscription?.currency,
    start_date: receipt?.transactionDate,

    // @ts-ignore
    end_date: formatSubscriptionPeriod(period),
    // @ts-ignore
    payment_state: DeviceHelper.isIOS ? 1 : receipt?.purchaseStateAndroid,
    total: parseInt(subscription?.price || '0'),
    purchase_token_android: receipt?.purchaseToken,
    transaction_id_ios: receipt.transactionId,
  };

  return await HttpService.Post(
    '/order/payment/app/success',
    {order_id, payment_data: data},
    {
      params: {
        channel: DeviceHelper.platform.toLowerCase(),
        lang: 'en',
      },
    },
  );
};

const formatSubscriptionPeriod = (period: string) => {
  let interval: string, time: number, unit: OpUnitType;
  if (DeviceHelper.isIOS) {
    const snakeIndex = period.search('_');
    time = parseInt(period.substring(0, snakeIndex));
    interval = period.substring(snakeIndex + 1, period.length);
    switch (interval) {
      case 'DAY':
        unit = 'd';
        break;
      case 'WEEK':
        unit = 'w';
        break;
      case 'MONTH':
        unit = 'M';
        break;
      case 'YEAR':
        unit = 'y';
        break;
    }
  } else {
    interval = period.charAt(period.length - 1);
    time = parseInt(period.charAt(1));
    switch (interval) {
      case 'W':
        unit = 'w';
        break;
      case 'M':
        unit = 'M';
        break;
      case 'Y':
        unit = 'y';
        break;
    }
  }

  // @ts-ignore
  return dayjs(new Date()).add(time, unit).valueOf();
};

const getActiveSubscription = async (
  subscriptionIDs: Array<string>,
): Promise<SubscriptionPurchase | undefined> => {
  if (DeviceHelper.isIOS) {
    const availablePurchases = await getAvailablePurchases();

    const sortedAvailablePurchases = availablePurchases.sort(
      (a, b) => b.transactionDate - a.transactionDate,
    );

    const latestAvailableReceipt =
      sortedAvailablePurchases?.[0]?.transactionReceipt;

    const decodedReceipt = await validateReceiptIos(
      {
        'receipt-data': latestAvailableReceipt,
        password: '39807877efbd423bb4875a3024b641ec',
      },
      __DEV__,
    );

    if (decodedReceipt) {
      const {latest_receipt_info: latestReceiptInfo} =
        decodedReceipt as ReceiptValidationResponse;

      const expirationInMilliseconds = Number(
        // @ts-ignore
        latestReceiptInfo?.expires_date_ms,
      );

      const nowInMilliseconds = Date.now();

      if (expirationInMilliseconds > nowInMilliseconds)
        return sortedAvailablePurchases?.[0];
    }

    return undefined;
  }

  if (!DeviceHelper.isIOS) {
    const availablePurchases = await getAvailablePurchases();
    let result = undefined;

    for (let i = 0; i < availablePurchases.length; i++) {
      if (subscriptionIDs.includes(availablePurchases[i].productId)) {
        if (availablePurchases[i].autoRenewingAndroid) {
          result = availablePurchases[i];
        }
      }
    }
    return result;
  }
};

const getCancelLink = (subscriptionID: string) => {
  if (DeviceHelper.isIOS) {
    return 'https://apps.apple.com/account/subscriptions';
  }
  const bundleId = DeviceInfo.getBundleId();
  return `https://play.google.com/store/account/subscriptions?package=${bundleId}&sku=${subscriptionID}`;
};

export const PaymentService = {
  fetchGetSubscriptions,
  fetchRequestSubscription,
  fetchGetCheckoutSettings,
  fetchCreateMembershipOrder,
  fetchCancelPayment,
  fetchSuccessPayment,
  getActiveSubscription,
  getCancelLink,
};
