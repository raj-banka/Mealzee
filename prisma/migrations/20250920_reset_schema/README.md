Migration: reset_schema
Generated: 2025-09-20

This migration recreates the `User` and `Order` tables and related
indexes/foreign keys from the Prisma schema. Applied when you want a
fresh, empty database schema for production.

To apply on production:

1. Commit and push this migration directory to the remote repository.
2. On a machine with direct access to the production Postgres, run:

   npx prisma generate
   npx prisma migrate deploy
