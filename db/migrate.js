#!/usr/bin/env node
// Database migration script - runs schema.sql against Turso database

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
    await client.execute(sql);
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

migrate();
