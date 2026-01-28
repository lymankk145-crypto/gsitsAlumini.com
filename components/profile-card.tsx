'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Profile {
  id: string
  full_name: string
  company: string
  position: string
  bio: string
  graduation_year: number
}

export default function ProfileCard({ profile }: { profile: Profile }) {
  const supabase = createClient()
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadConnection = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)

        const { data: connections } = await supabase
          .from('connections')
          .select('*')
          .or(
            `and(user_id.eq.${user.id},connected_user_id.eq.${profile.id}),and(user_id.eq.${profile.id},connected_user_id.eq.${user.id})`,
          )

        if (connections && connections.length > 0) {
          setIsConnected(true)
        }
      }
    }

    loadConnection()
  }, [supabase, profile.id])

  const handleConnect = async () => {
    if (!currentUserId) return

    setLoading(true)
    try {
      const { error } = await supabase.from('connections').insert({
        user_id: currentUserId,
        connected_user_id: profile.id,
        status: 'pending',
      })

      if (error) throw error

      setIsConnected(true)
    } catch (err) {
      console.error('[v0] Error sending connection request:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{profile.full_name}</CardTitle>
        <p className="text-sm text-gray-600">{profile.position}</p>
        <p className="text-sm text-gray-500">{profile.company}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.bio && <p className="text-sm text-gray-700">{profile.bio}</p>}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <span className="font-medium">Graduation Year:</span> {profile.graduation_year}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/messages/${profile.id}`} className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Message
            </Button>
          </Link>

          <Button onClick={handleConnect} disabled={isConnected || loading} className="flex-1">
            {isConnected ? 'Connected' : loading ? 'Sending...' : 'Connect'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
