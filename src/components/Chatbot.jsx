import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import useStore from '../store/store';
import { FiSend, FiMenu, FiX, FiCopy, FiThumbsUp } from 'react-icons/fi';
import { BsChatDots, BsThreeDots, BsFillLightningFill, BsFillHeartFill, BsFillCalculatorFill, BsFillClockFill } from 'react-icons/bs';
import { FaHistory } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';
import { PiUserCircleLight } from 'react-icons/pi';
import { CgTrashEmpty } from 'react-icons/cg';

const INPUT_MAX_LENGTH = 50;

const getThemeClasses = (darkClass, lightClass, theme) =>
  theme === 'dark' ? darkClass : lightClass;

const markdownComponents = {
  p: ({ node, ...props }) => <p className="mb-2" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
};

const TypingIndicator = ({ theme }) => (
  <div className="absolute right-2 bottom-2 flex space-x-1">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={`w-2 h-2 ${getThemeClasses('bg-gray-400', 'bg-gray-600', theme)} rounded-full animate-bounce`}
        style={{ animationDelay: `${i * 0.1}s` }}
      ></div>
    ))}
  </div>
);

const MessageBubble = ({ message, isUser, isTyping = false, displayedText = '', theme, animations }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
  >
    <div className="flex items-start space-x-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-sm flex-shrink-0 shadow-lg">
          <MdSupportAgent size={20} />
        </div>
      )}
      <div className={`relative ${isUser ? 'order-first' : ''}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-auto shadow-blue-500/25'
              : getThemeClasses(
                  'bg-gray-700/80 backdrop-blur-sm border border-gray-600/30 hover:bg-gray-600/80',
                  'bg-gray-200/80 backdrop-blur-sm border border-gray-300/30 hover:bg-gray-300/80',
                  theme
                )
          }`}
        >
          <ReactMarkdown components={markdownComponents}>{isTyping ? displayedText : message.text}</ReactMarkdown>
          {isTyping && <TypingIndicator theme={theme} />}
        </div>
        <div className={`flex items-center justify-between mt-2 ${isUser ? 'flex-row-reverse' : ''}`}>
          <div className={`text-xs ${getThemeClasses('text-gray-400', 'text-gray-600', theme)} ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          {!isUser && !isTyping && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => navigator.clipboard.writeText(message.text)}
                className={`p-1 rounded ${getThemeClasses(
                  'hover:bg-gray-600/50 text-gray-400 hover:text-white',
                  'hover:bg-gray-300/50 text-gray-600 hover:text-gray-900',
                  theme
                )} transition-colors`}
                aria-label="Copy message"
              >
                <FiCopy size={14} />
              </button>
              <button
                onClick={() => updateMessageReaction(message.id, 'likes')}
                className={`p-1 rounded ${getThemeClasses(
                  'hover:bg-gray-600/50 text-gray-400 hover:text-green-400',
                  'hover:bg-gray-300/50 text-gray-600 hover:text-green-600',
                  theme
                )} transition-colors`}
                aria-label="Like message"
              >
                <FiThumbsUp size={14} />
                {message.reactions && message.reactions.likes > 0 && (
                  <span className="text-xs ml-1">{message.reactions.likes}</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-sm flex-shrink-0 shadow-lg">
          <PiUserCircleLight size={20} />
        </div>
      )}
    </div>
  </motion.div>
);

const Chatbot = () => {
  const [input, setInput] = useState('');
  const { messages, processMessage, isTyping, clearMessages, updateMessageReaction, userPreferences, typingMessage } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const [displayedText, setDisplayedText] = useState('');

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, displayedText]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (typingMessage) {
      let currentIndex = 0;
      setDisplayedText('');
      const typeInterval = setInterval(() => {
        if (currentIndex < typingMessage.text.length) {
          setDisplayedText((prev) => prev + typingMessage.text[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 30);
      return () => clearInterval(typeInterval);
    }
  }, [typingMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    processMessage(input);
    setInput('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const quickPrompts = [
    { icon: BsFillCalculatorFill, text: 'Calculate 25 * 4 + 10', emoji: '🧮' },
    { icon: BsFillLightningFill, text: 'Tell me an interesting fact', emoji: '💡' },
    { icon: BsFillHeartFill, text: 'I need some motivation', emoji: '💪' },
    { icon: BsChatDots, text: 'Tell me a joke', emoji: '😄' },
    { icon: BsFillClockFill, text: "What's the time?", emoji: '⏰' },
    { icon: BsThreeDots, text: 'What can you help me with?', emoji: '🤔' },
  ];

  return (
    <div
      className={`flex h-screen text-white font-sans overflow-hidden ${getThemeClasses(
        'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800',
        'bg-gradient-to-br from-gray-100 via-blue-100 to-gray-200 text-gray-900',
        userPreferences.theme
      )}`}
    >
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed inset-y-0 left-0 z-50 w-80 ${getThemeClasses(
              'bg-gray-800/95 border-gray-600/50',
              'bg-gray-200/95 border-gray-300/50',
              userPreferences.theme
            )} backdrop-blur-xl border-r`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-600/50">
              <div className="flex items-center space-x-3">
                <BsChatDots size={24} className={getThemeClasses('text-blue-400', 'text-blue-600', userPreferences.theme)} />
                <h2
                  className={`text-lg font-bold bg-clip-text ${getThemeClasses(
                    'bg-gradient-to-r from-blue-400 to-purple-400 text-transparent',
                    'text-blue-600',
                    userPreferences.theme
                  )}`}
                >
                  Chat History
                </h2>
              </div>
              <button
                onClick={toggleSidebar}
                className={`p-2 ${getThemeClasses('hover:bg-gray-700/50', 'hover:bg-gray-300/50', userPreferences.theme)} rounded-xl transition-colors`}
                aria-label="Close sidebar"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto h-full">
              {messages
                .filter((msg) => msg.isUser)
                .slice(-15)
                .map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl text-sm cursor-pointer transition-all duration-200 border ${getThemeClasses(
                      'bg-gray-700/50 hover:bg-gray-600/50 border-gray-600/30 hover:border-blue-400/30',
                      'bg-gray-300/50 hover:bg-gray-400/50 border-gray-300/30 hover:border-blue-600/30',
                      userPreferences.theme
                    )}`}
                  >
                    <div className="truncate font-medium">{msg.text}</div>
                    <div
                      className={`text-xs mt-1 flex items-center justify-between ${getThemeClasses(
                        'text-gray-400',
                        'text-gray-600',
                        userPreferences.theme
                      )}`}
                    >
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <BsThreeDots size={14} />
                    </div>
                  </motion.div>
                ))}
              {messages.length > 1 && (
                <button
                  onClick={() => {
                    clearMessages();
                    setIsSidebarOpen(false);
                  }}
                  className="w-full p-3 mt-4 text-sm bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-[1.01]"
                  aria-label="Clear chat history"
                >
                  <CgTrashEmpty size={20} className="inline mr-1 mb-1" />
                  Clear History
                </button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-w-0">
        <header
          className={`bg-gray-800/80 backdrop-blur-xl p-4 flex items-center justify-between shadow-xl border-b sticky top-0 z-40 ${getThemeClasses(
            'border-gray-600/30',
            'border-gray-300/30',
            userPreferences.theme
          )}`}
        >
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className={`p-2 ${getThemeClasses('hover:bg-gray-700/50', 'hover:bg-gray-300/50', userPreferences.theme)} rounded-xl transition-all duration-200`}
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <MdSupportAgent size={20} />
            </div>
            <div>
              <h1
                className={`text-xl font-bold bg-clip-text ${getThemeClasses(
                  'bg-gradient-to-r from-blue-400 to-purple-400 text-transparent',
                  'text-blue-600',
                  userPreferences.theme
                )}`}
              >
                AI Assistant Pro
              </h1>
              <div className="text-xs flex items-center text-gray-400">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse inline-block"></span>
                Online & Ready to Help
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearMessages}
              className={`p-2 ${getThemeClasses('hover:bg-gray-700/50', 'hover:bg-gray-300/50', userPreferences.theme)} rounded-xl transition-all duration-200`}
              title="New Chat"
              aria-label="Start new chat"
            >
              <FaHistory size={18} />
            </button>
          </div>
        </header>

        <div
          ref={chatBoxRef}
          className={`flex-1 overflow-y-auto p-4 space-y-4 ${getThemeClasses(
            'bg-gradient-to-b from-transparent to-gray-900/20',
            'bg-gradient-to-b from-transparent to-gray-100/20',
            userPreferences.theme
          )}`}
        >
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-8 opacity-90"
            >
              <div className="relative">
                <div
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-2xl"
                >
                  <BsChatDots className={userPreferences.animations ? 'animate-pulse' : ''} />
                </div>
                <div
                  className={`absolute -top-1 -right-1 w-6 h-6 ${getThemeClasses('bg-green-400', 'bg-green-600', userPreferences.theme)} rounded-full flex items-center justify-center`}
                >
                  <BsFillLightningFill size={12} />
                </div>
              </div>
              <div className="space-y-4">
                <h3
                  className={`text-2xl font-bold ${getThemeClasses(
                    'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent',
                    'text-blue-600',
                    userPreferences.theme
                  )}`}
                >
                  Welcome to AI Assistant Pro!
                </h3>
                <p
                  className={`max-w-md text-lg ${getThemeClasses('text-gray-400', 'text-gray-600', userPreferences.theme)}`}
                >
                  I'm here to help with calculations, answer questions, tell jokes, provide motivation, and have great conversations!
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
                {quickPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setInput(prompt.text)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl text-sm transition-all duration-200 border ${getThemeClasses(
                      'bg-gray-700/40 hover:bg-gray-600/50 border-gray-600/30 hover:border-blue-400/50',
                      'bg-gray-200/40 hover:bg-gray-300/50 border-gray-300/30 hover:border-blue-600/50',
                      userPreferences.theme
                    )}`}
                  >
                    <div className="text-2xl mb-2">{prompt.emoji}</div>
                    <div className={getThemeClasses('text-gray-300', 'text-gray-700', userPreferences.theme)}>
                      {prompt.text}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isUser={message.isUser}
                theme={userPreferences.theme}
                animations={userPreferences.animations}
              />
            ))}
            {typingMessage && (
              <MessageBubble
                message={typingMessage}
                isUser={false}
                isTyping={true}
                displayedText={displayedText}
                theme={userPreferences.theme}
                animations={userPreferences.animations}
              />
            )}
            {isTyping && !typingMessage && (
              <MessageBubble
                message={{ text: '', timestamp: Date.now() }}
                isUser={false}
                isTyping={true}
                displayedText=""
                theme={userPreferences.theme}
                animations={userPreferences.animations}
              />
            )}
          </AnimatePresence>
        </div>

        <div
          className={`p-4 ${getThemeClasses('bg-gray-800/80 border-gray-600/30', 'bg-gray-200/80 border-gray-300/30', userPreferences.theme)} backdrop-blur-xl border-t`}
        >
          <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Try math, questions, or just chat!"
                className={`w-full px-4 py-3 pr-12 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200 ${getThemeClasses(
                  'bg-gray-700/50 border-gray-600/50',
                  'bg-gray-300/50 border-gray-400/50',
                  userPreferences.theme
                )}`}
                disabled={isTyping}
                maxLength={INPUT_MAX_LENGTH}
              />
              <div
                className={`absolute right-3 bottom-3 text-xs ${getThemeClasses('text-gray-500', 'text-gray-600', userPreferences.theme)}`}
                aria-live="polite"
              >
                {input.length}/{INPUT_MAX_LENGTH}
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={isTyping || !input.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 rounded-2xl transition-all duration-200 shadow-lg disabled:cursor-not-allowed flex-shrink-0`}
              aria-label="Send message"
            >
              {isTyping ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <FiSend size={18} />
              )}
            </motion.button>
          </form>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default Chatbot;