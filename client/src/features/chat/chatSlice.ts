import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import type { User } from '../../types/Types';

interface ChatState {
    currentConversation: string | null;
    isModalOpen: boolean;
    currentRecipient: User | null;
}

const initialState: ChatState = {
    currentConversation: null,
    isModalOpen: false,
    currentRecipient: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setConversation(state, action: PayloadAction<string>) {
            state.currentConversation = action.payload;
        },
        setIsModalOpen(state, action: PayloadAction<boolean>) {
            state.isModalOpen = action.payload;
        },

        setCurrentRecipient(state, action: PayloadAction<User>) {
            state.currentRecipient = action.payload;
        },
    },
});

export const { setConversation, setCurrentRecipient, setIsModalOpen } =
    chatSlice.actions;

export const selectCurrentConversation = (state: RootState) =>
    state.chat.currentConversation;

export const selectIsModalOpen = (state: RootState) => state.chat.isModalOpen;

export const selectCurrentRecipient = (state: RootState) =>
    state.chat.currentRecipient;

export type ChatSliceState = ReturnType<typeof chatSlice.reducer>;

export default chatSlice.reducer;
