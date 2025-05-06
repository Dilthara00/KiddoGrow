import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import chatbotMessages from "../components/messages";
import assistantAvatar from "../assets/assistant.png";
import chatbotIcon from "../assets/assistant.png";
import {
  FaTimes,
  FaPaperPlane,
  FaUser,
  FaBook,
  FaGamepad,
  FaMusic,
  FaPaintBrush,
  FaSmile,
  FaCog,
  FaHistory,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    favoriteColor: "pink",
    interests: ["games", "drawing"],
    age: "5-7",
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const divRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    }

    const savedPrefs = localStorage.getItem("userPreferences");
    if (savedPrefs) {
      setUserPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getResponse = async (input) => {
    // Check predefined messages first
    const message = chatbotMessages.find(
      (msg) => msg.prompt.toLowerCase() === input.toLowerCase()
    )?.message;

    if (message) {
      return message;
    }

    // Check for kid-friendly responses
    if (input.toLowerCase().includes("how are you")) {
      return "I'm super happy today! 😊 How about you?";
    }

    if (input.toLowerCase().includes("favorite color")) {
      return `My favorite color is ${userPreferences.favoriteColor} too! It's such a happy color! 🌈`;
    }

    // Check for game request
    if (
      input.toLowerCase().includes("play") ||
      input.toLowerCase().includes("game")
    ) {
      return "Let's play a game! I can tell you a riddle:\n\nWhat has to be broken before you can use it? (Reply with your guess!)";
    }

    try {
      // Enhanced prompt with kid context
      const enhancedPrompt = `You are talking to a child aged ${
        userPreferences.age
      } who likes ${userPreferences.interests.join(", ")}. 
      Respond to this in a fun, simple way with emojis: ${input}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=`,
        {
          contents: [{ parts: [{ text: enhancedPrompt }] }],
        }
      );
      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Hmm, I'm not sure about that. Let's talk about something else! 😊"
      );
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Oops! I'm having trouble thinking right now. Can you ask me again? 😅";
    }
  };

  const generateRiddle = () => {
    const riddles = [
      {
        question: "What has hands but can't clap?",
        answer: "A clock! ⏰",
      },
      {
        question: "What gets wetter the more it dries?",
        answer: "A towel! 🧺",
      },
      {
        question: "What has a head, a tail, but no body?",
        answer: "A coin! 💰",
      },
    ];

    const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
    return `RIDDLE TIME! 🤔\n\n${randomRiddle.question}\n\n(Reply with your guess or say 'answer' to know!)`;
  };

  const handleScrollToBottom = () => {
    if (divRef.current) {
      setTimeout(() => {
        divRef.current.scrollTop = divRef.current.scrollHeight;
      }, 100);
    }
  };

  const sendMessage = async (messageText) => {
    const userMessage = {
      text: messageText,
      fromUser: true,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const botResponseText = await getResponse(messageText);
    const botMessage = {
      text: botResponseText,
      fromUser: false,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const messageToSend = input;
    setInput("");
    await sendMessage(messageToSend);
  };

  const handleQuickAction = async (text) => {
    await sendMessage(text);
  };

  const updatePreferences = (key, value) => {
    const newPrefs = { ...userPreferences };
    if (Array.isArray(newPrefs[key])) {
      // Toggle array values
      const index = newPrefs[key].indexOf(value);
      if (index === -1) {
        newPrefs[key].push(value);
      } else {
        newPrefs[key].splice(index, 1);
      }
    } else {
      newPrefs[key] = value;
    }

    setUserPreferences(newPrefs);
    localStorage.setItem("userPreferences", JSON.stringify(newPrefs));
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  useEffect(() => {
    handleScrollToBottom();
  }, [messages]);

  return (
    <>
      {!isChatbotOpen && (
        <motion.div
          onClick={() => setIsChatbotOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            cursor: "pointer",
            zIndex: 50,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={chatbotIcon}
            alt="Chat Icon"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              boxShadow: "0 4px 8px rgba(255, 105, 180, 0.3)",
              border: "2px solid #ff69b4",
            }}
          />
        </motion.div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          maxWidth: "28rem",
          width: "100%",
          height: "500px",
          zIndex: 50,
          transition: "transform 300ms ease-in-out",
          transform: isChatbotOpen ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff0f5",
            boxShadow: "0 4px 20px rgba(255, 105, 180, 0.2)",
            borderRadius: "1.5rem 1.5rem 0 0",
            border: "2px solid #ffb6c1",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #ff69b4, #ff1493)",
              padding: "1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#ffffff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={assistantAvatar}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
                alt="Bot"
              />
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  letterSpacing: "0.025em",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                Kids Fun Buddy 🤗
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowHistory(!showHistory)}
                style={{
                  color: "#ffffff",
                  opacity: 0.8,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Chat History"
              >
                <FaHistory />
              </button>
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                style={{
                  color: "#ffffff",
                  opacity: 0.8,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Preferences"
              >
                <FaCog />
              </button>
              <button
                onClick={() => setIsChatbotOpen(false)}
                style={{
                  color: "#ffffff",
                  opacity: 0.8,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Preferences Panel */}
          {showPreferences && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                backgroundColor: "#ffebee",
                padding: "1rem",
                borderBottom: "1px solid #ffb6c1",
              }}
            >
              <h3
                style={{
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "#ff1493",
                }}
              >
                My Favorite Things
              </h3>

              <div style={{ marginBottom: "0.75rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
                    color: "#ff69b4",
                  }}
                >
                  Favorite Color
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["pink", "purple", "blue", "green", "yellow"].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() =>
                          updatePreferences("favoriteColor", color)
                        }
                        style={{
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.75rem",
                          borderRadius: "9999px",
                          backgroundColor:
                            userPreferences.favoriteColor === color
                              ? "#ff69b4"
                              : "#ffffff",
                          color:
                            userPreferences.favoriteColor === color
                              ? "#ffffff"
                              : "#ff69b4",
                          border: `1px solid ${
                            userPreferences.favoriteColor === color
                              ? "#ff69b4"
                              : "#ffb6c1"
                          }`,
                        }}
                      >
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
                    color: "#ff69b4",
                  }}
                >
                  Age Group
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["3-5", "5-7", "7-9", "9-12"].map((age) => (
                    <button
                      key={age}
                      onClick={() => updatePreferences("age", age)}
                      style={{
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.75rem",
                        borderRadius: "9999px",
                        backgroundColor:
                          userPreferences.age === age ? "#ff69b4" : "#ffffff",
                        color:
                          userPreferences.age === age ? "#ffffff" : "#ff69b4",
                        border: `1px solid ${
                          userPreferences.age === age ? "#ff69b4" : "#ffb6c1"
                        }`,
                      }}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
                    color: "#ff69b4",
                  }}
                >
                  Things I Like
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["games", "drawing", "music", "stories", "animals"].map(
                    (interest) => (
                      <button
                        key={interest}
                        onClick={() => updatePreferences("interests", interest)}
                        style={{
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.75rem",
                          borderRadius: "9999px",
                          backgroundColor: userPreferences.interests.includes(
                            interest
                          )
                            ? "#ff69b4"
                            : "#ffffff",
                          color: userPreferences.interests.includes(interest)
                            ? "#ffffff"
                            : "#ff69b4",
                          border: `1px solid ${
                            userPreferences.interests.includes(interest)
                              ? "#ff69b4"
                              : "#ffb6c1"
                          }`,
                        }}
                      >
                        {interest.charAt(0).toUpperCase() + interest.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* History Panel */}
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                backgroundColor: "#ffebee",
                padding: "1rem",
                borderBottom: "1px solid #ffb6c1",
                maxHeight: "160px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <h3 style={{ fontWeight: 600, color: "#ff1493" }}>Our Chat</h3>
                <button
                  onClick={clearChatHistory}
                  style={{
                    fontSize: "0.75rem",
                    color: "#ff69b4",
                  }}
                >
                  Clear Chat
                </button>
              </div>
              {messages.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "#ff69b4" }}>
                  No messages yet! Say hi! 👋
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {messages
                    .filter((m) => m.fromUser)
                    .slice(-5)
                    .map((msg, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setInput(msg.text);
                          setShowHistory(false);
                        }}
                        style={{
                          fontSize: "0.875rem",
                          padding: "0.5rem",
                          backgroundColor: "#ffffff",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          border: "1px solid #ffb6c1",
                          color: "#ff1493",
                        }}
                      >
                        {msg.text}
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Chat Body */}
          <div
            ref={divRef}
            style={{
              flex: 1,
              backgroundColor: "#fff0f5",
              padding: "0.75rem 1rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Welcome Banner */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "linear-gradient(to right, #ffb6c1, #ff69b4)",
                  color: "#ffffff",
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textAlign: "center",
                  boxShadow: "0 4px 6px rgba(255, 105, 180, 0.1)",
                }}
              >
                🎉 Hi Friend! I'm your Kids Fun Buddy! 🤗
                <br />
                Let's chat, play games, and have fun together! 🎨🎵
              </motion.div>
            )}

            {/* Quick Action Buttons */}
            {messages.length === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  paddingTop: "8px",
                }}
              >
                <button
                  onClick={() => handleQuickAction("Tell me a story")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ffffff",
                    border: "1px solid #ffb6c1",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 2px rgba(255, 105, 180, 0.1)",
                    fontSize: "0.875rem",
                    color: "#ff1493",
                  }}
                >
                  <FaBook /> Tell me a story
                </button>
                <button
                  onClick={() => handleQuickAction("Let's play a game")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ffffff",
                    border: "1px solid #ffb6c1",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 2px rgba(255, 105, 180, 0.1)",
                    fontSize: "0.875rem",
                    color: "#ff1493",
                  }}
                >
                  <FaGamepad /> Let's play a game
                </button>
                <button
                  onClick={() => handleQuickAction("Sing me a song")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ffffff",
                    border: "1px solid #ffb6c1",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 2px rgba(255, 105, 180, 0.1)",
                    fontSize: "0.875rem",
                    color: "#ff1493",
                  }}
                >
                  <FaMusic /> Sing me a song
                </button>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.fromUser ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem",
                    borderRadius: "1rem",
                    maxWidth: "75%",
                    fontSize: "0.875rem",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    backgroundColor: msg.fromUser ? "#ffffff" : "#ff69b4",
                    color: msg.fromUser ? "#ff1493" : "#ffffff",
                    border: msg.fromUser ? "1px solid #ffb6c1" : "none",
                  }}
                >
                  {msg.text.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                  <p
                    style={{
                      fontSize: "10px",
                      marginTop: "4px",
                      textAlign: "right",
                      opacity: 0.6,
                      color: msg.fromUser ? "#ff69b4" : "#ffffff",
                    }}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    backgroundColor: "#ff69b4",
                    color: "#ffffff",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 20, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                    }}
                  >
                    ✏️
                  </motion.div>
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem 1rem",
              borderTop: "1px solid #ffb6c1",
              backgroundColor: "#fff0f5",
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={{
                flex: 1,
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                backgroundColor: "#ffffff",
                border: "1px solid #ffb6c1",
                borderRadius: "0.5rem",
                outline: "none",
                color: "#ff1493",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: "0.75rem",
                backgroundColor: "#ff69b4",
                color: "#ffffff",
                borderRadius: "9999px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                border: "none",
              }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
