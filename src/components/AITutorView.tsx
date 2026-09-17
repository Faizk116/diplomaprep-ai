import React, { useState, useRef, useEffect } from 'react';
import { Question, ChatMessage, ASSETS, AppScreen, Subject } from '../types';
import { aiTutorService } from '../api/services';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  Check, 
  FileText, 
  HelpCircle, 
  BookOpen,
  Pin,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Loader2,
  Trash2
} from 'lucide-react';

interface AITutorViewProps {
  subject?: Subject;
  activeQuestion?: Question;
  onReturnToMCQ: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  subject,
  activeQuestion,
  onReturnToMCQ,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load chat history from backend
  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      try {
        const history = await aiTutorService.getHistory();
        if (isMounted && history && history.length > 0) {
          setMessages(history);
        } else if (isMounted) {
          // Default initial welcome message if history empty
          setMessages([
            {
              id: 'msg-1',
              sender: 'user',
              text: 'Explain planning in simple language with a real-life engineering college example.',
              timestamp: '11:43 AM',
            },
            {
              id: 'msg-2',
              sender: 'tutor',
              text: `Planning simply means **thinking before acting**. It is the baseline function of management where you determine in advance what to do, how to do it, when to do it, and who will do it.

### 🎓 Engineering College Real-Life Example: Final Year Capstone Project
Imagine your TY Diploma project team needs to build an **IoT-based Solar Monitoring System** before the April external viva:

1. **Setting Objectives**: Target to demonstrate a functioning prototype to the external examiner and score $>90\\%$ in project marks.
2. **Developing Premises**: Assuming cloud server costs will be within $\\text{₹}500$ and Arduino sensors will arrive in 4 days.
3. **Identifying Alternatives**: Choosing between ESP32 (built-in Wi-Fi) versus Arduino Uno + external Wi-Fi shield.
4. **Evaluating Alternatives**: ESP32 is cheaper and requires less PCB breadboard wiring.
5. **Formulating Derivative Plans**: Deciding who writes the C++ firmware (Pooja) and who writes the project documentation report.

> **High-Yield MSBTE Takeaway**: According to Henry Fayol, planning is the primary function upon which organizing, staffing, directing, and controlling are built. Without planning, other functions have no roadmap!`,
              timestamp: '11:43 AM',
              suggestedAction: 'Generate practice question on Planning Steps',
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    }
    loadHistory();
    return () => { isMounted = false; };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    try {
      const res = await aiTutorService.sendMessage(text, {
        subjectId: subject?.id,
        questionId: activeQuestion?.id,
      });

      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: res.responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: res.suggestions?.[0] || 'Generate practice question ->',
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `tutor-err-${Date.now()}`,
        sender: 'tutor',
        text: `Sorry, I encountered an issue: ${err.message || 'Unable to connect to AI engine.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetHistory = async () => {
    try {
      await aiTutorService.resetHistory();
      setMessages([]);
    } catch (err) {
      console.error('Failed to reset history:', err);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm font-display">
                  AI Tutor (v3.4 Syllabus Core)
                </span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  MSBTE Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Ask anything about {subject?.title || 'Subject'}: {activeQuestion?.unitName || 'Curriculum Concepts'} ({activeQuestion?.code || 'MSBTE I-Scheme'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetHistory}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 text-xs font-medium transition-colors inline-flex items-center gap-1"
              title="Reset Chat History"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Thread</span>
            </button>
            <button
              onClick={onReturnToMCQ}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors inline-flex items-center gap-1"
            >
              <span>Return to MCQ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: 2-Column Split View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Context, Question Preview & Hotlinked Diagram */}
        <div className="lg:col-span-4 space-y-5">
          {/* Active Question Context Tile */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
              <Pin className="w-3.5 h-3.5 text-blue-600" />
              <span>Context: MSBTE I-Scheme ({subject?.code || (activeQuestion?.code.includes('22447') ? '22447' : '22509')})</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              {activeQuestion?.unitName ? `Unit ${activeQuestion.unitId}: ${activeQuestion.unitName}` : 'Unit 2: Planning & Decision Making'}
            </h3>

            {/* Active Question Preview */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex justify-between items-center mb-1 text-[11px] font-bold">
                <span className="text-slate-600">{activeQuestion?.code || 'Question 07'}</span>
                <span className="text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded font-semibold">
                  {activeQuestion?.topic || 'Curriculum Topic'}
                </span>
              </div>
              <p className="text-slate-700 line-clamp-2">
                "{activeQuestion?.question || 'Which of the following is a fundamental function of management that involves setting objectives...'}"
              </p>
              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                <span>Correct Option: <strong className="text-emerald-600">Option {activeQuestion?.correctOption || 'A'}</strong></span>
                <span>Marks: <strong className="text-blue-600">+{activeQuestion?.marks || 2}</strong></span>
              </div>
            </div>

            {/* Topic Mastery Weightage */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-2">Topic Mastery Breakdown</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 mb-0.5">
                    <span>Importance &amp; Steps</span>
                    <span className="font-bold text-emerald-600">85%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-600 mb-0.5">
                    <span>Decision Making Tools</span>
                    <span className="font-bold text-rose-600">42%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-600 mb-0.5">
                    <span>Types of Plans</span>
                    <span className="font-bold text-blue-600">68%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contextual Visual Aid (Hotlinked from design in prompt) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                Fig 2.1: Management Cycle Hierarchy
              </span>
              <span className="text-[10px] text-blue-600 font-semibold">MSBTE Reference</span>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center relative group">
              <img
                src={ASSETS.DIAGRAM}
                alt="Management Cycle Hierarchy Diagram"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 italic">
              Visual aid: Notice how Planning (Objectives) initiates the loop before Organizing and Controlling.
            </p>
          </div>
        </div>

        {/* Right Column: AI Tutor Interactive Chat Screen */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[700px] overflow-hidden">
          {/* Active Thread Pin */}
          <div className="px-5 py-2.5 bg-purple-50/80 border-b border-purple-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-purple-900 font-medium">
              <Pin className="w-3.5 h-3.5 text-purple-600" />
              <span>Currently reviewing: <strong>{activeQuestion?.topic || 'Planning as a Function of Management'} ({activeQuestion?.code || '#ENG-22509-Q7'})</strong></span>
            </div>
            <span className="text-[11px] text-purple-700 font-semibold hidden sm:inline">
              Model: Gemini 2.5 Flash
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                  }`}>
                    {/* Message Content formatted */}
                    <div className="space-y-2 whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Footer stats / actions */}
                    {!isUser && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="text-slate-400">{msg.timestamp}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyMessage(msg.id, msg.text)}
                            className="p-1 hover:text-slate-700 rounded transition-colors"
                            title="Copy explanation"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button className="p-1 hover:text-emerald-600 rounded transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 hover:text-rose-600 rounded transition-colors">
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px]">AI Tutor is crafting explanation...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Quick Prompts:
            </span>
            {[
              '✨ Explain simply',
              '📝 Give an exam definition',
              '❓ Why is Option B wrong?',
              '🎯 2-mark MSBTE question format',
            ].map((promptText, i) => (
              <button
                key={i}
                onClick={() => handleSend(promptText)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs whitespace-nowrap shadow-2xs transition-colors shrink-0"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask anything about this question or Unit 2 concepts..."
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white text-xs font-bold shadow-sm shadow-purple-500/20 disabled:shadow-none transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 px-1">
              <span>Press <strong>Enter</strong> to send • Powered by MSBTE I-Scheme Curriculum Rubric</span>
              <button onClick={() => setMessages(messages.slice(0, 2))} className="hover:text-slate-600">
                Reset Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
