import Fuse from 'fuse.js';

const responses = {
  greeting: {
    patterns: [/^(hi|hello|hey|good\s+(morning|afternoon|evening)|greetings|howdy|what's up|sup)/i],
    responses: [
      "Hello there! 👋 I'm excited to chat with you today. What's on your mind?",
      "Hi! 🌟 I'm your AI assistant, ready to help with anything you need.",
      "Hey! Great to see you. I'm here to assist, inspire, or just have a fun conversation!",
      "Greetings! 🚀 What adventure shall we embark on today?",
    ],
    followUp: "Feel free to ask me about anything - from complex calculations to creative ideas!",
  },
  farewell: {
    patterns: [/^(bye|goodbye|see\s+you|farewell|take\s+care|later|gotta go|ttyl)/i],
    responses: [
      "Goodbye! 👋 It was wonderful chatting with you. Have an amazing day!",
      "Take care! 🌈 Come back anytime - I'll be here waiting to help.",
      "See you later! ✨ Thanks for the great conversation. Stay awesome!",
      "Farewell, friend! 🌟 Until next time, keep being incredible!",
    ],
  },
  wellbeing: {
    patterns: [/how\s+(are\s+you|'re\s+you|is\s+it\s+going)/i],
    responses: [
      "I'm doing fantastic, thanks for asking! 😊 How about you?",
      "All systems go here! 🤖 What's up with you?",
      "I'm buzzing with energy! ⚡️ How's your day going?",
    ],
  },
  identity: {
    patterns: [/(what'?s\s+your\s+name|who\s+are\s+you|what\s+are\s+you|introduce\s+yourself)/i],
    responses: [
      "I'm AI Assistant Pro! Your friendly helper for all things knowledge and fun.",
      "Call me AI Assistant Pro! I'm here to answer, entertain, and inspire.",
      "I'm a super-smart AI built to assist you! What's your next question?",
    ],
  },
  gratitude: {
    patterns: [/(thank\s+you|thanks|appreciate|grateful)/i],
    responses: [
      "You're so welcome! 😊 Happy to make your day better.",
      "No problem at all! 😄 I'm here to help anytime.",
      "My pleasure! 🌟 Keep those great questions coming!",
    ],
  },
  capabilities: {
    patterns: [/(what\s+can\s+you\s+do|help\s+me\s+with|your\s+abilities|features|what\s+do\s+you\s+know)/i],
    responses: [
      "I'm a versatile AI assistant! \n\n **What I can do:**\n• Solve complex math problems\n• Answer questions on various topics\n• Tell jokes and stories\n• Provide advice and motivation\n• Help with creative writing\n• Explain concepts clearly\n• Have meaningful conversations\n\nWhat would you like to explore first?",
      "Great question! I'm equipped with:\n\n **Knowledge**: Science, history, literature, and more\n **Math Skills**: From basic arithmetic to complex equations\n💡 **Creativity**: Jokes, stories, and brainstorming\n🤝 **Support**: Advice, motivation, and friendly chat\n\nWhat sounds interesting to you?",
    ],
  },
  joke: {
    patterns: [/(tell\s+me\s+a\s+joke|joke|funny|humor|make\s+me\s+laugh)/i],
    responses: [
      "Here's one for you! 😄\n\nWhy don't scientists trust atoms?\n\nBecause they make up everything! ",
      "Get ready to laugh! 🤣\n\nWhat do you call a fake noodle?\n\nAn impasta! ",
      "Hope this brightens your day! ✨\n\nWhy did the scarecrow win an award?\n\nBecause he was outstanding in his field! ",
      "Time for some tech humor! 💻 Why do programmers prefer dark mode?\n\nBecause light attracts bugs! ",
    ],
  },
  time: {
    patterns: [/(what\s+time|current\s+time|time\s+is\s+it)/i],
    response: () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      const dateString = now.toLocaleDateString();
      return `🕐 **Current Time:** ${timeString}\n📅 **Today's Date:** ${dateString}\n\nHope you're having a great ${
        now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'
      }!`;
    },
  },
  date: {
    patterns: [/(what\s+date|today'?s\s+date|current\s+date)/i],
    responses: [
      `Today is ${new Date().toLocaleDateString()}! 📅 What's on your schedule?`,
      `The current date is ${new Date().toLocaleDateString()}. Got any big plans? `,
    ],
  },
  weather: {
    patterns: [/(weather|temperature|forecast|climate)/i],
    responses: [
      "I can't check real-time weather, but I suggest checking a weather app for the latest updates! ☀️🌧️",
      "For the most accurate weather info, try Weather.com or your favorite weather app! 🌤️",
    ],
  },
  motivation: {
    patterns: [/(motivate|inspire|motivation|inspiration|encourage|feeling\s+down|sad|tired)/i],
    responses: [
      " **You are capable of incredible things!** \n\nEvery challenge you face is making you stronger. Keep pushing forward - your breakthrough is closer than you think! 💪",
      " **Believe in yourself!** \n\nYou have unique talents and perspectives that the world needs. Every small step you take is progress worth celebrating! 🎉🚀",
      " **You've got this!** \n\nRemember: diamonds are formed under pressure, and you're becoming something brilliant. Stay focused on your goals! 💎",
      " **Keep shining!** \n\nYour potential is limitless. Every setback is a setup for a comeback. You're braver than you believe and stronger than you seem! ",
    ],
  },
  advice: {
    patterns: [/(advice|suggestion|recommend|should\s+i)/i],
    responses: [
      "Stay curious and keep learning! 📚 Small steps lead to big results. What's something new you'd like to explore?",
      "Take it one day at a time and celebrate your progress! 🎉 What's your next goal?",
      "Balance is key! Take care of yourself while chasing your dreams. ⚖️ Need help with anything specific?",
    ],
  },
  ai: {
    patterns: [/(artificial\s+intelligence|what\s+is\s+ai|about\s+ai|machine\s+learning)/i],
    responses: [
      "AI is technology that mimics human intelligence—learning, reasoning, and problem-solving! I'm a prime example.  What's your AI question?",
      "Artificial Intelligence is about smart systems that learn and adapt. Pretty cool, right?  Want to dive deeper?",
      "AI helps machines understand language, make decisions, and more. I'm an AI built to assist you!  What's next?",
    ],
  },
  fun_fact: {
    patterns: [/(tell\s+me\s+a\s+fact|fun\s+fact|interesting\s+fact)/i],
    responses: [
      "Did you know? Octopuses have three hearts and can change color to blend into their surroundings! 🐙 Want another?",
      "Fun fact: The shortest war in history lasted 38 minutes! ⚔️ What's another topic you're curious about?",
      "Honey never spoils! Archeologists found 3,000-year-old honey in Egyptian tombs, still edible! 🍯 Need more facts?",
    ],
  },
  learning: {
    patterns: [/(learn|study|education|school|teach\s+me|explain|how\s+does|what\s+is|why\s+does)/i],
    responses: [
      "I love helping people learn! 🎓✨\n\nWhat topic interests you? I can explain concepts in simple terms, provide examples, or dive deep into details. Learning is one of life's greatest adventures! 📚🚀",
      "Knowledge is power! 💡🧠\n\nI'm here to make learning fun and accessible. Whether it's science, history, math, or any other subject - let's explore together! What would you like to discover today?",
      "Great question! 🤔💭\n\nI believe the best learning happens through curiosity and conversation. Tell me what you're trying to understand, and I'll break it down in a way that makes sense to you!",
    ],
  },
  creator: {
    patterns: [
      /(who\s+(made|developed|built|created)\s+(you|this|chatbot)|who\s+is\s+your\s+(creator|developer|maker))/i,
      /who\s+made\s+you/i,
      /who\s+designed\s+you/i
    ],
    responses: [
      "I was crafted with care by **Mahmud Rahman** 🧠💻\n\nWant to know more? Check out his 🔗 portfolio: **[Portfolio](https://mahmudr.vercel.app/)** 🌐",
      "This intelligent assistant was developed by **Mahmud Rahman** — a passionate full-stack developer! 🔗 Visit: **[Website](https://devplus.fun/)**",
      "👨‍💻 My creator is **Mahmud Rahman**! He built me to help, chat, and inspire. Learn more about him here: 🔗 **[mahmud.me](https://gravatar.com/floawd)**",
    ],
  },
  math: {
    patterns: [/^(calculate|solve|what\s+is|compute|math|equation|problem)?[\s]*[\d\s+\-*/().^%]+[\s=?]*$/i],
    response: (input) => {
      try {
        const expression = input
          .replace(/^(calculate|solve|what\s+is|compute|math|equation|problem)\s*/i, '')
          .replace(/[=?]/g, '')
          .replace(/\^/g, '**')
          .trim();

        if (!expression || !/[\d+\-*/().]/.test(expression)) {
          return "Please provide a valid math expression! Try something like '2 + 3 * 4' or '(10 - 5) / 2' 🔢";
        }

        const result = Function('"use strict"; return (' + expression + ')')();

        if (!isNaN(result) && isFinite(result)) {
          const formattedResult = Number.isInteger(result) ? result : result.toFixed(6).replace(/\.?0+$/, '');
          return `🧮 **Calculation Result:**\n\n${expression} = **${formattedResult}**\n\nNeed help with another calculation?`;
        }

        throw new Error('Invalid result');
      } catch (error) {
        return "Hmm, that doesn't look like a valid math expression. 🤔\n\nTry something like:\n• 25 * 4 + 10\n• (100 - 25) / 5\n• 2^3 + 5";
      }
    },
  },
  question: {
    patterns: [/\?$/],
    responses: [
      "Great question! 🤔 Let me think... could you clarify a bit more?",
      "Interesting! 💭 Can you provide more details to help me answer?",
      "Love the curiosity! 😄 Could you rephrase or add some context?",
    ],
  },
  exclamation: {
    patterns: [/!$/],
    responses: [
      "Wow, you're excited! 😄 What's got you so pumped?",
      "That's the spirit! 🚀 Tell me more!",
      "Love the enthusiasm! 🌟 What's next?",
    ],
  },
};

const fuseOptions = {
  includeScore: true,
  threshold: 0.3,
  minMatchCharLength: 2,
  keys: ['patterns'],
};

const responseList = Object.entries(responses).map(([key, value]) => ({
  key,
  patterns: value.patterns.map((pattern) => pattern.source || pattern),
}));
const fuse = new Fuse(responseList, fuseOptions);

const getExactMatch = (input, responses) => {
  for (const key in responses) {
    if (key === 'question' || key === 'exclamation' || !responses[key].patterns) continue;

    const intent = responses[key];
    if (intent.patterns.some(pattern => pattern.test(input))) {
      return key;
    }
  }
  return null;
};

export const getEnhancedResponse = async (input, conversationHistory = []) => {
  const lowercaseInput = input.toLowerCase().trim();
  let bestMatchKey = null;

  bestMatchKey = getExactMatch(lowercaseInput, responses);

  if (!bestMatchKey) {
    const results = fuse.search(lowercaseInput);
    if (results.length > 0 && results[0].score < 0.4) {
      bestMatchKey = results[0].item.key;
    }
  }
  
  if (bestMatchKey) {
    const responseObj = responses[bestMatchKey];
    let responseText =
      typeof responseObj.response === 'function'
        ? responseObj.response(input)
        : responseObj.responses[Math.floor(Math.random() * responseObj.responses.length)];

    const hasAskedAboutCapabilities = conversationHistory.slice(-3).some(msg =>
      msg.text.toLowerCase().includes('what can you do')
    );
    if (responseObj.followUp && !hasAskedAboutCapabilities) {
      responseText += `\n\n💡 *${responseObj.followUp}*`;
    }
    
    return { text: responseText, key: bestMatchKey };
  }

  if (responses.question.patterns.some((pattern) => pattern.test(lowercaseInput))) {
    return { 
      text: responses.question.responses[Math.floor(Math.random() * responses.question.responses.length)],
      key: 'question'
    };
  }
  
  if (responses.exclamation.patterns.some((pattern) => pattern.test(lowercaseInput))) {
    return { 
      text: responses.exclamation.responses[Math.floor(Math.random() * responses.exclamation.responses.length)],
      key: 'exclamation'
    };
  }

  const fallbackText = "I'm not quite sure how to respond to that. 🤔 Could you try rephrasing? You can ask me to solve math problems, tell you a joke, or give you a fun fact!";
  return { text: fallbackText, key: 'fallback' };
};