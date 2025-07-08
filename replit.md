# OpenGraph Pro - SEO & Social Media Tag Analyzer

## Overview

OpenGraph Pro is a full-stack web application for analyzing and generating OpenGraph/Twitter social media tags. It provides URL analysis, AI-powered SEO suggestions, social media preview generation, and manual tag creation tools. The system is built with a React frontend and Express backend, using PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state
- **UI Components**: Radix UI with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL via Drizzle ORM
- **Web Scraping**: Puppeteer for page content extraction
- **AI Integration**: Google Gemini 1.5 Flash for SEO analysis and suggestions
- **Session Management**: Express sessions with PostgreSQL store

### Development Setup
- **Monorepo Structure**: Shared types and schemas between client/server
- **Hot Reloading**: Vite HMR for frontend, tsx for backend development
- **Build Process**: Separate client (Vite) and server (esbuild) builds

## Key Components

### URL Analysis Service
- **Purpose**: Extract metadata from any URL
- **Implementation**: Puppeteer-based web scraping
- **Features**: 
  - OpenGraph tag extraction
  - Twitter Card tag extraction
  - JSON-LD structured data parsing
  - Page title and description extraction
  - Content analysis for SEO optimization

### AI-Powered SEO Analysis
- **Provider**: Google Gemini 1.5 Flash
- **Function**: Analyzes extracted metadata and provides optimization suggestions
- **Output**: Structured recommendations for title length, description optimization, image presence, and tag completeness

### Social Media Preview Generator
- **Platforms**: Facebook, Twitter, LinkedIn
- **Features**: Real-time preview generation based on extracted or custom tags
- **Responsive**: Mobile and desktop preview modes

### Tag Generator Tool
- **Purpose**: Manual creation of OpenGraph/Twitter tags
- **Features**: Form-based tag creation, code generation, copy-to-clipboard functionality
- **Validation**: Real-time validation of tag formats and requirements

## Data Flow

1. **URL Submission**: User enters URL in the URLInput component
2. **Analysis Request**: Frontend sends POST request to `/api/analyze`
3. **Web Scraping**: Backend uses Puppeteer to extract page metadata
4. **AI Analysis**: Google Gemini analyzes extracted data for SEO optimization
5. **Data Storage**: Analysis results stored in PostgreSQL via Drizzle ORM
6. **Frontend Display**: Results displayed in TagDisplay, SocialPreviews, and AISuggestions components
7. **Tag Generation**: Optional manual tag creation via TagGenerator component

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM
- **puppeteer**: Web scraping and page analysis
- **@google/generative-ai**: AI-powered SEO analysis with Gemini
- **@tanstack/react-query**: Client-side state management
- **@radix-ui/react-***: Accessible UI component primitives

### Development Dependencies
- **vite**: Frontend build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Server-side build tool
- **tailwindcss**: CSS framework
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` script

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY`: Google Gemini API authentication
- `NODE_ENV`: Environment configuration

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database
- Static file serving capability
- External API access for Google Gemini

## Changelog

Changelog:
- July 08, 2025: Initial setup with React frontend and Express backend
- July 08, 2025: Implemented Puppeteer web scraping with HTTP fallback
- July 08, 2025: Integrated Google Gemini AI for SEO analysis and suggestions
- July 08, 2025: Added multi-platform social media previews (Facebook, Twitter, LinkedIn)
- July 08, 2025: Created tag generator with JSON-LD support
- July 08, 2025: Implemented mobile-responsive design
- July 08, 2025: Added live tag preview with multi-platform social media visualization

## User Preferences

Preferred communication style: Simple, everyday language.