const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

const dbConfig = {
  host: 'db',
  user: 'root',
  password: 'password',
  database: 'fullcycle',
};

async function createPool(config) {
  return mysql.createPool(config);
}

let pool;
(async () => {
  pool = await createPool(dbConfig);
})();

async function handleInsertName(name) {
  await pool.query('INSERT INTO people (name) VALUES (?)', [name]);
}

async function handleGetAllPeople() {
  try {
    const data = await new Promise((resolve, reject) => {
      pool.query(`SELECT * from fullcycle.people;`, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function handleRenderTable(people) {
  const tableRows = people.map(person => 
    `
    <tr>
      <td>${person.id}</td>
      <td>${person.name}</td>
    </tr>
  `).join(' ');

  return `
    <h1>Full Cycle Rocks!</h1>
    <table>
      <tr>
        <th>#</th>
        <th>Name</th>
      </tr>
      ${tableRows}
    </table>
  `;
}

app.get('/', async (_req, res) => {
  try {
    const name = "Érick Schaedler";
    await handleInsertName(name);

    const people = await handleGetAllPeople();
    res.send(handleRenderTable(people));
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno no servidor');
  }
});

app.listen(PORT, () => {
  console.log(`Server rodando na porta: ${PORT}`);
});
