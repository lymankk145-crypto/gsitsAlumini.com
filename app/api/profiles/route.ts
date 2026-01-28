import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const company = searchParams.get('company')
  const year = searchParams.get('year')

  let query = supabase.from('profiles').select('*').neq('id', user.id)

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,company.ilike.%${search}%,position.ilike.%${search}%`,
    )
  }

  if (company) {
    query = query.eq('company', company)
  }

  if (year) {
    query = query.eq('graduation_year', parseInt(year))
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
