import { create } from 'zustand';
import { getEnhancedResponse } from '../utils/response';

const generateId = (type) => `${type}-${crypto.randomUUID()}`;
const getDeviceType = () => (window.innerWidth < 768 ? 'mobile' : 'desktop');

const initialState = () => ({
  messages: JSON.parse(localStorage.getItem(`chatbot_history_${getDeviceType()}`)) || [
    {
      id: generateId('init'),
      isUser: false,
      text: "👋 Hi! I'm your AI Assistant Pro. Ask me anything — math, advice, fun facts, or help with learning!",
      timestamp: new Date().toISOString(),
      reactions: { likes: 0 },
    },
  ],
  isTyping: false,
  isMuted: false,
  isMobile: getDeviceType() === 'mobile',
  unreadCount: 0,
  userPreferences: {
    theme: 'dark',
    animations: true,
  },
  typingMessage: null,
  currentTopic: null,
});

const useStore = create((set, get) => ({
  ...initialState(),

  addMessage: (message) =>
    set((state) => {
      const updatedMessages = [...state.messages, message];
      localStorage.setItem(`chatbot_history_${state.isMobile ? 'mobile' : 'desktop'}`, JSON.stringify(updatedMessages));
      return { messages: updatedMessages, unreadCount: !message.isUser ? state.unreadCount + 1 : state.unreadCount };
    }),

  clearMessages: () => 
    set((state) => {
      const deviceType = state.isMobile ? 'mobile' : 'desktop';
      const initialMsg = {
        id: generateId('init'),
        isUser: false,
        text: "👋 Hi! I'm your AI Assistant Pro. Ask me anything — math, advice, fun facts, or help with learning!",
        timestamp: new Date().toISOString(),
        reactions: { likes: 0 },
      };
      const newMessages = [initialMsg];
      localStorage.setItem(`chatbot_history_${deviceType}`, JSON.stringify(newMessages));
      return {
        messages: newMessages,
        unreadCount: 0,
        isTyping: false,
        typingMessage: null,
      };
    }),

  updateMessageReaction: (messageId, reactionType) =>
    set((state) => {
      const updatedMessages = state.messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [reactionType]: (msg.reactions?.[reactionType] || 0) + 1,
              },
            }
          : msg
      );
      localStorage.setItem(`chatbot_history_${state.isMobile ? 'mobile' : 'desktop'}`, JSON.stringify(updatedMessages));
      return { messages: updatedMessages };
    }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  setUserPreferences: (preferences) =>
    set((state) => ({ userPreferences: { ...state.userPreferences, ...preferences } })),

  setTypingMessage: (message) => set({ typingMessage: message }),

  setTopic: (topic) => set({ currentTopic: topic }),

  processMessage: async (userInput) => {
    const cleanedInput = userInput.trim();
    if (!cleanedInput) return;

    const userMessage = {
      id: generateId('user'),
      isUser: true,
      text: userInput,
      timestamp: new Date().toISOString(),
      reactions: { likes: 0 },
    };
    get().addMessage(userMessage);
    set({ isTyping: true, typingMessage: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 800 + 500));
      
      const botResponse = await getEnhancedResponse(cleanedInput, get().messages);

      const botMessage = {
        id: generateId('bot'),
        isUser: false,
        text: botResponse.text,
        timestamp: new Date().toISOString(),
        reactions: { likes: 0 },
      };

      const stickyTopics = ['math', 'learning', 'ai', 'creator'];
      if (stickyTopics.includes(botResponse.key)) {
        get().setTopic(botResponse.key);
      } else {
        get().setTopic(null);
      }

      set({ typingMessage: botMessage });

      const typingDelay = Math.min(botResponse.text.length * 40, 3000);
      await new Promise((resolve) => setTimeout(resolve, typingDelay));

      get().addMessage(botMessage);

      if (!get().isMuted && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('New Message from Assistant', {
          body: botResponse.text.slice(0, 60) + (botResponse.text.length > 60 ? '...' : ''),
        });
      }
    } catch (err) {
      console.error('Error processing message:', err);
      get().addMessage({
        id: generateId('err'),
        isUser: false,
        text: "Sorry, I couldn't process that right now. Please try again!",
        timestamp: new Date().toISOString(),
        reactions: { likes: 0 },
      });
    } finally {
      set({ isTyping: false, typingMessage: null });
    }
  },
}));

export default useStore;