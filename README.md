# Email Assistant 🚀

A modern, AI-powered email management system built with Next.js that allows you to interact with your emails using natural language commands.

## ✨ Features

- **Natural Language Commands** - Manage your emails through simple conversational prompts
- **Smart Composition** - Draft emails quickly with AI assistance
- **Gmail Integration** - Seamlessly connects with your Google account
- **Modern UI** - Beautiful, responsive interface built with Tailwind CSS
- **Real-time Updates** - Instant email synchronization
- **Secure Authentication** - OAuth 2.0 integration with Google

## 🛠️ Core Functionalities

- Read and summarize emails
- Send new emails
- Reply to existing threads
- Forward messages
- Search through your inbox
- Delete unwanted emails
- Star/unstar important messages

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Cloud Platform account with Gmail API enabled
- PostgreSQL database

### Environment Setup

1. Clone the repository
2. Create a `.env` file with the following variables:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_postgres_database_url
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npm run db:push
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Tech Stack

- **Framework**: [Next.js 15.3](https://nextjs.org/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Email Integration**: [Gmail API](https://developers.google.com/gmail/api)
- **AI Integration**: [Groq](https://groq.com/)

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database changes
- `npm run db:studio` - Open Drizzle Studio

### Database Management

The project uses Drizzle ORM for database operations. Available commands:
- `db:push` - Push schema changes
- `db:pull` - Pull current schema
- `db:migrate` - Run migrations
- `db:generate` - Generate migrations
- `db:studio` - Open Drizzle Studio

## 🔒 Security

- Uses OAuth 2.0 for secure authentication
- No email passwords are stored
- Secure token management
- Environment variables for sensitive data

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
