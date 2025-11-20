<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Tech & AI Daily - Full-Stack CMS

A modern tech news publication platform with **React frontend** and **PHP/MySQL backend** - optimized for Hostinger shared hosting deployment.

## Features

- 📰 **Modern Editorial Platform** - Clean, newspaper-style layout
- 🤖 **AI-Powered Content** - Gemini AI for article drafts and tag generation
- 🔍 **Advanced Filtering** - Category filtering and full-text search
- 📱 **Responsive Design** - Mobile-first approach
- 🚀 **Easy Deployment** - Built for Hostinger shared hosting
- 💾 **MySQL Database** - Robust data persistence
- 🔐 **RESTful API** - PHP backend with CORS support

## Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- Lucide Icons

**Backend:**
- PHP 7.4+ (PDO)
- MySQL 5.7+
- RESTful API architecture

**AI Integration:**
- Google Gemini AI

## Prerequisites

- Node.js (for local development)
- Hostinger shared hosting account
- MySQL database
- Gemini API key (optional, for AI features)

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   DB_HOST=localhost
   DB_NAME=techandaidaily
   DB_USER=root
   DB_PASS=your_password
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Set up local database:**
   - Create MySQL database
   - Import `api/setup/schema.sql`

4. **Run development server:**
   ```bash
   npm run dev
   ```

## Production Deployment to Hostinger

### Quick Deploy

```bash
./deploy.sh
```

Then upload files from `deploy/` folder to Hostinger.

### Full Deployment Guide

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed step-by-step instructions including:
- Database setup
- Environment configuration
- Git deployment workflow
- FTP deployment option
- Troubleshooting tips

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles.php` | Get all articles |
| GET | `/api/articles.php?id={id}` | Get single article |
| POST | `/api/articles.php` | Create new article |
| PUT | `/api/articles.php` | Update article |
| DELETE | `/api/articles.php?id={id}` | Delete article |
| GET | `/api/authors.php` | Get all authors |

## Project Structure

```
techandaidaily/
├── api/                      # PHP Backend
│   ├── config/
│   │   ├── database.php     # Database connection
│   │   └── cors.php         # CORS configuration
│   ├── setup/
│   │   └── schema.sql       # Database schema
│   ├── articles.php         # Articles API
│   ├── authors.php          # Authors API
│   └── index.php            # API info
├── components/              # React components
├── services/
│   ├── apiService.ts        # API client
│   └── geminiService.ts     # AI integration
├── public/
│   └── .htaccess           # Apache configuration
├── .env.example            # Environment template
├── deploy.sh               # Deployment script
└── DEPLOYMENT.md           # Deployment guide
```

## Database Schema

- **authors** - Author information
- **articles** - Article content and metadata
- **tags** - Article tags
- **article_tags** - Many-to-many relationship

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | MySQL host | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database username | Yes |
| `DB_PASS` | Database password | Yes |
| `GEMINI_API_KEY` | Gemini API key | No |
| `VITE_API_URL` | API base URL | No |

## Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
./deploy.sh      # Build and prepare deployment package
```

## Admin Dashboard

Access the admin dashboard at `/#/admin` to:
- Create new articles
- Generate AI-powered drafts
- Auto-generate tags
- Publish content

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - feel free to use this project for your own publications.

## Support

For deployment issues, see [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section.

---

Built with ❤️ using React, PHP, and MySQL
