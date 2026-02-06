import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { apiService } from '../services/apiService';
import ReactMarkdown from 'react-markdown';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Olá! Sou a IA oficial do **Valor Precatórios**. Selecione um tema abaixo ou digite sua dúvida:',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Quero uma Avaliação 💲",
    "Como funciona o pagamento?",
    "Quanto tempo demora?",
    "É seguro vender?",
    "Quais documentos precisa?",
    "O que é Precatório?",
    "Compram RPV?",
    "Falar com atendente"
  ];

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend: string = input) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => !m.isError)
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const reader = await apiService.sendMessageStream(history, userMessage.text);
      const decoder = new TextDecoder();
      
      let fullResponse = "";
      const botMessageId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
        id: botMessageId,
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        // Limpeza aprimorada do protocolo SSE do Java (Data: content)
        const cleanChunk = chunk
            .split('\n')
            .filter(line => line.startsWith('data:'))
            .map(line => line.replace(/^data: ?/, ''))
            .join('');
        
        fullResponse += cleanChunk;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, text: fullResponse }
            : msg
        ));
        
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }

    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: '⚠️ Ocorreu uma instabilidade na conexão. Tente novamente ou chame no WhatsApp.',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shadow-sm z-10">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Bot className="text-blue-600" />
          Assistente Jurídico
        </h2>
        <p className="text-sm text-slate-500">Disponível 24h para tirar dúvidas.</p>
      </div>

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 scroll-smooth"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>

              <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'} ${msg.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}`}>
                 {msg.role === 'model' ? (
                    <div className="markdown prose prose-sm max-w-none">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                 ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input & Quick Actions */}
      <div className="bg-white border-t border-slate-200">
        <div className="px-4 pt-3 pb-1 overflow-x-auto flex gap-2 scrollbar-hide">
            {quickQuestions.map((q, idx) => (
                <button 
                    key={idx}
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                    className="flex-shrink-0 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-2 rounded-full border border-blue-100 transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                    <Sparkles size={12} />
                    {q}
                </button>
            ))}
        </div>

        <div className="p-4">
            <div className="max-w-4xl mx-auto relative flex items-end gap-2">
            <div className="flex-1 relative">
                <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua dúvida..."
                className="w-full p-3 pr-10 bg-slate-100 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl resize-none outline-none text-slate-800 max-h-32 min-h-[56px] transition-all"
                rows={1}
                disabled={isLoading}
                />
            </div>
            <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-xl flex items-center justify-center transition-colors ${
                !input.trim() || isLoading
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                }`}
            >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">
            A IA pode cometer erros. Verifique informações importantes com um advogado humano.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;