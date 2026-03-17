import React, { useState, useRef, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Use environment variable only - no fallback to prevent API key exposure
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Debug logging (remove in production)
console.log('[Chatbot] API Key available:', !!GEMINI_API_KEY);
console.log('[Chatbot] API Key length:', GEMINI_API_KEY?.length || 0);

function AIChatbot({ user, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Health Assistant powered by Gemini. I can help answer your health-related questions, provide general medical information, and guide you on when to seek professional care. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const genAI = useRef(null);

  useEffect(() => {
    // Initialize Gemini AI
    try {
      console.log('[Chatbot] Initializing Gemini AI...');
      console.log('[Chatbot] Environment check:', {
        hasApiKey: !!GEMINI_API_KEY,
        keyLength: GEMINI_API_KEY?.length || 0,
        nodeEnv: process.env.NODE_ENV
      });
      
      if (!GEMINI_API_KEY) {
        console.error('[Chatbot] REACT_APP_GEMINI_API_KEY environment variable is not set');
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I apologize, but the AI chatbot is not properly configured. The API key is missing from the environment variables. Please restart the development server after adding the API key to your .env file.'
        }]);
        return;
      }
      
      genAI.current = new GoogleGenerativeAI(GEMINI_API_KEY);
      console.log('[Chatbot] Gemini AI initialized successfully');
    } catch (error) {
      console.error('[Chatbot] Failed to initialize Gemini AI:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I apologize, but there was an error initializing the AI chatbot: ${error.message}. Please try refreshing the page or contact support.`
      }]);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      console.log('[Chatbot] Sending message:', userMessage);
      
      // Check if API key is available
      if (!GEMINI_API_KEY) {
        throw new Error('API key not configured. Please contact administrator.');
      }
      
      // Check if API is initialized
      if (!genAI.current) {
        throw new Error('Gemini AI not initialized');
      }

      // Get Gemini model (current recommended flash model)
      const model = genAI.current.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
      });
      
      // Create health-focused prompt
      const prompt = `You are a helpful AI health assistant. Answer this health question accurately and empathetically:

Question: ${userMessage}

Guidelines:
- Provide clear, accurate health information
- Be supportive and understanding
- Remind users you're not a replacement for professional medical advice
- Suggest consulting healthcare providers for serious concerns
- If discussing symptoms, mention appropriate medical specializations
- Keep responses concise (2-3 paragraphs maximum)

Answer:`;

      console.log('[Chatbot] Generating response...');
      
      // Generate response
      const result = await model.generateContent(prompt);
      
      console.log('[Chatbot] Result received:', result);
      
      // Check if response exists
      if (!result || !result.response) {
        throw new Error('No response from Gemini API');
      }
      
      const response = result.response;
      
      // Check for blocked content
      if (response.promptFeedback && response.promptFeedback.blockReason) {
        throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
      }
      
      // Get text from response
      const text = response.text();
      
      console.log('[Chatbot] Response text:', text);

      if (!text || text.trim() === '') {
        throw new Error('Empty response from Gemini API');
      }

      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      
    } catch (error) {
      console.error('[Chatbot] Error details:', error);
      
      let errorMessage = 'I apologize, but I encountered an error processing your request. ';
      
      if (error.message.includes('API key')) {
        errorMessage += 'There seems to be an issue with the API configuration. ';
      } else if (error.message.includes('quota')) {
        errorMessage += 'The API quota has been exceeded. ';
      } else if (error.message.includes('blocked')) {
        errorMessage += 'The content was blocked by safety filters. ';
      } else if (error.message.includes('network')) {
        errorMessage += 'There was a network connection issue. ';
      }
      
      if (error.message) {
        errorMessage += ` Details: ${error.message}. `;
      }
      
      errorMessage += 'Please try again or consult with a healthcare professional for medical advice.';
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'What are common symptoms of flu?',
    'When should I see a doctor?',
    'How to manage stress?',
    'Tips for better sleep',
    'Healthy diet recommendations'
  ];

  const handleQuickQuestion = async (question) => {
    if (loading) return;
    
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      console.log('[Chatbot] Sending quick question:', question);
      
      // Check if API key is available
      if (!GEMINI_API_KEY) {
        throw new Error('API key not configured. Please contact administrator.');
      }
      
      // Check if API is initialized
      if (!genAI.current) {
        throw new Error('Gemini AI not initialized');
      }

      // Get Gemini model (current recommended flash model)
      const model = genAI.current.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
      });
      
      // Create health-focused prompt
      const prompt = `You are a helpful AI health assistant. Answer this health question accurately and empathetically:

Question: ${question}

Guidelines:
- Provide clear, accurate health information
- Be supportive and understanding
- Remind users you're not a replacement for professional medical advice
- Suggest consulting healthcare providers for serious concerns
- If discussing symptoms, mention appropriate medical specializations
- Keep responses concise (2-3 paragraphs maximum)

Answer:`;

      console.log('[Chatbot] Generating response...');
      
      // Generate response
      const result = await model.generateContent(prompt);
      
      console.log('[Chatbot] Result received');
      
      // Check if response exists
      if (!result || !result.response) {
        throw new Error('No response from Gemini API');
      }
      
      const response = result.response;
      
      // Check for blocked content
      if (response.promptFeedback && response.promptFeedback.blockReason) {
        throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
      }
      
      // Get text from response
      const text = response.text();

      if (!text || text.trim() === '') {
        throw new Error('Empty response from Gemini API');
      }

      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      
    } catch (error) {
      console.error('[Chatbot] Error details:', error);
      
      let errorMessage = 'I apologize, but I encountered an error processing your request. ';
      
      if (error.message.includes('API key')) {
        errorMessage += 'There seems to be an issue with the API configuration. ';
      } else if (error.message.includes('quota')) {
        errorMessage += 'The API quota has been exceeded. ';
      } else if (error.message.includes('blocked')) {
        errorMessage += 'The content was blocked by safety filters. ';
      } else if (error.message.includes('network')) {
        errorMessage += 'There was a network connection issue. ';
      }
      
      if (error.message) {
        errorMessage += ` Details: ${error.message}. `;
      }
      
      errorMessage += 'Please try again or consult with a healthcare professional for medical advice.';
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chatbot-fullscreen">
      <div className="ai-chatbot-container">
        {/* Header */}
        <div className="ai-chatbot-header">
          <div className="ai-chatbot-header-left">
            <div className="ai-chatbot-avatar">
              <i className="bi bi-robot"></i>
            </div>
            <div className="ai-chatbot-title">
              <h5>AI Health Assistant</h5>
              <p>Powered by Gemini AI</p>
            </div>
          </div>
          <Button 
            variant="link" 
            className="ai-chatbot-close-btn"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        </div>

        {/* Messages */}
        <div className="ai-chatbot-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`ai-message ${message.role === 'user' ? 'user' : 'assistant'}`}
            >
              <div className="ai-message-avatar">
                <i className={`bi ${message.role === 'user' ? 'bi-person-fill' : 'bi-robot'}`}></i>
              </div>
              <div className="ai-message-content">
                <div className="ai-message-bubble">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="ai-message assistant">
              <div className="ai-message-avatar">
                <i className="bi bi-robot"></i>
              </div>
              <div className="ai-message-content">
                <div className="ai-message-bubble">
                  <div className="ai-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="ai-quick-questions">
            <p className="ai-quick-title">Quick questions:</p>
            <div className="ai-quick-buttons">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className="ai-quick-btn"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="ai-chatbot-input-area">
          <div className="ai-chatbot-input">
            <Form.Control
              as="textarea"
              rows={1}
              placeholder="Ask me anything about health..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="ai-input-field"
            />
            <Button 
              variant="primary" 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="ai-send-btn"
            >
              <i className="bi bi-send-fill"></i>
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="ai-chatbot-disclaimer">
            <i className="bi bi-info-circle"></i>
            <span>AI responses are for informational purposes only. Consult a healthcare professional for medical advice.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChatbot;
