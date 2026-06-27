import pg from 'pg';

const { Client } = pg;

// Conecta à base de dados padrão 'postgres' para podermos criar a nossa
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: '123', // Senha configurada localmente
  port: 5432,
  database: 'postgres',
});

async function createDb() {
  try {
    await client.connect();
    
    // Verifica se a base 'magugi' já existe
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'magugi'");
    
    if (res.rowCount === 0) {
      console.log("A criar a base de dados 'magugi'...");
      await client.query("CREATE DATABASE magugi");
      console.log("✅ Base de dados 'magugi' criada com sucesso!");
    } else {
      console.log("✅ Base de dados 'magugi' já existe.");
    }
  } catch (err) {
    console.error("❌ Erro ao verificar/criar a base de dados (verifica se a senha está correta):", err.message);
  } finally {
    await client.end();
  }
}

createDb();
