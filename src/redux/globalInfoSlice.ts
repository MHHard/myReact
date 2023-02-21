import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* eslint-disable no-debugger */
const globalInfoSlice = createSlice({
  name: "globalInfo",
  initialState: {
    swapAddresses: "",
    faucetAddresses: {
      3: "0x584ee85a7bb588a0143ad8d25039b58b05eea5c4",
      5: "0x50B96c4374EFeEA0C183D06679A14e951E33B4Dd",
      97: "0x265B25e22bcd7f10a5bD6E6410F10537Cc7567e8",
      4002: "0x265B25e22bcd7f10a5bD6E6410F10537Cc7567e8",
    },
    swapContractAddr: "",
  },
  reducers: {
    setSwapAddresses: (state, { payload }: PayloadAction<string>) => {
      state.swapAddresses = payload;
    },
    setSwapContractAddr: (state, { payload }: PayloadAction<string>) => {
      state.swapContractAddr = payload;
    },
  },
});

export const { setSwapAddresses, setSwapContractAddr } =
  globalInfoSlice.actions;

export default globalInfoSlice.reducer;
