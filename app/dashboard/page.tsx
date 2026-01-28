'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ProfileCard from '@/components/profile-card'

export default function DashboardPage() {
  const supabase = createClient()
  const [profiles, setProfiles] = useState<any[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<any[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfiles = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
      }

      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading profiles:', error)
      } else {
        setProfiles(profilesData || [])
      }
      setLoading(false)
    }

    loadProfiles()
  }, [supabase])

  useEffect(() => {
    let filtered = profiles.filter((p) => p.id !== currentUserId)

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.position?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterCompany) {
      filtered = filtered.filter((p) => p.company === filterCompany)
    }

    if (filterYear) {
      filtered = filtered.filter((p) => p.graduation_year === parseInt(filterYear))
    }

    setFilteredProfiles(filtered)
  }, [profiles, searchTerm, filterCompany, filterYear, currentUserId])

  const companies = [...new Set(profiles.map((p) => p.company).filter(Boolean))]
  const years = [...new Set(profiles.map((p) => p.graduation_year).filter(Boolean))].sort(
    (a, b) => b - a,
  )

  if (loading) {
    return <div className="text-center py-12">Loading alumni profiles...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alumni Directory</h1>
        <p className="text-gray-600 mt-2">
          Find and connect with {profiles.length} alumni members
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Search by name, company, or position</label>
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Filter by company</label>
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Filter by graduation year</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(searchTerm || filterCompany || filterYear) && (
            <Button
              onClick={() => {
                setSearchTerm('')
                setFilterCompany('')
                setFilterYear('')
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      <div>
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No alumni found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
