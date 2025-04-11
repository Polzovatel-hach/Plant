const db = require('../config/db');

module.exports = {
  getAllPlants: async (type, region) => {
    let query = `
      SELECT p.*, u.имя as owner_name
      FROM "растения" p
      JOIN "пользователи" u ON p.id_пользователя = u.id
    `;

    const params = [];
    const conditions = [];

    if (type) {
      conditions.push(`p.тип = $${params.length + 1}`); // Корректное формирование условия
      params.push(type);
    }

    if (region) {
      conditions.push(`p.регион = $${params.length + 1}`); // Корректное формирование условия
      params.push(region);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const { rows } = await db.query(query, params); // Передача параметров в db.query
    return rows;
  },
getPlantById: async (id) => {
  const { rows } = await db.query(
    `SELECT p.*, u.имя as owner_name 
     FROM "растения" p
     JOIN "пользователи" u ON p.id_пользователя = u.id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0];
},

  createPlant: async ({ name, type, description, ownerId, region }) => {
    const { rows } = await db.query(
      `INSERT INTO "растения" (название, тип, описание, id_пользователя, регион)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, type, description, ownerId, region]
    );
    return rows[0];
  },

  updatePlant: async (id, { name, type, description, region }) => {
    const { rows } = await db.query(
      `UPDATE "растения"
       SET название = $1, тип = $2, описание = $3, регион = $4
       WHERE id = $5 RETURNING *`,
      [name, type, description, region, id]
    );
    return rows[0];
  },

  deletePlant: async (id) => {
    await db.query('DELETE FROM "растения" WHERE id = $1', [id]);
  },

  getPlantsByOwner: async (ownerId) => {
    const { rows } = await db.query('SELECT * FROM "растения" WHERE id_пользователя = $1', [ownerId]);
    return rows;
  }
};
