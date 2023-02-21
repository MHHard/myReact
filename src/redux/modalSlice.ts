import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// eslint-disable-next-line no-shadow
export enum ModalName {
  provider = "showProviderModal",
  sendModal = "sendModal",
  confrimSwapModal = "confrimSwapModal",
}

interface IModalState {
  showProviderModal: boolean;
  confrimSwapModal: boolean;
  sendModal: boolean;
}

const initialState: IModalState = {
  showProviderModal: false,
  confrimSwapModal: false,
  sendModal: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, { payload }: PayloadAction<ModalName>) => {
      state[payload] = true;
    },
    closeModal: (state, { payload }: PayloadAction<ModalName>) => {
      state[payload] = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
