import { useState, useEffect, useRef } from 'react'
import {
  MessageSquare, Send, Sparkles, User, Bot, AlertCircle, ArrowRight, Lightbulb, CheckCircle2, BookOpen
} from 'lucide-react'
import api from '@/services/api'

export default function CareerCoachPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestedPrompts = [
    'Why am I a partial match for this role?',
    'What should I learn first on my roadmap?',
    'Which project would strengthen my profile?',
    'Help me prepare for the technical interview question on distributed systems.',
    'How can I improve my resume summary truthfully?'
  ]

  const fetchMessages = async () => {
    try {
      const res = await api.get('/coach/messages')
      setMessages(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim() || loading) return

    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/coach/chat', { content: text })
      setMessages(prev => [...prev, res.data])
    } catch (err) {
      alert('Failed to get coach response.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
        <div>
          <span className="section-label">CONTEXTUAL CAREER ADVISOR</span>
          <h1 className="text-xl font-bold tracking-tight text-text-primary mt-0.5">
            AI Career Coach
          </h1>
          <p className="text-xs text-text-secondary">
            Grounding career strategy in genuine qualifications and verified job requirements.
          </p>
        </div>
      </div>

      {/* Suggested Prompts Pill Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-accent hover:bg-accent-subtle/30 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles size={11} className="text-accent" /> {p}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user'
          return (
            <div
              key={m.id || idx}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg p-4 text-xs leading-relaxed space-y-3 ${
                  isUser
                    ? 'bg-accent text-white'
                    : 'bg-surface border border-border text-text-primary shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line font-sans">
                  {m.content}
                </div>

                {/* Recommendations attached to assistant messages */}
                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/80">
                    <span className="font-mono text-[10px] uppercase font-bold text-accent block">
                      ACTIONABLE RECOMMENDATIONS
                    </span>
                    {m.recommendations.map((rec: any, rIdx: number) => (
                      <div
                        key={rec.id || rIdx}
                        className="p-3 rounded bg-background border border-border text-text-primary space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs flex items-center gap-1.5">
                            <Lightbulb size={13} className="text-accent" /> {rec.title}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-accent-subtle text-accent font-medium">
                            {rec.priority} priority
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-snug">{rec.reason}</p>
                        {rec.next_steps && (
                          <div className="pt-1">
                            <ul className="list-disc list-inside text-[11px] text-text-tertiary space-y-0.5">
                              {rec.next_steps.map((step: string, sIdx: number) => (
                                <li key={sIdx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-surface-dark flex items-center justify-center text-white shrink-0 mt-0.5">
                  <User size={15} />
                </div>
              )}
            </div>
          )
        })}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shrink-0">
              <Bot size={16} />
            </div>
            <div className="card-base p-3 text-xs text-text-secondary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" /> Analyzing verified context…
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="card-base p-2 flex items-center gap-2 shrink-0">
        <textarea
          rows={1}
          placeholder="Ask your career coach about requirements, interviews, or resume clarity..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          className="flex-1 bg-transparent px-3 py-2 text-xs focus:outline-none resize-none leading-relaxed"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="btn-primary p-2.5 rounded-md shrink-0"
          title="Send message"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}
