'server-only';
// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// // import { drizzle } from 'drizzle-orm/postgres-js';
// const client = neon(process.env.DATABASE_URL!);
// export const db = drizzle(client);
import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/neon-http';
// const databaseUrl = process.env.DATABASE_URL!;
// console.log(`src/lib/db/index.ts::databaseUrl: ${databaseUrl}`);
// export const db = drizzle(databaseUrl);


// // 对于 Node.js - 确保安装 'ws' 和 'bufferutil' 包
// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// neonConfig.webSocketConstructor = ws;
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// export const db = drizzle({ client: pool });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
const client = postgres(`${process.env.DATABASE_URL!}`);
export const db = drizzle(client);