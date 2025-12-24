# Portfoliyours

A comprehensive career and resource management platform built with Next.js. Manage your portfolio, projects, experiences, and job applications all in one place.

## Features

- **User Authentication**: Secure sign up and login
- **Profile Management**: Manage your personal information and avatar
- **CV Upload**: Upload and manage your CV/resume
- **GitHub Projects**: Sync and manage your GitHub projects
- **Upwork Projects**: Track your Upwork projects and earnings
- **Experience Tracking**: Record and manage your work experience
- **Job Applications**: Track your job applications and their status
- **Portfolio Builder**: Build and customize your professional portfolio

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form + Zod
- **File Upload**: React Dropzone

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfoliyours
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and fill in your configuration:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_URL`: Your app URL (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed documentation.

```
portfoliyours/
├── app/                    # Next.js App Router (pages & routes)
│   ├── (auth)/            # Auth route group
│   │   ├── signin/       # Sign in page
│   │   └── signup/       # Sign up page
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── dashboard/    # Main dashboard
│   │   ├── profile/      # Profile management
│   │   ├── portfolio/    # Portfolio builder
│   │   ├── projects/     # Projects (GitHub, Upwork)
│   │   ├── experiences/  # Experience management
│   │   ├── applications/ # Job applications
│   │   └── cv/           # CV management
│   ├── api/              # API route handlers
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── auth/             # Auth components
│   ├── layout/           # Layout components
│   └── ...               # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities & configurations
├── constants/            # App constants & config
├── types/                # TypeScript definitions
├── prisma/               # Database schema
└── public/               # Static assets
```

### Key Directories

- **`app/`** - Next.js App Router pages and API routes (see [app/README.md](./app/README.md))
- **`components/`** - React components organized by feature (see [components/README.md](./components/README.md))
- **`hooks/`** - Custom React hooks (see [hooks/README.md](./hooks/README.md))
- **`lib/`** - Utility functions and configurations (see [lib/README.md](./lib/README.md))
- **`constants/`** - App-wide constants and route definitions

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User accounts with authentication
- **Profile**: Extended user profile information
- **CV**: CV/resume file management
- **GitHubProject**: GitHub project synchronization
- **UpworkProject**: Upwork project tracking
- **Experience**: Work experience records
- **Application**: Job application tracking
- **PortfolioItem**: Portfolio content items

## Development

### Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.example` for all required environment variables.

## Next Steps

This is the initial setup and scaffolding. Future development will include:

- [ ] Complete authentication UI
- [ ] User profile management interface
- [ ] CV upload functionality
- [ ] GitHub API integration
- [ ] Upwork API integration
- [ ] Portfolio builder interface
- [ ] Experience management UI
- [ ] Job application tracking UI
- [ ] File storage integration (AWS S3 or similar)
- [ ] Email notifications
- [ ] Advanced portfolio customization

## License

MIT
