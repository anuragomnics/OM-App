import {Subscription} from 'react-native-iap';
import Constants from '../config/Constants';
import DeviceHelper from '../config/DeviceHelper';
import {useAppSelector} from '../hooks/useRedux';
import {SalutationsSelector, TitlesSelector} from '../store/MasterData';
import {SalutationType} from '../types/responses/SalutationResponseType';
import {ShowOfferMembership} from '../types/responses/SettingResponseType';
import {TitleType} from '../types/responses/TitleResponseType';

export const getLawTextKeyName = (id: number, type: string) => {
  return `lawText_${type}_${id}`;
};

export const formatPaymentValues = (
  values: {
    [key: string]: string | undefined;
  },
  membershipOffer: ShowOfferMembership,
  salutations: SalutationType[],
  titles: TitleType[],
) => {
  const legal_texts = [];
  let newsletter: any = null;
  for (const key in values) {
    if (key.startsWith('lawText_') && !!values[key]) {
      // @ts-ignore
      const item = JSON.parse(values[key]);
      if (key.startsWith(`lawText_${Constants.LawTextTypes.LawText}`)) {
        legal_texts.push(item);
      } else if (
        key.startsWith(`lawText_${Constants.LawTextTypes.CollectionNewsletter}`)
      ) {
        newsletter = {
          id: item.id,
          identifier: item.identifier,
          newsletter_list: item.newsletter_list,
        };
      }
    }
  }
  const {
    setting_id,
    firstName,
    lastName,
    email,
    salutation,
    title,
    orderAs,
    ...rest
  } = values;
  const salutation_id = salutations?.filter(v => v.name === salutation)?.[0]
    ?.id;
  const title_id = titles?.filter(v => v.name === title)?.[0]?.id;

  return {
    legal_texts,
    newsletter,
    setting_id: setting_id,
    product_id: membershipOffer?.id,
    product_type: membershipOffer?.product_type,
    personal: {
      first_name: firstName,
      last_name: lastName,
      salutation_id: salutation_id,
      title_id: title_id,
      email,
      ...rest,
    },
    payment: 'google_pay',
    customer_type: orderAs,
  };
};
