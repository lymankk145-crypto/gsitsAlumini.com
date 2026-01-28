# AlumniConnect - Alumni Networking Platform

A modern web application that enables alumni to connect, share professional experiences, and build meaningful relationships with fellow graduates.

## Features

### 🔐 Authentication
- User registration and email verification
- Secure login with Supabase Auth
- Session management and logout functionality

### 👤 Profile Management
- Complete alumni profile creation
- Display professional information (company, position, role)
- Graduation year tracking
- Personal bio and background information

### 🔍 Alumni Directory
- Browse all registered alumni
- Search by name, company, or position
- Filter by graduation year
- Filter by company
- Responsive card-based interface

### 🤝 Connections
- Send and receive connection requests
- View connection status
- Build your professional network

### 💬 Messaging System
- Real-time messaging between connected alumni
- View conversation history
- Read receipts
- Message timestamps
- Responsive chat interface

### 📱 Responsive Design
- Mobile-first approach
- Works seamlessly on desktop, tablet, and mobile devices
- Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Real-time subscriptions
- **UI Components**: shadcn/ui

## Database Schema

### Tables

#### profiles
- `id` (UUID): Primary key, user ID from auth
- `full_name` (text): User's full name
- `company` (text): Current company
- `position` (text): Job position
- `bio` (text): Personal biography
- `graduation_year` (integer): Year of graduation
- `created_at` (timestamp): Account creation date
- `updated_at` (timestamp): Last update date

#### connections
- `id` (UUID): Primary key
- `requester_id` (UUID): User sending the request
- `receiver_id` (UUID): User receiving the request
- `status` (text): 'pending' or 'accepted'
- `created_at` (timestamp): Request creation date

#### messages
- `id` (UUID): Primary key
- `sender_id` (UUID): Message sender
- `receiver_id` (UUID): Message recipient
- `content` (text): Message content
- `read_at` (timestamp): When message was read
- `created_at` (timestamp): Message creation date

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── check-email/page.tsx
│   ├── auth/callback/route.ts
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── messages/
│   │   ├── page.tsx
│   │   └── [userId]/page.tsx
│   ├── profile/page.tsx
│   ├── api/
│   │   ├── profiles/route.ts
│   │   └── messages/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── profile-card.tsx
├── lib/
│   └── supabase/
│       ├── client.ts
│       └── server.ts
├── proxy.ts
└── scripts/
    ├── 01-create-profiles.sql
    ├── 02-create-connections.sql
    └── 03-create-messages.sql
```

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account and project

### Installation

1. **Clone the repository** (if using Git)
   ```bash
   git clone <repository-url>
   cd alumni-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**
   - Access your Supabase dashboard
   - Go to SQL Editor
   - Run the scripts in `/scripts/` directory in order:
     1. `01-create-profiles.sql`
     2. `02-create-connections.sql`
     3. `03-create-messages.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Creating an Account
1. Click "Sign Up" on the landing page
2. Enter your email and password
3. Verify your email address
4. Complete your profile with professional information
5. Start connecting with alumni!

### Browsing Alumni
1. Go to the Directory page
2. Search by name, company, or position
3. Filter by graduation year or company
4. Click on any profile to see more details

### Connecting with Alumni
1. Find an alumni profile you'd like to connect with
2. Click the "Connect" button
3. Once accepted, you can message them

### Messaging
1. Go to the Messages page
2. Select a conversation or start a new one
3. Type your message and click Send
4. See your conversation history in real-time

## Features in Detail

### Real-time Updates
- Messages are delivered in real-time using Supabase subscriptions
- No need to refresh the page to see new messages

### Row Level Security (RLS)
- All database tables have RLS enabled
- Users can only see and access their own data
- Connections and messages are protected

### Search & Filter
- Full-text search across alumni profiles
- Multiple filter options for better discovery
- Instant filtering without page reload

## API Endpoints

### GET `/api/profiles`
Get filtered list of profiles
- Query params: `search`, `company`, `year`

### POST/GET `/api/messages`
Send a message or retrieve message history
- POST body: `receiver_id`, `content`
- GET params: `other_user_id` (optional)

## Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy!

### Deploy to Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Firebase Hosting
- Self-hosted servers with Node.js

## Future Enhancements

- [ ] Profile photo uploads
- [ ] Advanced search filters (industry, skills)
- [ ] User notifications
- [ ] LinkedIn integration
- [ ] Event organization and RSVP
- [ ] Job board for alumni
- [ ] Alumni statistics and insights
- [ ] Dark mode support

## Security Considerations

- All user data is protected with Supabase RLS policies
- Passwords are securely hashed by Supabase
- CSRF protection enabled
- XSS protection through React
- SQL injection prevention with parameterized queries

## Support

For issues or feature requests, please open an issue in the repository or contact the development team.

## License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js and Supabase
