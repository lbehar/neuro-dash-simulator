# NeuroLink Dashboard - Brain-Computer Interface Monitoring System

## Overview

This is a full-stack web application for monitoring brain-computer interface (BCI) data, specifically designed for EEG (electroencephalography) signal monitoring and visualization. The application provides a dashboard for clinicians and researchers to view real-time EEG data, manage patient sessions, and monitor brain activity patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store

### Development Environment
- **Platform**: Replit with PostgreSQL 16 module
- **Hot Reload**: Vite dev server with HMR
- **Build Process**: ESBuild for server bundling, Vite for client bundling

## Key Components

### Database Schema
- **Users Table**: Stores user authentication data (username, password)
- **Sessions Table**: Tracks patient monitoring sessions with metadata (patient info, session timing, user role)
- **EEG Data Table**: Stores real-time EEG measurements (session ID, timestamp, value)

### Authentication & Authorization
- Role-based access with two user types: Clinician and Researcher
- Simple localStorage-based session persistence (client-side)
- No complex authentication backend currently implemented

### Real-time Data Simulation
- EEG data simulator that generates realistic brain signal patterns
- Configurable data points and update intervals
- Chart.js integration for real-time visualization

### UI Components
- Comprehensive design system using shadcn/ui
- Responsive layout with mobile-first approach
- Dark/light theme support built into CSS variables
- Professional medical application styling

## Data Flow

1. **User Authentication**: Users select their role (Clinician/Researcher) on login page
2. **Session Management**: Role is stored in localStorage and checked on dashboard access
3. **EEG Data Generation**: Client-side simulator generates mock EEG data points
4. **Real-time Visualization**: Data flows through React state to Chart.js for live plotting
5. **Database Operations**: Prepared but not yet implemented - storage interface ready for CRUD operations

## External Dependencies

### Frontend Dependencies
- **UI Framework**: Radix UI primitives for accessible components
- **Data Visualization**: Chart.js (referenced but not yet implemented)
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with PostCSS processing

### Backend Dependencies
- **Database**: Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod schemas for type-safe data validation

### Development Dependencies
- **Build Tools**: Vite, ESBuild, TypeScript
- **Replit Integration**: Cartographer plugin for development
- **Error Handling**: Runtime error overlay for development

## Deployment Strategy

### Development
- Runs on Replit with `npm run dev`
- Uses Vite dev server for frontend with HMR
- TSX for server execution with hot reload
- PostgreSQL 16 module provides database

### Production
- Build process: `npm run build`
- Vite builds frontend to `dist/public`
- ESBuild bundles server to `dist/index.js`
- Start command: `npm run start`
- Autoscale deployment target on Replit

### Database Management
- Drizzle Kit for schema migrations
- Environment-based database URL configuration
- Push migrations with `npm run db:push`

## Current Implementation Status

The application is currently in development with:
- ✅ Frontend UI components and routing complete
- ✅ Database schema defined and ready
- ✅ EEG data simulation working
- ✅ Basic authentication flow implemented
- 🔄 Backend API routes need implementation
- 🔄 Database integration pending
- 🔄 Real-time data persistence not yet connected
- 🔄 Chart.js integration needs completion

The architecture is well-prepared for completing the backend integration and making this a fully functional BCI monitoring system.