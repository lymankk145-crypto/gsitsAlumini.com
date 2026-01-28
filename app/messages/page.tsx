'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Conversation {
  id: string
  otherUserId: string
  otherUserName: string
  lastMessage: string
  lastMessageTime: string
  unread: boolean
}

export default function MessagesPage() {
  const supabase = createClient()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConversations = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setCurrentUserId(user.id)

      // Get all messages for this user
      const { data: messages } = await supabase
        .from('messages')
        .select(
          `
          *,
          sender:sender_id(id, full_name),
          receiver:receiver_id(id, full_name)
        `,
        )
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (messages) {
        // Group messages by conversation
        const conversationMap: { [key: string]: Conversation } = {}

        messages.forEach((msg: any) => {
          const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
          const otherUserData = msg.sender_id === user.id ? msg.receiver : msg.sender

          if (!conversationMap[otherUserId]) {
            conversationMap[otherUserId] = {
              id: otherUserId,
              otherUserId,
              otherUserName: otherUserData?.full_name || 'Unknown User',
              lastMessage: msg.content,
              lastMessageTime: msg.created_at,
              unread: msg.receiver_id === user.id && !msg.read_at,
            }
          }
        })

        setConversations(Object.values(conversationMap))
      }

      setLoading(false)
    }

    loadConversations()

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          loadConversations()
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  if (loading) {
    return <div className="text-center py-12">Loading conversations...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Stay connected with your alumni network</p>
      </div>

      {conversations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">No conversations yet.</p>
            <Link href="/dashboard">
              <Button>Browse Alumni</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Link key={conv.otherUserId} href={`/messages/${conv.otherUserId}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {conv.otherUserName}
                        {conv.unread && <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" />}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    <p className="text-xs text-gray-500 ml-4">
                      {new Date(conv.lastMessageTime).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
