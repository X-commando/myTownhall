'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MunicipalityData {
  name: string;
  state: string;
  population: number;
  zipCode: string;
  budget?: {
    year: number;
    totalBudget: number;
    categories: Array<{
      name: string;
      amount: number;
      color: string;
    }>;
  };
  meetings: Array<{
    title: string;
    date: string;
    time: string;
    committee: string;
    status: string;
    agendaItems: Array<{
      content: string;
      order: number;
    }>;
  }>;
  forumThreads: Array<{
    title: string;
    content: string;
    author: string;
    upvotes: number;
    downvotes: number;
    createdAt: string;
  }>;
}

interface MunicipalityChatbotProps {
  municipalityData: MunicipalityData;
  isOpen: boolean;
  onToggle: () => void;
}

export default function MunicipalityChatbot({ 
  municipalityData, 
  isOpen, 
  onToggle 
}: MunicipalityChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hi! I'm your ${municipalityData.name} assistant. I can help you find information about budgets, meetings, community discussions, and more. What would you like to know?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [municipalityData.name, messages.length]);

  const generateSystemPrompt = () => {
    const budgetInfo = municipalityData.budget 
      ? `\n\nBudget Information (${municipalityData.budget.year}):
- Total Budget: $${(municipalityData.budget.totalBudget / 1000000).toFixed(1)}M
- Budget Categories: ${municipalityData.budget.categories.map(c => `${c.name}: $${(c.amount / 1000000).toFixed(1)}M`).join(', ')}`
      : '';

    const meetingsInfo = municipalityData.meetings.length > 0
      ? `\n\nRecent Meetings:
${municipalityData.meetings.slice(0, 5).map(m => `- ${m.title} (${m.committee}) - ${new Date(m.date).toLocaleDateString()} - ${m.status}`).join('\n')}`
      : '';

    const forumInfo = municipalityData.forumThreads.length > 0
      ? `\n\nCommunity Discussions:
${municipalityData.forumThreads.slice(0, 5).map(t => `- ${t.title} by ${t.author} (${t.upvotes} upvotes)`).join('\n')}`
      : '';

    return `You are a helpful assistant for ${municipalityData.name}, ${municipalityData.state}. You have access to the following information about this municipality:

Municipality Details:
- Name: ${municipalityData.name}
- State: ${municipalityData.state}
- Population: ${municipalityData.population.toLocaleString()}
- ZIP Code: ${municipalityData.zipCode}${budgetInfo}${meetingsInfo}${forumInfo}

Your role is to help citizens understand their local government by answering questions about:
1. Budget information and spending priorities
2. Upcoming and past meetings
3. Community discussions and engagement
4. General information about the municipality

Be conversational, helpful, and accurate. If you don't have information about something, say so rather than making things up. Always be encouraging about civic engagement and transparency.`;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemPrompt: generateSystemPrompt(),
          municipalityName: municipalityData.name
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What's the current budget breakdown?",
    "When are the next council meetings?",
    "What are people discussing in the community?",
    "How much is spent on public safety?",
    "What's the population and demographics?"
  ];

  return (
    <>
      {/* Chat Toggle Button with Pulse, Tooltip, and AI Badge */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onToggle}
            className={`fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-all duration-300 group
            ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}
            animate-pulse-soft
          `}
            size="lg"
            style={{ boxShadow: '0 0 0 4px rgba(16,185,129,0.10)' }}
          >
            <span className="relative flex items-center">
              <Bot className="w-5 h-5" />
              <span className="ml-2 text-xs font-semibold bg-emerald-500 text-white rounded px-1.5 py-0.5 shadow-sm opacity-90">AI</span>
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" align="center">
          Ask the AI Assistant
        </TooltipContent>
      </Tooltip>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <h3 className="font-semibold">{municipalityData.name} Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <Bot className="w-4 h-4 text-primary" />
                    )}
                    <div className="text-sm">{message.content}</div>
                    {message.role === 'user' && (
                      <User className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <Loader2 className="w-4 animate-spin text-primary" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-1">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(question);
                      setTimeout(() => sendMessage(), 100);
                    }}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your municipality..."
                className="flex-1 disabled:opacity-50"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 