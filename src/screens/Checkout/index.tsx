import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// styles
import {t, f, l, c} from '../../styles/shared';
// custom
import Header from '../../components/Header';
import {ContainerStyles} from '../../styles/elements';
import CheckoutForm from './components/CheckoutForm';
import FormContainer from '../../components/FormContainer';
import MembershipDetails from './components/MembershipDetails';
import BasketDetails from './components/BasketDetails';
import {PaymentService} from '../../services/PaymentService';
import {useAppSelector} from '../../hooks/useRedux';
import {
  CheckoutSettingsSelector,
  onBoardingSelector,
} from '../../store/Configuration';
import {formatPaymentValues} from '../../utils/PaymentUtil';
import {useSubscriptionCallback} from '../../hooks/useIAP';
import {PurchaseError, SubscriptionPurchase} from 'react-native-iap';
import {useSubscription} from './hooks';
import Constants from '../../config/Constants';
import NavigationService from '../../services/NavigationService';
import {IsAuthSelector} from '../../store/Auth';
import CustomKeyboardAvoidingView from '../../components/CustomKeyboardAvoidingView';
import {SalutationsSelector, TitlesSelector} from '../../store/MasterData';
import CreatingAccountModal from './components/CreatingAccountModal';
import {RootStackParams, ScreenID} from '../../navigation/types';
import DeviceHelper from '../../config/DeviceHelper';
import {ShowOfferMembership} from '../../types/responses/SettingResponseType';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.Checkout>;
}

const Checkout: FC<Props> = ({route}) => {
  // @ts-ignore
  const membershipOffer = route.params;
  const isAuth = useAppSelector(IsAuthSelector());
  const salutations = useAppSelector(SalutationsSelector());
  const titles = useAppSelector(TitlesSelector());
  const onBoarding = useAppSelector(onBoardingSelector());

  // refs
  const orderId = useRef<number | undefined>(undefined);

  // state
  const [formLoading, setFormLoading] = useState(false);
  const [showAccountCreatingModal, setShowAccountCreatingModal] =
    useState(false);

  const onFormSubmit = async (values: {[key: string]: string | undefined}) => {
    // let userMemberShip: ShowOfferMembership | undefined = undefined;
    const subscriptionIds: string[] = [];
    onBoarding?.show_offer_memberships?.map((offerMembership, index) => {
      const product_id = DeviceHelper.isIOS
        ? offerMembership?.product_id_apple_pay
        : offerMembership?.product_id_google_pay;
      subscriptionIds.push(product_id);
    });
    const subscriptionPurchase = await PaymentService.getActiveSubscription(
      subscriptionIds,
    );

    // get membership from subscription id
    const userMemberShip = onBoarding?.show_offer_memberships?.find(
      (offerMembership, index) => {
        const product_id = DeviceHelper.isIOS
          ? offerMembership?.product_id_apple_pay
          : offerMembership?.product_id_google_pay;
        return subscriptionPurchase?.productId == product_id;
      },
    );

    const params = formatPaymentValues(
      values,
      // @ts-ignore
      userMemberShip,
      salutations,
      titles,
    );

    try {
      setFormLoading(true);
      // @ts-ignore
      const {data} = await PaymentService.fetchCreateMembershipOrder(params);

      setFormLoading(false);
      // @ts-ignore
      orderId.current = data?.order?.id;
      const {subscription} = await useSubscription(userMemberShip);

      setShowAccountCreatingModal(true);

      if (orderId.current && subscription) {
        await PaymentService.fetchSuccessPayment({
          order_id: orderId.current,
          payment_data: {
            // @ts-ignore
            receipt: subscriptionPurchase,
            subscription: subscription,
          },
        });
      }
      NavigationService.replace(ScreenID.Login);
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 100,
        text1: 'Benutzerkonto wurde erfolgreich erstellt!',
        text2: 'Eine E-Mail mit Ihren Benutzerkonto Daten wurde versendet.',
        visibilityTime: 3000,
      });
    } catch (error) {
      setFormLoading(false);

      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 100,
        text1: 'Oops!',
        text2: 'Ein Fehler ist aufgetreten. Bitte laden Sie die Anwendung neu.',
        visibilityTime: 3000,
      });
      console.log('[ERROR] onFormSubmit', error);
    } finally {
      setShowAccountCreatingModal(false);
    }
  };

  return (
    <View style={[ContainerStyles]}>
      <Header title={'Warenkorb'} useBack />

      <View style={{flex: 1}}>
        {showAccountCreatingModal && <CreatingAccountModal />}
        <CustomKeyboardAvoidingView>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* <MembershipDetails
              description={membershipOffer?.description}
              imageUrl={membershipOffer?.image_url}
            /> */}
            <FormContainer
              widgetStyles={{
                childContainer: styles.FormContainerWidgetContainer,
              }}>
              <CheckoutForm
                onFormSubmit={onFormSubmit}
                formLoading={formLoading}
              />
            </FormContainer>
          </ScrollView>
        </CustomKeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  FormContainerWidgetContainer: {
    ...l.p20,
  },
});

export default Checkout;
