import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {fetchGetMasterData} from './ThunkActions';

import {SalutationType} from '../../types/responses/SalutationResponseType';
import {TitleType} from '../../types/responses/TitleResponseType';

export interface MasterDataStore {
  salutations: Array<SalutationType>;
  titles: Array<TitleType>;
}

const initialState: MasterDataStore = {
  salutations: [],
  titles: [],
};

const MasterDataSlice = createSlice({
  name: 'MASTER_DATA_SLICE',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      fetchGetMasterData.fulfilled,
      (state, action: PayloadAction<MasterDataStore>) => {
        state.salutations = action.payload.salutations;
        state.titles = action.payload.titles;
      },
    );
  },
});

export default MasterDataSlice.reducer;

export * from './ThunkActions';
export * from './Selectors';
