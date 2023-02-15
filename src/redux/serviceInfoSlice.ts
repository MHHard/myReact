/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* eslint-disable camelcase */
/* eslint-disable no-debugger */

interface ServiceInfoIState {
    transferRelatedFeatureDisabled: boolean;
}

const initialState: ServiceInfoIState = {
    transferRelatedFeatureDisabled: false
};

const serviceInfoSlice = createSlice({
  name: "transferRelatedFeatureDisabled",
  initialState,
  reducers: {
    setTransferRelatedFeatureDisabled: (state, { payload }: PayloadAction<boolean>) => {
      state.transferRelatedFeatureDisabled = payload;
    },
  },
});

export const { setTransferRelatedFeatureDisabled } = serviceInfoSlice.actions;

export default serviceInfoSlice.reducer;