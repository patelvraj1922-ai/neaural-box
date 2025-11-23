import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles, Zap, Shield, Terminal, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- API CONFIGURATION ---
const API_URL = "http://localhost:5000/api/chat";

const generateResponse = async (history, userMessage) => {
  try {
    // Create a simplified history format for the backend
    const historyPayload = history
      .filter(msg => msg.text && msg.id !== 1) // Filter out welcome message or empty ones
      .map(msg => ({
        role: msg.isUser ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: historyPayload
      })
    });

    if (!response.ok) throw new Error('Backend connection failed');

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error(error);
    return "Error: Could not connect to the Neural Core (Is the Python backend running?).";
  }
};

// --- COMPONENTS ---

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-slate-950">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] animate-grid-move" />
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse-slow" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse-slow delay-1000" />
    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-20" />
  </div>
);

const LoginScreen = ({ onJoin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onJoin(name);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="p-8 border border-white/10 rounded-2xl backdrop-blur-xl bg-white/5 shadow-2xl shadow-cyan-500/20 max-w-md w-full animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-slate-900 p-4 rounded-full border border-cyan-500/50">
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
          NEURAL CHAT
        </h1>
        <p className="text-slate-400 mb-8">Establish secure connection to the core.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Codename..."
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-white placeholder-slate-600 transition-all group-hover:border-white/20"
              autoFocus
            />
            <Terminal className="absolute right-3 top-3.5 w-5 h-5 text-slate-600 group-focus-within:text-cyan-500 transition-colors" />
          </div>
          
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            Initialize Link <Sparkles className="w-4 h-4" />
          </button>
        </form>
      </div>
      <p className="mt-8 text-xs text-slate-600 font-mono">SECURE PROTOCOL V.2.5 • ENCRYPTED</p>
    </div>
  );
};

const MessageBubble = ({ message, isUser, username }) => {
  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
          isUser 
            ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' 
            : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}>
          <span className="text-xs text-slate-500 mb-1 font-mono px-1">
            {isUser ? username : 'CORE AI'}
          </span>
          
          <div className={`px-4 py-3 rounded-2xl backdrop-blur-md border shadow-lg text-sm md:text-base leading-relaxed w-full overflow-hidden ${
            isUser
              ? 'bg-purple-600/20 border-purple-500/30 text-white rounded-tr-none'
              : 'bg-slate-800/40 border-white/10 text-slate-100 rounded-tl-none'
          }`}>
            {isUser ? (
              <div>{message.text}</div>
            ) : (
              // ReactMarkdown handles headers, lists, and tables (using remark-gfm)
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                className="prose prose-sm prose-invert max-w-none 
                  prose-headings:font-bold prose-headings:text-cyan-300
                  prose-p:leading-relaxed 
                  prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-white/10
                  prose-table:border-collapse prose-table:w-full prose-table:my-4
                  prose-th:border prose-th:border-slate-600 prose-th:bg-slate-700/50 prose-th:p-3 prose-th:text-left prose-th:text-cyan-400
                  prose-td:border prose-td:border-slate-600 prose-td:p-3
                  prose-strong:text-cyan-200"
              >
                {message.text}
              </ReactMarkdown>
            )}
          </div>
          
          <span className="text-[10px] text-slate-600 mt-1 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "System initialized. Welcome to the Neural Interface. How can I assist you today?", isUser: false, timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await generateResponse(messages, userMsg.text);
      
      const botMsg = {
        id: Date.now() + 1,
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        text: "Critical Error: Connection to mainframe severed.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = `
    @keyframes grid-move { 0% { background-position: 0 0; } 100% { background-position: 4rem 4rem; } }
    @keyframes pulse-slow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
    @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    .animate-grid-move { animation: grid-move 20s linear infinite; }
    .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
    .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
    .animate-fade-in { animation: fade-in 0.3s ease-out; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
  `;

  return (
    <div className="relative w-full min-h-screen font-sans text-slate-200 bg-slate-950 selection:bg-cyan-500/30 selection:text-cyan-200">
      <style>{styles}</style>
      <AnimatedBackground />

      {!user ? (
        <LoginScreen onJoin={setUser} />
      ) : (
        <div className="relative z-10 flex flex-col h-screen max-w-5xl mx-auto">
          <header className="flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-white/5 bg-slate-900/50 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
              <h1 className="font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                NEURAL<span className="font-light text-slate-400">LINK</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-500">
                <Shield className="w-3 h-3" />
                <span>SECURE // ENCRYPTED</span>
              </div>
              <div className="px-3 py-1 text-xs font-bold text-slate-300 bg-white/5 rounded-full border border-white/10">
                {user}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 scroll-smooth">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isUser={msg.isUser} username={user} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-cyan-400 text-sm animate-pulse ml-12">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-mono text-xs">PROCESSING DATA STREAM...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </main>

          <div className="p-4 md:p-6 backdrop-blur-xl border-t border-white/5 bg-slate-900/80">
            <form onSubmit={handleSendMessage} className="relative flex items-center max-w-4xl mx-auto gap-2">
              <div className="relative flex-1 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-200 blur"></div>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your directive here..."
                  className="relative w-full bg-slate-900 border border-white/10 rounded-xl py-4 pl-5 pr-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
              </div>
              <button type="submit" disabled={!inputText.trim() || isLoading} className="relative p-4 bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all transform hover:scale-105 disabled:opacity-50">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}