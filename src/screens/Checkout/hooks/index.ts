import {useEffect, useMemo, useState} from 'react';
import * as Yup from 'yup';
import {startCase} from 'lodash';

// custom
import {
  CheckoutSettingType,
  ExtraField,
  LawText,
} from '../../../types/responses/CheckoutSettingResponseType';
import Constants from '../../../config/Constants';
import {PaymentService} from '../../../services/PaymentService';
import DeviceHelper from '../../../config/DeviceHelper';
import {
  getAvailablePurchases,
  Subscription as SubscriptionType,
  SubscriptionPurchase,
  validateReceiptIos,
} from 'react-native-iap';
import {
  CheckoutRouteParams,
  LawTextDetailRouteParams,
} from '../../../types/request';
import {SharedValidationSchema} from '../../../utils/ValidationSchemaUtil';
import {getLawTextKeyName} from '../../../utils/PaymentUtil';
import {
  CompanyValidationSchema,
  PrivateCitizenValidationSchema,
} from '../validation';
import {Alert} from 'react-native';
import {ReceiptValidationResponse} from 'react-native-iap/src/types/apple';

export interface FormValues {
  [key: string]: string | undefined;
}

export const useSubscription = async (
  params: CheckoutRouteParams | undefined,
) => {
  // const[data, setData] = useState<SubscriptionType | undefined>(undefined);
  let data: SubscriptionType | undefined = undefined;
  // const [isLoading, setLoading] = useState<boolean>(false);
  let isLoading: boolean = false;
  // const [error, setError] = useState<string | undefined>(undefined);
  let error: string | undefined = undefined;

  try {
    isLoading = true;
    const subscriptionId = DeviceHelper.isIOS
      ? params?.product_id_apple_pay
      : params?.product_id_google_pay;
    if (subscriptionId) {
      const response = await PaymentService.fetchGetSubscriptions(
        subscriptionId,
      );
      const subscription = response[0];
      data = subscription;
    }
  } catch (err) {
    const error =
      err?.message ?? 'Your device is not support for in app purchase!';
    // eslint-disable-next-line no-console
    console.log('[ERROR] fetchGetSubscriptions', err.message);
  } finally {
    isLoading = false;
  }

  return {
    isLoading: isLoading,
    subscription: data,
    error,
  };
};

export const useLawTextValue = (
  checkoutSettings: CheckoutSettingType | undefined,
) => {
  return useMemo(() => {
    if (!checkoutSettings) {
      return [];
    }
    const {law_texts, collection_newsletter} = checkoutSettings;
    let lawTexts: Array<LawTextDetailRouteParams> = law_texts.map(
      (v: LawText) => {
        return {
          content: v.legal_text.content,
          description: v.legal_text.description,
          id: v.legal_text.id,
          identifier: v.legal_text.identifier,
          required: v.required,
          type: Constants.LawTextTypes.LawText,
          newsletter_list: undefined,
          legal_text_element: v.legal_text.legal_text_element,
        };
      },
    );
    if (collection_newsletter.enable) {
      lawTexts = [
        ...lawTexts,
        {
          content: collection_newsletter.legal_text.content,
          description: collection_newsletter.legal_text.description,
          id: collection_newsletter.legal_text.id,
          identifier: collection_newsletter.legal_text.identifier,
          required: false,
          type: Constants.LawTextTypes.CollectionNewsletter,
          newsletter_list: collection_newsletter.newsletter_list,
          legal_text_element:
            collection_newsletter.legal_text.legal_text_element,
        },
      ];
    }
    return lawTexts;
  }, [checkoutSettings?.collection_newsletter, checkoutSettings?.law_texts]);
};

const formatFormField = (extraField: ExtraField | undefined = {}) => {
  const fields = Object.keys(extraField).map(v => {
    return {
      fieldName: v,
      placeholder: startCase(v),
      ...extraField[v],
    };
  });

  return fields.filter(v => v.enable);
};

export const useCheckoutMetaDataForm = (
  checkoutSetting: CheckoutSettingType | undefined,
  orderAs: string | number,
  lawTextValues: Array<LawTextDetailRouteParams>,
) => {
  return useMemo(() => {
    const extraValues: FormValues = {};
    let validationSchema: any = {};
    let extraValidationSchema: any = {};
    let fields = [];
    const extraValidation: {[key: string]: any} = {};
    if (!checkoutSetting) {
      return {
        extraValues,
        validationSchema,
        fields: [],
      };
    }
    const {extra_field_company, extra_field_consumer} = checkoutSetting;

    if (orderAs === Constants.OrderAs.Company) {
      fields = formatFormField(extra_field_company);
    } else {
      fields = formatFormField(extra_field_consumer);
    }

    for (const item of fields) {
      extraValues[item.fieldName] = '';
      if (item.required) {
        if (item.type === 'phone') {
          extraValidation[item.fieldName] = SharedValidationSchema.phoneNumber;
        } else {
          extraValidation[item.fieldName] = Yup.string().required(
            `Bitte geben Sie ${item.placeholder}`,
          );
        }
      }
    }

    if (lawTextValues.length > 0) {
      for (const item of lawTextValues) {
        const keyName = getLawTextKeyName(item.id, item.type);
        extraValues[keyName] = '';
        if (item.required) {
          const keyName = getLawTextKeyName(item.id, item.type);
          extraValidation[keyName] = Yup.string().required(
            'Sie müssen die Bestimmung akzeptieren',
          );
        }
      }
    }

    extraValidationSchema = Yup.object().shape(extraValidation);

    if (orderAs === Constants.OrderAs.Company) {
      validationSchema = CompanyValidationSchema.concat(extraValidationSchema);
    } else {
      validationSchema = PrivateCitizenValidationSchema.concat(
        extraValidationSchema,
      );
    }

    return {
      validationSchema,
      extraValues,
      fields,
    };
  }, [orderAs, checkoutSetting, lawTextValues]);
};
