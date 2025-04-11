const db = require('../config/db');

module.exports = {
  getUserById: async (id) => {
    const { rows } = await db.query('SELECT * FROM "пользователи" WHERE id = $1', [id]);
    return rows[0];
  },

  createUser: async ({ login, password, name, city }) => {
    const { rows } = await db.query(
      `INSERT INTO "пользователи" (логин, пароль, имя, город) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [login, password, name, city]
    );
    return rows[0];
  }
};
