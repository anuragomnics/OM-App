import HttpService from './HttpService';
import {SalutationResponseType} from '../types/responses/SalutationResponseType';
import {TitleResponseType} from '../types/responses/TitleResponseType';

const fetchGetMasterDataCustomerSalutation = async () => {
  return await HttpService.Get<SalutationResponseType>(
    '/master-data/customer/salutation',
  ).then(data => {
    return {
      ...data,
      data: Object.values(data.data),
    };
  });
};

const fetchGetMasterDataCustomerTitle = async () => {
  return await HttpService.Get<TitleResponseType>(
    '/master-data/customer/title',
  ).then(data => {
    return {
      ...data,
      data: Object.values(data.data),
    };
  });
};

export const MasterDataService = {
  fetchGetMasterDataCustomerSalutation,
  fetchGetMasterDataCustomerTitle,
};
