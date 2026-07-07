"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp, CheckCircle2, Loader2, Plus, Share, Square, Trash2, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface Thread {
  id: string
  title: string
  messages: Message[]
}

interface ToolStatus {
  tool: string
  done: boolean
}

const SUGGESTIONS = [
  { title: "Create a new job posting", sub: "in San Francisco?" },
  { title: "Schedule an interview", sub: "with the candidate?" },
]

export default function AssistantPage() {
  const { accessToken } = useAuth()
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const [toolStatuses, setToolStatuses] = useState<ToolStatus[]>([])
  const [streamError, setStreamError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null
  const messages = activeThread?.messages ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent, toolStatuses])

  function newThread() {
    const id = crypto.randomUUID()
    setThreads((prev) => [{ id, title: "New Thread", messages: [] }, ...prev])
    setActiveThreadId(id)
    return id
  }

  function deleteThread(id: string) {
    setThreads((prev) => prev.filter((t) => t.id !== id))
    if (activeThreadId === id) setActiveThreadId(null)
  }

  async function sendMessage(content: string) {
    if (!content.trim() || isStreaming) return

    let threadId = activeThreadId
    if (!threadId) threadId = newThread()

    const currentThread = threads.find((t) => t.id === threadId)
    const history = (currentThread?.messages ?? []).map(({ role, content: c }) => ({ role, content: c }))

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content }

    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              title: t.messages.length === 0 ? content.slice(0, 32) : t.title,
              messages: [...t.messages, userMsg],
            }
          : t,
      ),
    )
    setInput("")
    setIsStreaming(true)
    setStreamingContent("")
    setToolStatuses([])
    setStreamError(null)
    textareaRef.current?.focus()

    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const res = await fetch(`${BASE_URL}/ai/chat/stream`, {
        method: "POST",
        signal: ctrl.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ message: content, history }),
      })

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({ message: "Stream failed" }))
        throw new Error(errBody?.message ?? "Stream failed")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buf = ""
      let finalContent = ""

      outer: while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const parts = buf.split("\n\n")
        buf = parts.pop() ?? ""

        for (const part of parts) {
          const eventName = part.match(/^event: (.+)$/m)?.[1]
          const dataLine = part.match(/^data: (.+)$/m)?.[1]
          if (!eventName || !dataLine) continue

          let payload: Record<string, string>
          try {
            payload = JSON.parse(dataLine)
          } catch {
            continue
          }

          switch (eventName) {
            case "tool_call":
              setToolStatuses((prev) => [...prev, { tool: payload.tool, done: false }])
              break
            case "tool_result":
              setToolStatuses((prev) =>
                prev.map((s) => (s.tool === payload.tool && !s.done ? { ...s, done: true } : s)),
              )
              break
            case "reply":
              finalContent = payload.content
              setStreamingContent(payload.content)
              break
            case "done":
              if (finalContent) {
                const assistantMsg: Message = {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content: finalContent,
                }
                setThreads((prev) =>
                  prev.map((t) =>
                    t.id === threadId ? { ...t, messages: [...t.messages, assistantMsg] } : t,
                  ),
                )
              }
              break outer
            case "error":
              throw new Error(payload.message ?? "Unknown error from assistant")
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setStreamError(err.message)
      }
    } finally {
      setIsStreaming(false)
      setStreamingContent("")
      setToolStatuses([])
      abortRef.current = null
    }
  }

  function stopStreaming() {
    abortRef.current?.abort()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* ── Left panel ── */}
      <aside className="flex w-67.5 shrink-0 flex-col border-r border-border bg-card">
        <div className="px-3 py-3">
          <span className="text-xs font-semibold text-foreground">assistant-ui</span>
        </div>

        <div className="px-2.5 pb-2.5">
          <button
            onClick={newThread}
            className="flex w-full items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-accent"
          >
            <Plus className="h-4 w-4" />
            New Thread
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-1.5 py-1">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className={cn(
                "group flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                activeThreadId === thread.id
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <button
                onClick={() => setActiveThreadId(thread.id)}
                className="flex-1 truncate text-left"
              >
                {thread.title}
              </button>
              <button
                onClick={() => deleteThread(thread.id)}
                className="shrink-0 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main panel ── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <button className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-accent" />
          <button className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Share className="h-4 w-4" />
          </button>
        </div>

        {/* Messages / Welcome */}
        <div className="flex flex-1 flex-col items-center overflow-y-auto px-3 py-5">
          {messages.length === 0 && !isStreaming ? (
            <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-xl font-bold text-foreground">Hello there!</h1>
                <p className="text-muted-foreground">How can I help you today?</p>
              </div>
              <div className="grid w-full grid-cols-2 gap-2.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => sendMessage(`${s.title} ${s.sub}`)}
                    className="rounded-xl border border-border bg-card p-3 text-left transition-colors hover:bg-accent"
                  >
                    <p className="text-xs font-medium text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex w-full max-w-2xl flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2.5 text-xs",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground",
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* In-flight streaming indicator */}
              {isStreaming && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] flex-col gap-1.5">
                    {toolStatuses.map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {s.done ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        <Wrench className="h-3 w-3" />
                        <span>{s.done ? `Used ${s.tool}` : `Using ${s.tool}…`}</span>
                      </div>
                    ))}

                    {streamingContent ? (
                      <div className="whitespace-pre-wrap rounded-2xl bg-card px-3 py-2.5 text-xs text-foreground">
                        {streamingContent}

                      </div>
                    ) : (
                      toolStatuses.every((s) => s.done) && (
                        <div className="flex h-9 items-center gap-1.5 rounded-2xl bg-card px-3 text-xs text-muted-foreground">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Thinking…
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {streamError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
                  {streamError}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border px-3 pb-3 pt-2.5">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-end gap-1.5 rounded-xl border border-border bg-card px-2.5 py-2">
              <button className="mb-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Plus className="h-4 w-4" />
              </button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Send a message..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {isStreaming ? (
                <button
                  onClick={stopStreaming}
                  className="mb-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Square className="h-3 w-3 fill-current" />
                </button>
              ) : (
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="mb-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
