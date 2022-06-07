import {useState} from 'react';
import {Alert, EmitterSubscription} from 'react-native';
import IAP, {
  initConnection,
  purchaseUpdatedListener,
  purchaseErrorListener,
  Product,
  ProductPurchase,
  PurchaseError,
  InAppPurchase,
  SubscriptionPurchase,
  finishTransaction,
  Purchase,
} from 'react-native-iap';

let purchaseUpdateSubscription: EmitterSubscription;
let purchaseErrorSubscription: EmitterSubscription;

// init IAP connection
export const useInitIAP = async () => {
  const [isLoading, setIsLoading] = useState(true);
  try {
    await IAP.initConnection();
    console.log('initIAP : IAP connection initialized');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[ERROR] initIAP', error);
  } finally {
    setIsLoading(false);
  }

  return isLoading;
};

// end IAP connection
export const endIAPConnection = async () => {
  try {
    await IAP.endConnection();
    console.log('endIAP : IAP connection Ended');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[ERROR] endIAP', error);
  }
};

export const useSubscriptionCallback = (
  onSuccess: (purchase: SubscriptionPurchase) => void,
  onError: (error: PurchaseError | any) => void,
) => {
  purchaseUpdateSubscription = purchaseUpdatedListener(
    async (purchase: SubscriptionPurchase) => {
      onSuccess(purchase);
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        try {
          await finishTransaction(purchase);
        } catch (error) {
          onError(error);
        }
      }
    },
  );
  purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
    onError(error);
  });
};

// request product purchase
export const requestSubscription = async (productId: string) => {
  try {
    await IAP.requestSubscription(productId);
  } catch (error) {
    console.log('[ERROR] IAP requestSubscription', error); // standardized err.code and err.message available
  }
};
