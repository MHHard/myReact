import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IWindowWidthState {
  isMobile: boolean;
  windowWidth: number;
}

const initialState: IWindowWidthState = {
  isMobile: false,
  windowWidth: document.documentElement.clientWidth,
};

const windowWidthSlice = createSlice({
  name: "windowWidth",
  initialState,
  reducers: {
    saveWidth: (state, { payload }: PayloadAction<{ winWidth: number }>) => {
      state.isMobile = payload.winWidth <= 768;
      state.windowWidth = payload.winWidth;
    },
  },
});

export const { saveWidth } = windowWidthSlice.actions;

export default windowWidthSlice.reducer;
