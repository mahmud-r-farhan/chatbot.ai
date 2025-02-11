import { create } from 'zustand';

const useStore = create((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

export default useStore;