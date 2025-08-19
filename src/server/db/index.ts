// 'server-only';
// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// // import { drizzle } from 'drizzle-orm/postgres-js';
// const client = neon(process.env.DATABASE_URL!);
// export const db = drizzle(client);
// import 'dotenv/config';
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

import * as schema from "@/server/db/schema"

import { drizzle } from 'drizzle-orm/postgres-js'
// import { drizzle } from 'drizzle-orm/neon-http';
import postgres from 'postgres'

// 全局变量来保存连接实例（用于开发环境避免热重载时创建多个连接）
declare global {
  var __db: ReturnType<typeof drizzle> | undefined
  var __client: ReturnType<typeof postgres> | undefined
}

let client: ReturnType<typeof postgres>
let db: ReturnType<typeof drizzle>

if (process.env.NODE_ENV === 'production') {
  // 生产环境：直接创建连接
  client = postgres(`${process.env.DATABASE_URL!}`, {
    max: 10, // 最大连接数
    idle_timeout: 20, // 空闲超时（秒）
    connect_timeout: 10, // 连接超时（秒）
    prepare: false, // 在某些情况下可以避免连接问题
  })
  db = drizzle(client, { schema: schema })
} else {
  // 开发环境：使用全局变量避免热重载时重复创建连接
  if (!global.__client) {
    global.__client = postgres(`${process.env.DATABASE_URL!}`, {
      max: 5, // 开发环境使用较少连接数
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    })
  }
  if (!global.__db) {
    global.__db = drizzle(global.__client, { schema: schema })
  }
  client = global.__client
  db = global.__db
}

export { db }
// 检查本地数据库: "postgresql://aa@localhost:5432/mcc_next_local" 
// 进入: // psql postgres://aa@localhost:5432/mcc_next_local

// import { drizzle } from 'drizzle-orm/neon-http';

// export const db = drizzle(process.env.DATABASE_URL!, {schema:schema});