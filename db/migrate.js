#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
// Database migration script - runs schema.sql against Turso database

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are required.');
    process.exit(1);
  }

  console.log('📦 Connecting to Turso database...');
  const client = createClient({ url, authToken });

  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('🔄 Running migrations...');
  
  try {
    // Split SQL into individual statements and execute them one by one
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await client.execute(statement);
    }
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

migrate();
