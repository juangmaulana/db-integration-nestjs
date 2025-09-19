# Database Configuration Guide

This NestJS application supports multiple database backends through TypeORM: PostgreSQL, MongoDB, and SQLite.

## Quick Start

1. Copy the appropriate environment file:
   ```bash
   # For PostgreSQL
   cp .env.postgres.example .env
   
   # For MongoDB
   cp .env.mongodb.example .env
   
   # For SQLite (default)
   cp .env.sqlite.example .env
   ```

2. Update the database credentials in your `.env` file

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the application:
   ```bash
   npm run start:dev
   ```

## Database Configurations

### PostgreSQL
- Configuration: `src/config/database/postgres.config.ts`
- Environment: `.env.postgres.example`
- Required dependencies: `pg`, `@types/pg`

### MongoDB
- Configuration: `src/config/database/mongodb.config.ts`
- Environment: `.env.mongodb.example`
- Required dependencies: `mongodb`
- Uses MongoDB-specific entities in `src/*/entities/mongodb/`

### SQLite
- Configuration: `src/config/database/sqlite.config.ts`
- Environment: `.env.sqlite.example`
- Required dependencies: `sqlite3`

## Entity Compatibility

### Standard Entities (PostgreSQL/SQLite)
- Located in `src/*/entities/*.entity.ts`
- Use `@PrimaryGeneratedColumn()` for auto-increment IDs
- Use `@CreateDateColumn()` and `@UpdateDateColumn()` for timestamps

### MongoDB Entities
- Located in `src/*/entities/mongodb/*.entity.ts`
- Use `@ObjectIdColumn()` for MongoDB ObjectId
- Include getter for string ID conversion
- Use array fields for references instead of relations

## Switching Databases

Simply change the `DATABASE_TYPE` environment variable:
- `sqlite` (default)
- `postgres` or `postgresql`
- `mongodb` or `mongo`

The application will automatically use the appropriate configuration and entities.