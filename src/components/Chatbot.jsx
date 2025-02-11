import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/store';
import { getResponse } from '../utils/response';
import { FiSend, FiMenu, FiX } from 'react-icons/fi';
import { BsChatDots, BsThreeDots } from 'react-icons/bs';
import { IoMdRefresh } from 'react-icons/io';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const { messages, addMessage } = useStore();
  const chatBoxRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setChatHistory(messages.filter(msg => msg.isUser).map(msg => msg.text));
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      addMessage({ text: input, isUser: true });
      setInput('');
      setIsTyping(true);
      setIsLoading(true);

      try {
        setTimeout(async () => {
          const response = await getResponse(input);
          addMessage({ text: response, isUser: false });
          setIsTyping(false);
          setIsLoading(false);
        }, 500); // Delay added for bot response
      } catch (error) {
        addMessage({ text: "Sorry, there was an error. Please try again.", isUser: false });
        setIsTyping(false);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed lg:relative w-72 bg-gray-800 h-full z-20 shadow-xl"
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-lg font-bold">Chat History</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-700 rounded-full"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-5rem)]">
              {chatHistory.map((chat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  {chat}
                </motion.div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1">
        <header className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <BsChatDots size={24} className="mr-3 text-blue-400" />
            <h1 className="text-xl font-bold">AI Assistant</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <IoMdRefresh size={20} />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <BsThreeDots size={20} />
            </button>
          </div>
        </header>

        <div
          ref={chatBoxRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`chat-bubble ${message.isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="chat-bubble chat-bubble-bot typing-animation">...</div>
            </motion.div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-gray-800 shadow-lg border-t border-gray-700">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="input-field"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="send-button"
            >
              <FiSend size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
