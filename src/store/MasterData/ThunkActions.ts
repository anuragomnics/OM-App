import {createAsyncThunk} from '@reduxjs/toolkit';

// custom
import {MasterDataService} from '../../services/MasterDataService';
import {SalutationResponseType} from '../../types/responses/SalutationResponseType';
import {MasterDataStore} from './index';
import {TitleResponseType} from '../../types/responses/TitleResponseType';
import NewsService from '../../services/PostsService';

export const GetMasterDataPrefix = '@MasterData/GetMasterData';
export const fetchLawTextDetailsByIdPrefix =
  '@MasterData/fetchLawTextDetailsById';

export const fetchGetMasterData = createAsyncThunk(
  GetMasterDataPrefix,
  async (_, {rejectWithValue}) => {
    try {
      const promises: [
        Promise<SalutationResponseType>,
        Promise<TitleResponseType>,
      ] = [
        MasterDataService.fetchGetMasterDataCustomerSalutation(),
        MasterDataService.fetchGetMasterDataCustomerTitle(),
      ];
      const data = await Promise.all(promises);
      const result: MasterDataStore = {
        salutations: data[0].data,
        titles: data[1].data,
      };
      return result;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);
