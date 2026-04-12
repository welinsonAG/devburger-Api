import { Client } from 'pg';

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'devburger',
  port: 5432,
});

await client.connect();

function normalize(value) {
  try {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return normalize(parsed);
    }
    if (Array.isArray(value)) {
      return value.map(normalize);
    }
    if (typeof value === 'object' && value !== null) {
      const result = {};
      for (const key in value) {
        result[key] = normalize(value[key]);
      }
      return result;
    }
    return value;
  } catch {
    return value;
  }
}

function safeJson(value) {
  try {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  } catch {
    return []; // ou [] se preferir
  }
}

// 🔒 cria tabela de backup + evita duplicação
async function ensureBackupTable() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS products_backup (
      id SERIAL PRIMARY KEY,
      original_id INT UNIQUE, -- 🔥 impede duplicar backup
      name TEXT,
      price INT,
      images JSONB,
      offer BOOLEAN,
      category_id INT,
      backup_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

async function normalizeWithSafeBackup() {
  const table = 'products';
  const column = 'images';

  await ensureBackupTable();

  const res = await client.query(`SELECT * FROM ${table}`);

  for (const row of res.rows) {
    // 🔒 verifica se já existe backup
    const exists = await client.query(
      `SELECT 1 FROM products_backup WHERE original_id = $1`,
      [row.id]
    );

    if (exists.rowCount > 0) {
        await client.query(
          `INSERT INTO products_backup (original_id, name, price, images, offer, category_id)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (original_id) DO NOTHING`, // 🔥 evita duplicação
            [
              row.id,
              row.name,
              row.price,
              JSON.stringify(safeJson(row.images)), // 🔥 CORREÇÃO AQUI
                row.offer,
                row.category_id
            ]
          );

      console.log(`Backup do registro ${row.id} criado 💾`);
    } else {
      console.log(`Backup do registro ${row.id} já existe ⚠️`);
    }

   

    // normaliza
    const normalized = normalize(row[column]);

   await client.query(
        `UPDATE ${table} SET ${column} = $1 WHERE id = $2`,
        [JSON.stringify(normalized), row.id]
      );
      
    console.log(`Registro ${row.id} normalizado ✅`);
  }

  console.log('🔥 PROCESSO FINALIZADO COM SEGURANÇA TOTAL!');
  await client.end();
}

normalizeWithSafeBackup().catch(console.error);