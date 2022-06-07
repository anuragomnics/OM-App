import React, {FC, useRef} from 'react';
import {View, ScrollView, Image, Linking, Alert} from 'react-native';
// styles
import styles from './styles';
//meta
import {metaFinder} from '../../meta';
// custom
import Header from '../../components/Header';
import MembershipProduct from './components/MembershipProduct';
import Button from '../../components/Button';
import NavigationService from '../../services/NavigationService';
import FormContainer from '../../components/FormContainer';
import Text from '../../components/Text';
import {useAppSelector} from '../../hooks/useRedux';
import {DashBoardSelector, onBoardingSelector} from '../../store/Configuration';
import {ShowOfferMembership} from '../../types/responses/SettingResponseType';
import {ScreenID} from '../../navigation/types';
import Toast from 'react-native-toast-message';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import {l} from '../../styles/shared';
import {useSubscription} from '../Checkout/hooks';
import {PaymentService} from '../../services/PaymentService';
import Constants from '../../config/Constants';
import {
  PurchaseError,
  Subscription,
  SubscriptionPurchase,
} from 'react-native-iap';
import {useSubscriptionCallback} from '../../hooks/useIAP';

const MemberShips: FC<any> = () => {
  const onBoarding = useAppSelector(onBoardingSelector());
  const primaryColor = usePrimaryStyles().color;

  // refs
  const subscriptionCallBack = useRef<boolean>(false);
  const subscriptionRef = useRef<Subscription | undefined>(undefined);

  const goToSignIn = () => {
    NavigationService.pushToScreen(ScreenID.Login);
  };

  const goToCheckout = async (item: ShowOfferMembership) => {
    const {subscription, isLoading, error} = await useSubscription(item);
    subscriptionRef.current = subscription;

    // NavigationService.pushToScreen(ScreenID.Checkout, item);
    if (subscriptionRef.current?.productId) {
      await PaymentService.fetchRequestSubscription(
        subscriptionRef.current?.productId,
      );
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 100,
        text1: 'Oops!',
        text2: 'Ein Fehler ist aufgetreten. Bitte laden Sie die Anwendung neu.',
        visibilityTime: 3000,
      });
    }
  };

  const onSubscriptionSuccess = async (result: SubscriptionPurchase) => {
    try {
      NavigationService.resetToScreen(ScreenID.Main);
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 100,
        text1: 'Oops!',
        text2: 'Ein Fehler ist aufgetreten. Bitte laden Sie die Anwendung neu.',
        visibilityTime: 3000,
      });
      console.log('[ERROR] onSubscriptionSuccess', error);
    }
  };

  const onSubscriptionError = async (error: PurchaseError | any) => {
    if (error?.code !== Constants.PaymentStatusErrorCode.UserCancelled) {
      console.log('[ERROR] onSubscriptionError', error);
    }
  };

  if (!subscriptionCallBack.current) {
    useSubscriptionCallback(onSubscriptionSuccess, onSubscriptionError);
    subscriptionCallBack.current = true;
  }

  return (
    <View style={styles.container}>
      <Header useLogo />

      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        {/* <Image
          source={require('../../assets/images/banner_woman.png')}
          style={styles.bannerImg}
        /> */}
        <View style={styles.bodyWrapper}>
          <Text style={styles.signInDesc}>
            {'Sie haben schon ein Benutzerkonto?'}
          </Text>
          <Button title={'Anmelden'} theme={'primary'} onPress={goToSignIn} />
          <Text style={styles.productMembershipHeader}>
            {
              'Falls Sie kein Benutzerkonto haben, können Sie sich zum Jahresprogramm anmelden'
            }
          </Text>
          {onBoarding?.show_offer_memberships?.map((offerMembership, index) => (
            <MembershipProduct
              key={index}
              item={offerMembership}
              goToCheckout={() => {
                goToCheckout(offerMembership);
              }}
            />
          ))}

          {/* <View style={l.mt20}>
            <Text style={{textAlign: 'center'}}>
              <Text
                onPress={() => {
                  Linking.openURL(
                    'https://ayurveda.drjannascharfenberg.com/pages/legaltext/6',
                  );
                }}
                style={{
                  ...styles.linkText,
                  textDecorationColor: primaryColor,
                  color: primaryColor,
                }}>
                {'Impressum'}
              </Text>
              {' and '}
              <Text
                onPress={() => {
                  Linking.openURL(
                    'https://ayurveda.drjannascharfenberg.com/pages/legaltext/4',
                  );
                }}
                style={{
                  ...styles.linkText,
                  textDecorationColor: primaryColor,
                  color: primaryColor,
                }}>
                {'Datenschutzbedingungen'}
              </Text>
            </Text>
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default MemberShips;
