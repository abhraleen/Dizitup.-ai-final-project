import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, X, MessageCircle, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackUserAction } from "@/utils/analytics";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const DiziChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for openChatbot event
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
      trackUserAction("open_chatbot");
    };

    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => {
      window.removeEventListener('openChatbot', handleOpenChatbot);
    };
  }, []);

  // Initial greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            text: "Hey there 👋, I'm Dizi — your AI business partner. What are we scaling today?",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
        trackUserAction("chatbot_greeting_displayed");
      }, 500);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    trackUserAction("user_message_sent", { messageLength: inputValue.length });
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      generateBotResponse(inputValue);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userInput: string) => {
    let response = "";

    // Simple response logic based on keywords
    if (userInput.toLowerCase().includes("hello") || userInput.toLowerCase().includes("hi")) {
      response = "Hello there! I'm Dizi, your AI business partner. How can I help you scale your business today?";
    } else if (userInput.toLowerCase().includes("service") || userInput.toLowerCase().includes("offer")) {
      response = "We offer AI-powered digital marketing, workflow automation, website development, video editing, and creative design services. Which one interests you the most?";
    } else if (userInput.toLowerCase().includes("price") || userInput.toLowerCase().includes("cost")) {
      response = "We have flexible pricing plans based on credits. Would you like to hear about our Free Trial, Starter, or Enterprise plans?";
    } else if (userInput.toLowerCase().includes("free") || userInput.toLowerCase().includes("trial")) {
      response = "Our Free Trial gives you 100 credits to use our AI tools for 3 days. It's a great way to experience our services!";
    } else if (userInput.toLowerCase().includes("starter")) {
      response = "Our Starter Plan is ₹2,999/month (or $49) and includes 1,000 credits per month with priority AI support. Would you like to know more?";
    } else if (userInput.toLowerCase().includes("enterprise")) {
      response = "Our Enterprise Plan is ₹9,999/month (or $199) and includes 5,000 credits per month, a dedicated project manager, and premium delivery speed. Perfect for larger businesses!";
    } else if (userInput.toLowerCase().includes("credit")) {
      response = "Credits are used to access our AI tools and services. Each action consumes a certain number of credits. Want to know how many credits each service uses?";
    } else if (userInput.toLowerCase().includes("thank")) {
      response = "You're welcome! Is there anything else I can help you with?";
    } else if (userInput.toLowerCase().includes("bye") || userInput.toLowerCase().includes("goodbye")) {
      response = "Goodbye! Feel free to chat with me anytime if you have more questions. Have a great day!";
    } else {
      // Default responses
      const defaultResponses = [
        "That's interesting! Can you tell me more about your business goals?",
        "I understand. How can our AI solutions help you achieve that?",
        "Great question! Our AI platform can definitely help with that. Would you like me to show you how?",
        "I'm here to help you scale your business. What specific challenges are you facing?",
        "Our AI tools are designed to solve exactly that kind of challenge. Would you like to try our free trial?",
        "That's a common goal for many businesses. Our Enterprise plan might be perfect for you. Shall I tell you more about it?",
      ];
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    const botMessage: Message = {
      id: Date.now().toString(),
      text: response,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    trackUserAction("bot_response_sent", { responseLength: response.length });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-lg hover:shadow-xl transition-all duration-300"
              size="icon"
            >
              <MessageCircle className="h-8 w-8 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] max-h-[600px] flex flex-col bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-red-500/30 bg-gradient-to-r from-red-900/20 to-red-800/20">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Dizi</h3>
                  <p className="text-xs text-red-300">AI Business Partner</p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setIsOpen(false);
                  trackUserAction("close_chatbot");
                }}
                variant="ghost"
                size="icon"
                className="text-red-300 hover:text-white hover:bg-red-500/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-red-600 text-white rounded-br-none"
                          : "bg-red-900/30 text-white rounded-bl-none border border-red-500/30"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === "bot" && (
                          <Bot className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        {message.sender === "user" && (
                          <User className="h-5 w-5 text-red-200 flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-red-900/30 text-white rounded-2xl rounded-bl-none border border-red-500/30 px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-red-400" />
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-red-400 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="h-2 w-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-red-500/30 bg-black/50">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full bg-black/50 border border-red-500/30 rounded-2xl px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                    rows={1}
                    style={{ minHeight: "44px", maxHeight: "120px" }}
                  />
                </div>
                <Button
                  onClick={handleSend}
                  disabled={inputValue.trim() === ""}
                  className="h-11 w-11 rounded-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                  size="icon"
                >
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </div>
              <p className="text-xs text-red-300/50 mt-2 text-center">
                Dizi is an AI assistant. Responses may vary.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DiziChatbot;