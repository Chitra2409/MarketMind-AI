import React, { useState } from 'react';
import { Send, Sparkles, Clock, History, Lightbulb, Mic, MicOff } from 'lucide-react';

interface QueryInterfaceProps {
  onQuery: (query: string) => void;
}

export function QueryInterface({ onQuery }: QueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [queryHistory, setQueryHistory] = useState<string[]>([
    "What are the biggest pain points for users of Slack?",
    "How has Notion evolved their pricing model?",
    "Show me emerging trends in project management tools",
    "Analyze customer sentiment for Figma's recent updates",
    "Compare pricing strategies of top 5 CRM platforms"
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    
    // Add to history
    if (!queryHistory.includes(query)) {
      setQueryHistory(prev => [query, ...prev.slice(0, 9)]);
    }
    
    onQuery(query);
    
    // Simulate processing time
    setTimeout(() => {
      setIsLoading(false);
      setQuery('');
    }, 2000);
  };

  const suggestions = [
    "What are the biggest pain points for users of Slack?",
    "How has Notion evolved their pricing model in the last year?",
    "Show me emerging trends in project management tools",
    "Analyze customer sentiment for Figma's recent updates",
    "Compare pricing strategies of top 5 CRM platforms",
    "What new features did competitors launch this month?",
    "Identify market opportunities in AI productivity tools",
    "Track competitor hiring patterns in engineering",
    "Monitor social media sentiment for our product category",
    "Generate competitive analysis for Q1 planning"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      setQuery(suggestion);
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const clearQuery = () => {
    setQuery('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Ask Your Research Team</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about market trends, competitors, or customer sentiment..."
            className="w-full p-4 pr-20 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            rows={3}
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isListening ? "Listening..." : "Voice input"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                title="Clear query"
              >
                ×
              </button>
            )}
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              {isLoading ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </form>
      
      {queryHistory.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <History className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-500">Recent queries:</p>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {queryHistory.slice(0, 5).map((historyQuery, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(historyQuery)}
                className="text-left w-full p-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-all duration-200 truncate"
                disabled={isLoading}
              >
                "{historyQuery}"
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-gray-400" />
          <p className="text-sm text-gray-500">Try these examples:</p>
        </div>
        <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-left w-full p-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-all duration-200"
              disabled={isLoading}
            >
              "{suggestion}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}