const { Pool } = require('pg');

const pool = new Pool({
  user: 'plant_user',
  host: 'localhost',
  database: 'plant_exchange',
  password: 'пароль123', // Должен совпадать с паролем в БД
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

/*const client = new Client({
  user: 'plant_user',
  host: 'localhost',
  database: 'plant_exchange',
  password: 'пароль123',
  port: 5432,
});

/// Добавьте этот код для проверки подключения
pool.query('SELECT current_user')
  .then(res => console.log('Текущий пользователь БД:', res.rows[0].current_user))
  .catch(err => console.error('Ошибка подключения:', err));
*/
