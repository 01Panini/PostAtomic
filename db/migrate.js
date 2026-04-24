import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __dir = dirname(fileURLToPath(import.meta.url));
const sql = neon(process.env.DATABASE_URL);
const schema = readFileSync(join(__dir, 'schema.sql'), 'utf8');

// Split on semicolons, run each statement individually
const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);

try {
    for (const stmt of statements) {
        await sql.query(stmt);
    }
    console.log(`✅ Migration complete — ${statements.length} statements executed`);
} catch (e) {
    console.error('❌ Migration failed:', e.message);
    process.exit(1);
}
