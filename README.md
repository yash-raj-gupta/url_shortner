# URL Shortener

A URL shortener built with Next.js and Supabase that allows users to shorten long URLs and track click statistics.

## Features

- **Shorten URLs** - Convert long URLs into short, shareable links
- **Automatic Redirect** - Visiting a short URL redirects to the original URL
- **Click Tracking** - Track how many times each short URL has been accessed
- **Stats Dashboard** - View click count and creation date for each shortened URL
- **Copy to Clipboard** - One-click copy of shortened URLs
- **Persistent Storage** - URLs stored in Supabase (works on Vercel)

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (database)
- **Lucide React** (icons)

## Project Structure

```
url_shortner/
├── app/
│   ├── [code]/
│   │   └── route.ts          # Redirect handler - increments clicks & redirects
│   ├── api/
│   │   ├── shorten/
│   │   │   └── route.ts      # POST /api/shorten - create short URL
│   │   └── stats/
│   │       └── [code]/
│   │           └── route.ts  # GET /api/stats/[code] - get URL stats
│   ├── stats/
│   │   └── [code]/
│   │       └── page.tsx      # Stats display page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page with form
├── lib/
│   ├── store.ts              # Supabase URL operations
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # Utility functions
├── supabase/
│   └── schema.sql            # Database schema
├── types/
│   └── index.ts              # TypeScript interfaces
├── .env.example              # Environment variables template
├── package.json
└── tsconfig.json
```

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the details:
   - **Name**: url-shortener
   - **Database Password**: Choose a strong password
   - **Region**: Pick one closest to you
4. Click "Create new project" and wait for it to set up

### 2. Set Up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of [supabase/schema.sql](supabase/schema.sql)
3. Click "Run" to execute the SQL

### 3. Configure Environment Variables

1. Go to **Project Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Update `.env.local` with your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import the project
3. In the Vercel project settings, add the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Data Model

```sql
shortened_urls table:
- id: UUID (primary key)
- original_url: TEXT
- short_code: VARCHAR(20) - unique
- clicks: INTEGER - default 0
- created_at: TIMESTAMP WITH TIME ZONE
```

## API Endpoints

### POST /api/shorten
Create a new short URL.

**Request:**
```json
{
  "originalUrl": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "shortCode": "abc123",
  "shortUrl": "https://yourdomain.com/abc123"
}
```

### GET /api/stats/[code]
Get statistics for a short URL.

**Response:**
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "shortCode": "abc123",
  "clicks": 42,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### GET /[code]
Redirect to the original URL and increment click count.

## Pages

### Home Page (/)
- Input field to enter long URL
- Submit button to create short URL
- Display shortened URL with copy button
- Link to stats page

### Stats Page (/stats/[code])
- Shows original URL
- Total click count
- Creation date
- Short URL with copy functionality

## Usage (Local Development)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the app:**
   Navigate to http://localhost:3000

3. **Shorten a URL:**
   - Enter a long URL in the input field
   - Click "Shorten" button
   - Copy the generated short URL or view stats

4. **Test redirect:**
   - Visit the short URL (e.g., http://localhost:3000/abc123)
   - You should be redirected to the original URL
   - Click count should increment

5. **View stats:**
   - Click the chart icon on the result
   - Or navigate to /stats/[code]

## Future Enhancements

- [x] Integrate Supabase for persistent storage
- [ ] Add third-party authentication (OAuth)
- [ ] Allow custom short codes
- [ ] Add QR code generation
- [ ] Add URL expiration
- [ ] Add analytics dashboard
- [ ] Add URL deletion
