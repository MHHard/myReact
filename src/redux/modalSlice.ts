import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// eslint-disable-next-line no-shadow
export enum ModalName {
  provider = "showProviderModal",
  history = "showHistoryModal",
  transfer = "showTransferModal",
  rate = "showRateModal",
  menu = "showMenuModal",
  userIsBlockedModal = "showUserIsBlockedModal",
  unclaimedRewards = "showUnclaimedRewardsModal",
  disabledModal = "showDisabledModal",
}

interface IModalState {
  showProviderModal: boolean;
  showHistoryModal: boolean;
  showTransferModal: boolean;
  showRateModal: boolean;
  showMenuModal: boolean;
  showUnclaimedRewardsModal: boolean;
  showDisabledModal: boolean;
  showUserIsBlockedModal: boolean;
}

const initialState: IModalState = {
  showProviderModal: false,
  showHistoryModal: false,
  showTransferModal: false,
  showRateModal: false,
  showMenuModal: false,
  showUnclaimedRewardsModal: false,
  showDisabledModal: false,
  showUserIsBlockedModal: false,
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
