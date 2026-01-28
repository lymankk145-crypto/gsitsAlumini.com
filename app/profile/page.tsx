'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    email: '',
    full_name: '',
    company: '',
    job_title: '', // ✅ Changed from 'position'
    bio: '',
    graduation_year: new Date().getFullYear().toString(),
    field_of_study: '', // ✅ Added missing field
  })
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)

      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        setError(profileError.message)
        return
      }

      if (existingProfile) {
        setProfile({
          email: existingProfile.email || user.email || '',
          full_name: existingProfile.full_name || '',
          company: existingProfile.company || '',
          job_title: existingProfile.job_title || '',
          bio: existingProfile.bio || '',
          graduation_year: existingProfile.graduation_year?.toString() || new Date().getFullYear().toString(),
          field_of_study: existingProfile.field_of_study || '',
        })
      } else {
        // Pre-fill email from auth user
        setProfile(prev => ({ ...prev, email: user.email || '' }))
      }
    }

    getUser()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: profile.email,
          full_name: profile.full_name,
          company: profile.company,
          job_title: profile.job_title, // ✅ Correct field name
          bio: profile.bio,
          graduation_year: parseInt(profile.graduation_year),
          field_of_study: profile.field_of_study || null, // ✅ Added
          updated_at: new Date().toISOString(),
        })

      if (upsertError) throw upsertError

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>Help other alumni find and connect with you</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                  disabled // Usually don't let users change their email
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Graduation Year</label>
                <Input
                  type="number"
                  value={profile.graduation_year}
                  onChange={(e) => setProfile({ ...profile, graduation_year: e.target.value })}
                  min="1900"
                  max={new Date().getFullYear() + 10}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Company *</label>
                <Input
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  placeholder="e.g., Google, Microsoft, Startup Inc"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Job Title *</label>
                <Input
                  value={profile.job_title}
                  onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
                  placeholder="e.g., Senior Engineer, Product Manager"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Field of Study</label>
                <Input
                  value={profile.field_of_study}
                  onChange={(e) => setProfile({ ...profile, field_of_study: e.target.value })}
                  placeholder="e.g., Computer Science, Business Administration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell other alumni about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
