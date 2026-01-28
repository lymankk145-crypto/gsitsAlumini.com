import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CheckEmailPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Check Your Email</CardTitle>
        <CardDescription>Confirm your email to activate your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          We've sent a confirmation link to your email address. Please click it to verify your account and get started.
        </p>
        <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-700">
          If you don't see the email, check your spam folder or try signing up again.
        </div>
        <Link href="/auth/login">
          <Button variant="outline" className="w-full bg-transparent">
            Back to Login
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
