# Chatbot Component Documentation

## Overview
The Chatbot component is a React-based AI assistant that provides real-time chat functionality with a smooth user experience. It features animated message transitions, a sidebar for chat history, and a typing indicator with a delay for bot responses.

## Features
- Real-time chat interface
- Animated chat messages using Framer Motion
- Typing indicator with animation
- Sidebar for chat history
- Smooth scrolling behavior
- Responsive design

## Dependencies
- React
- Framer Motion (for animations)
- React Icons (for UI icons)
- Zustand (for state management)

## Component Breakdown

### State Variables
- `input`: Stores the user input.
- `messages`: Stores chat messages (retrieved from Zustand store).
- `chatHistory`: Stores chat history extracted from previous user messages.
- `isTyping`: Boolean indicating whether the bot is typing.
- `isSidebarOpen`: Controls the visibility of the sidebar.
- `isLoading`: Prevents multiple submissions while waiting for a bot response.

### Hooks Used
- `useState`: Manages local states.
- `useRef`: References the chat container for auto-scrolling.
- `useEffect`: Updates chat history and auto-scrolls the chat view.

### Functions
#### `handleSubmit(e)`
Handles message submission:
1. Prevents default form submission.
2. Checks if the input is valid.
3. Adds the user message to the chat.
4. Displays the bot typing animation.
5. Fetches the bot response with a delay (1500ms).
6. Updates the chat and hides the typing indicator.

#### `useEffect` Hook for Auto-Scrolling
Ensures that the chat view scrolls to the bottom when new messages arrive.

#### `useEffect` Hook for Chat History
Extracts user messages and stores them in `chatHistory`.

### UI Breakdown
#### Chat History Sidebar
- Displays a list of past user messages.
- Can be toggled open/closed.
- Uses Framer Motion for smooth slide-in/out animations.

#### Chat Messages
- Displayed as bubbles (user messages are blue, bot messages are gray).
- Animated using Framer Motion.
- Typing indicator mimics a bot response delay.

#### Input Field & Send Button
- Users can type messages and send them via a button.
- Input is disabled when the bot is processing a response.

## CSS Animations
- **Typing Animation**: Simulates dots appearing while the bot is typing.
- **Chat Bubble Effects**: Smooth fade-in and slide-up animations.
- **Sidebar Transitions**: Uses Framer Motion for fluid motion effects.

## Future Enhancements
- Improve bot response handling with an API backend.
- Add persistent chat history using local storage or a database.
- Support multiple chat sessions.
- Integrate speech-to-text or voice recognition features.

This documentation serves as a guide to understanding and extending the chatbot component. Happy coding!