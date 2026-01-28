'use client'

import React from "react"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  read_at: string | null
}

export default function MessageThreadPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const userId = params.userId as string
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [otherUserName, setOtherUserName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setCurrentUserId(user.id)

      // Get other user's profile
      const { data: otherUser } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single()

      if (otherUser) {
        setOtherUserName(otherUser.full_name)
      }

      // Get messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`,
        )
        .order('created_at', { ascending: true })

      if (messagesData) {
        setMessages(messagesData)

        // Mark messages as read
        await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .eq('receiver_id', user.id)
          .eq('sender_id', userId)
          .is('read_at', null)
      }

      setLoading(false)
    }

    loadMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new as Message
          if (
            (newMsg.sender_id === userId && newMsg.receiver_id === currentUserId) ||
            (newMsg.sender_id === currentUserId && newMsg.receiver_id === userId)
          ) {
            setMessages((prev) => [...prev, newMsg])
          }
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, userId, router, currentUserId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUserId) return

    setSending(true)
    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: currentUserId,
        receiver_id: userId,
        content: newMessage,
      })

      if (error) throw error

      setNewMessage('')
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading conversation...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="h-screen md:h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle>{otherUserName}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender_id === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={sending}
            />
            <Button type="submit" disabled={sending || !newMessage.trim()}>
              {sending ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
