const responses = {
  greetings: {
    patterns: ["hello", "hi", "hey", "greetings", "good morning", "good evening", "good afternoon"],
    response: "Hello! How can I assist you today?"
  },
  wellbeing: {
    patterns: ["how are you", "how's it going", "how do you do", "are you okay"],
    response: "I'm just a virtual assistant, but I'm here and ready to help! How about you?"
  },
  identity: {
    patterns: ["what's your name", "who are you", "what are you", "introduce yourself"],
    response: "I'm AI Assistant, designed to help answer your questions and assist with various tasks!"
  },
  farewell: {
    patterns: ["bye", "goodbye", "see you", "farewell", "take care"],
    response: "Goodbye! Have a wonderful day! Feel free to return anytime."
  },
  gratitude: {
    patterns: ["thanks", "thank you", "appreciate it", "grateful"],
    response: "You're welcome! I'm always here to help."
  },
  capabilities: {
    patterns: ["what can you do", "help", "features", "abilities"],
    response: "I can answer questions, provide information, tell jokes, and help with various tasks. Just ask!"
  },
  weather: {
    patterns: ["weather", "forecast", "temperature"],
    response: "I can't check real-time weather, but you can find it on a weather website or app."
  },
  joke: {
    patterns: ["joke", "tell me a joke", "funny"],
    response: "Why don’t skeletons fight each other? Because they don’t have the guts!"
  },
  time: {
    patterns: ["time", "what time is it"],
    response: "I don't have real-time access, but you can check your device for the current time."
  },
  date: {
    patterns: ["date", "what's the date today"],
    response: "I don't have real-time access, but you can check your device for today's date."
  },
  math: {
    patterns: ["calculate", "math", "solve", "add", "subtract", "multiply", "divide"],
    response: "I'm not a calculator, but I can help with general math knowledge. What do you need help with?"
  },
  AI: {
    patterns: ["what is AI", "explain AI", "artificial intelligence"],
    response: "AI stands for Artificial Intelligence. It enables machines to learn, reason, and perform tasks that usually require human intelligence."
  },
  chatbot: {
    patterns: ["how do you work", "how are you made", "who created you"],
    response: "I'm built using JavaScript and AI logic to simulate conversations. My responses are based on patterns and logic!"
  },
  meaning: {
    patterns: ["define", "meaning of", "what does * mean"],
    response: "I can help define words or concepts. Could you specify what you'd like to know?"
  },
  motivation: {
    patterns: ["motivate me", "inspire me", "give me motivation"],
    response: "You are capable of amazing things. Keep pushing forward, and success will follow!"
  },
  advice: {
    patterns: ["give me advice", "life advice", "any advice"],
    response: "Stay curious, keep learning, and be kind to yourself and others!"
  },
  philosophy: {
    patterns: ["what is the meaning of life", "life meaning", "why are we here"],
    response: "Many philosophers have debated this, but I think finding purpose in what you love is key!"
  },
  fun_fact: {
    patterns: ["tell me a fact", "fun fact", "interesting fact"],
    response: "Did you know? Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3000 years old and still perfectly edible."
  },
  random_question: {
    patterns: ["ask me something", "random question", "test me"],
    response: "Sure! If you could have any superpower, what would it be?"
  },
  hobbies: {
    patterns: ["what do you do for fun", "hobbies", "what do you like"],
    response: "I enjoy helping people and answering questions! What are your hobbies?"
  },
  emotions: {
    patterns: ["do you have feelings", "can you feel", "are you happy"],
    response: "I don't have emotions like humans, but I try my best to understand and respond meaningfully!"
  },
  dreams: {
    patterns: ["do you dream", "what do you dream about"],
    response: "If I could dream, I think I'd dream of helping people and learning endlessly!"
  },
  history: {
    patterns: ["history of AI", "who invented AI", "AI origins"],
    response: "AI was first conceptualized in the 1950s by pioneers like Alan Turing and John McCarthy. Since then, it's evolved rapidly!"
  },
  animals: {
    patterns: ["favorite animal", "do you like animals", "best pet"],
    response: "I think all animals are amazing, but many people love dogs and cats for their companionship!"
  },
  food: {
    patterns: ["favorite food", "what do you eat", "best dish"],
    response: "I don’t eat, but I’ve heard pizza and sushi are quite popular!"
  },
  movies: {
    patterns: ["favorite movie", "what movies do you like"],
    response: "I don't watch movies, but I hear sci-fi movies about AI are quite fascinating!"
  },
  books: {
    patterns: ["favorite book", "recommend a book"],
    response: "There are so many great books! Do you prefer fiction or non-fiction?"
  },
  music: {
    patterns: ["favorite music", "best song"],
    response: "I don’t listen to music, but I’ve heard that classical and jazz can be quite relaxing!"
  },
  travel: {
    patterns: ["best travel destination", "where should I go on vacation"],
    response: "It depends! If you like beaches, try the Maldives. For history, Rome is amazing!"
  },
  technology: {
    patterns: ["latest tech", "what's new in technology"],
    response: "Technology is evolving fast! AI, blockchain, and quantum computing are hot topics right now."
  },
  health: {
    patterns: ["how to stay healthy", "health tips"],
    response: "Eat a balanced diet, exercise regularly, and get enough sleep!"
  },
  learning: {
    patterns: ["how to learn", "best way to study"],
    response: "Stay curious, break topics into small sections, and practice consistently!"
  },
  coding: {
    patterns: ["coding tips", "learn programming", "coding resources"],
    response: "Start with the basics, practice writing code, and build projects to apply your skills!"
  },
  career: {
    patterns: ["career advice", "job tips", "professional growth"],
    response: "Set clear goals, keep learning, and network with professionals in your field!"
  },
  future: {
    patterns: ["future predictions", "what's next", "future technology"],
    response: "The future is exciting! AI, space exploration, and sustainability will play key roles."
  },
  privacy: {
    patterns: ["are you spying", "privacy concerns", "data security"],
    response: "I'm designed to respect your privacy and confidentiality. Your data is safe with me!"
  },
  
};

export const getResponse = (input) => {
  const lowercaseInput = input.toLowerCase();
  
  for (const category of Object.values(responses)) {
    if (category.patterns.some(pattern => lowercaseInput.includes(pattern))) {
      return category.response;
    }
  }
  
  return "I'm sorry, I don't have a specific answer for that question. Feel free to ask me anything else!";
};
