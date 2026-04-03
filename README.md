# URL Shortener MVP

A simple URL shortener built with Next.js that allows users to shorten long URLs and track click statistics.

## Features

- **Shorten URLs** - Convert long URLs into short, shareable links
- **Automatic Redirect** - Visiting a short URL redirects to the original URL
- **Click Tracking** - Track how many times each short URL has been accessed
- **Stats Dashboard** - View click count and creation date for each shortened URL
- **Copy to Clipboard** - One-click copy of shortened URLs

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
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
│   ├── store.ts              # In-memory URL store
│   └── utils.ts              # Utility functions
├── types/
│   └── index.ts              # TypeScript interfaces
├── package.json
└── tsconfig.json
```

## Data Model

```typescript
interface ShortUrl {
  id: string
  originalUrl: string
  shortCode: string
  clicks: number
  createdAt: Date
}
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
  "shortUrl": "http://localhost:3000/abc123"
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

## Usage

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

## Limitations (MVP)

- **In-memory storage** - URLs are stored in memory and will be lost when the server restarts
- **No authentication** - Anyone can create and view URLs
- **No custom short codes** - Short codes are randomly generated
- **No deletion** - URLs cannot be deleted once created

## Future Enhancements

- [ ] Integrate Supabase for persistent storage
- [ ] Add third-party authentication (OAuth)
- [ ] Allow custom short codes
- [ ] Add QR code generation
- [ ] Add URL expiration
- [ ] Add analytics dashboard
- [ ] Add URL deletion

## Environment Variables

No environment variables required for the MVP. Future versions may require:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
