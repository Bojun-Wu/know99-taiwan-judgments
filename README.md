# Know99 — Taiwan Judgment Search

Know99 is a web application for exploring Taiwan court judgments. It turns public judicial records into a searchable, filterable experience and enriches them with plain-language AI summaries, extracted people and organizations, trending activity, and editorial content.

This repository demonstrates a production-oriented full-stack architecture built with Laravel, React, Inertia.js, PostgreSQL, Typesense, and Redis. The public application supports Traditional Chinese and English, server-side rendering, structured metadata, and responsive light/dark themes; a protected back office supports content and data administration.

> **Disclaimer:** Know99 is an independent project and is not affiliated with Taiwan's Judicial Yuan. Judgment data and AI-generated summaries are provided for discovery and informational purposes only. They may be incomplete or inaccurate and are not legal advice. Always verify information against the official judgment.

## Highlights

- **Full-text judgment search** powered by Laravel Scout and Typesense, with exact-query matching and filters for court, case type, and year
- **AI-assisted legal document analysis** using Groq structured output to generate a plain-language summary, keywords, and named entities
- **Entity discovery** across people and organizations, ranked by search relevance and linked to related judgments
- **Behavior-based discovery** with trending searches and judgments calculated from asynchronous, deduplicated activity logs
- **Bilingual user experience** with Traditional Chinese as the default and English routes under `/en`
- **SEO-ready rendering** through Inertia SSR, localized metadata, JSON-LD, Open Graph tags, canonical URLs, and chunked sitemap generation
- **Editorial publishing** for Markdown articles, tags, cover images, drafts, and published posts
- **Administration portal** for judgment records, AI summaries, courts, people, organizations, posts, and traffic analytics
- **Production packaging** with a multi-process Docker image plus dedicated queue-worker and SSR services

## Architecture

```text
Browser
  │
  ├── Inertia.js + React 19 + Mantine UI
  │          │
  │          └── server-side rendering (Node.js)
  │
  └── Laravel 12 application
             ├── PostgreSQL ── judgments, entities, posts, users, analytics
             ├── Typesense ─── full-text search and relevance scoring
             ├── Redis ─────── cache, sessions, and queued jobs
             ├── Groq API ──── on-demand structured judgment analysis
             └── R2 / S3 ───── optional post image storage
```

Activity writes are dispatched to queues so page requests are not blocked by analytics. Search and trending results are cached to reduce repeated database and search-engine work. AI analysis is generated on demand, persisted for reuse, and can be rated by users; poorly rated summaries are deprecated for regeneration.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Backend | PHP 8.2+, Laravel 12, Eloquent ORM, Laravel Scout |
| Frontend | React 19, TypeScript, Inertia.js 2, Mantine 7 |
| Data | PostgreSQL 16, Redis 7, Typesense 28 |
| AI | Groq API with configurable model and JSON-schema-constrained output |
| Rendering & localization | Inertia SSR, React i18next, Ziggy |
| Tooling | Vite 6, ESLint 9, Prettier 3, Pest 3 |
| Infrastructure | Docker, Nginx, PHP-FPM, Supervisor, S3-compatible storage |

## Local Development

### Prerequisites

- PHP 8.2 or later with the PostgreSQL extension
- Composer 2
- Node.js and npm
- Docker with Docker Compose

### 1. Install dependencies

```bash
composer install
npm install
```

### 2. Configure the application

```bash
cp .env.example .env
php artisan key:generate
```

Set the following values in `.env` for the Docker-based development services:

```dotenv
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=verdict_query
DB_USERNAME=verdict_query
DB_PASSWORD=choose-a-local-password

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

TYPESENSE_HOST=127.0.0.1
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=choose-a-local-api-key
```

The database name, username, password, Typesense port, API key, and Redis port are also consumed by `docker-compose.dev.yml`, so keep those values consistent.

Groq and cloud-storage credentials are optional. The core browsing and search experience can run without them; AI analysis requires `GROQ_SECRET_KEY` and uses `GROQ_MODEL` (default: `qwen/qwen3.8-27b`), while post image uploads require the configured R2/S3 values.

The analysis service uses Groq's OpenAI-compatible chat completions endpoint and strict JSON Schema output. To use another Groq-supported model, change `GROQ_MODEL`; if changing providers, update the request format and response extraction in `app/Services/VerdictSummaryService.php` because structured-output request formats differ between providers.

### 3. Start infrastructure

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts PostgreSQL, Typesense, and Redis with persistent Docker volumes.

### 4. Initialize the database

```bash
php artisan migrate --seed
```

> The development seeder creates a predictable administrator account for local use. Do not run it in production without first replacing that credential in `database/seeders/AdminSeeder.php`.

### 5. Add judgment data (optional)

The repository does not include the full judgment dataset. To import locally obtained Judicial Yuan JSON files, place them under `storage/app/private/verdict_data` or provide a custom directory:

```bash
php artisan verdict:import-local

# Import from another location
php artisan verdict:import-local --path=/absolute/path/to/verdict_data

# Sample approximately 1 in every 100 records while developing
php artisan verdict:import-local --test
```

The importer normalizes judgment identifiers, creates court records, updates changed judgments, queues Typesense indexing through Scout, regenerates sitemaps, and clears application caches. The source directory names are used to derive the court and judgment type; see `ImportVerdictService` for the accepted structure.

An online importer is also available for authorized Judicial Yuan dataset access:

```bash
php artisan verdict:import-online --from=2025-01 --to=2025-03
```

It requires `JUDICIAL_API_USERNAME` and `JUDICIAL_API_PASSWORD`. Use `php artisan help verdict:import-online` to review sampling, reset, and temporary-file options before running it.

### 6. Run the application

For the standard development server with Vite hot reload and a queue listener:

```bash
composer run dev
```

For the SSR development workflow:

```bash
composer run dev:ssr
```

Open [http://localhost:8000](http://localhost:8000). The administration portal is available at `/management`.

## Useful Commands

```bash
# Rebuild the frontend production bundle
npm run build

# Build both browser and SSR bundles
npm run build:ssr

# Type-check the React application
npm run types

# Check frontend formatting
npm run format:check

# Run the PHP test suite
composer test

# Regenerate the sitemap index and all judgment sitemap chunks
php artisan sitemap:generate --verdicts

# Re-import a clean local dataset (destructive)
php artisan verdict:import-local --fresh-seed
```

## Project Structure

```text
app/
├── Console/Commands/          data import and sitemap commands
├── Http/Controllers/          public, API, authentication, and admin endpoints
├── Jobs/                      asynchronous activity logging
├── Models/                    domain and analytics models
└── Services/                  search, entity, content, AI, and import logic

resources/js/
├── components/                reusable React UI
├── i18n/                      English and Traditional Chinese resources
├── layouts/                   public and administration shells
└── pages/                     Inertia route components

database/
├── migrations/                PostgreSQL schema
├── factories/                 test data factories
└── seeders/                   local development seed data

docker/                        Nginx, PHP-FPM, Supervisor, and entrypoint config
tests/                         Pest unit and feature tests
```

## Data and Privacy

- Judgment records originate from the [Judicial Yuan open-data service](https://opendata.judicial.gov.tw/). Consult the source terms before redistributing data.
- The application records search terms and content views to compute trends. Logs include IP address and session identifiers; review retention, consent, and privacy requirements before deploying publicly.
- Gemini receives processed judgment text when a user requests a missing AI analysis. Configure and disclose this data flow appropriately for your deployment.
- AI summaries are supplemental. The UI links back to the official PDF so users can verify the original record.

## Current Limitations

- The judgment corpus and external service credentials are not bundled with the repository.
- AI summaries can contain errors despite schema-constrained output and user feedback controls.
- Local database migrations target PostgreSQL; the test environment should use PostgreSQL until the pivot-table migrations are made SQLite-compatible.
- The online importer depends on authorized access and the upstream dataset format.
