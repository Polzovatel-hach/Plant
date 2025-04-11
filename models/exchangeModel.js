const db = require('../config/db');

const exchangeModel = {
  createExchange: async ({ plantId, userId, desiredType }) => {
    const { rows } = await db.query(
      `INSERT INTO "предложения_обмена" 
       (id_растения_от, id_пользователя_инициатора, статус, id_растения_к)
       VALUES ($1, $2, 'ожидание', $3) RETURNING *`,
      [plantId, userId, desiredType]
    );
    return rows[0];
  },

getExchanges: async () => {
  try {
    const { rows } = await db.query(`
      SELECT
        e.*,
        p1.название as растение_от,
        p1.тип as тип_растения_от,
        p2.название as растение_к,
        u.имя as инициатор
      FROM "предложения_обмена" e
      JOIN "растения" p1 ON e.id_растения_от = p1.id
      LEFT JOIN "растения" p2 ON e.id_растения_к = p2.id
      JOIN "пользователи" u ON e.id_пользователя_инициатора = u.id
    `);
    console.log('Результат запроса обменов:', rows); // Лог запроса
    return rows;
  } catch (error) {
    console.error('Ошибка SQL запроса:', error);
    throw error;
  }
},

  completeExchange: async (exchangeId, receiverId) => {
    try {
      await db.query('BEGIN');

      // Обновляем статус предложения
      await db.query(
        `UPDATE "предложения_обмена" 
         SET статус = 'завершен' 
         WHERE id = $1`,
        [exchangeId]
      );

      // Добавляем запись в историю
      const { rows } = await db.query(
        `INSERT INTO "история_обменов" 
         (id_предложения, id_получателя, статус)
         VALUES ($1, $2, 'завершен') RETURNING *`,
        [exchangeId, receiverId]
      );

      await db.query('COMMIT');
      return rows[0];
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  },

  getExchangeById: async (id) => {
    const { rows } = await db.query(
      `SELECT * FROM "предложения_обмена" WHERE id = $1`,
      [id]
    );
    return rows[0];
  },

  cancelExchange: async (id) => {
    await db.query(
      `UPDATE "предложения_обмена" 
       SET статус = 'отменен' 
       WHERE id = $1`,
      [id]
    );
  },

proposeExchange: async ({ plantId, desiredPlantId, userId }) => {
    try {
        // Проверка существования растений
        const plantCheck = await db.query(
            'SELECT id FROM "растения" WHERE id IN ($1, $2)',
            [plantId, desiredPlantId]
        );
        
        if (plantCheck.rows.length !== 2) {
            throw new Error('Одно из растений не найдено');
        }

        // Проверка, что растения принадлежат разным пользователям
        const ownersCheck = await db.query(
            `SELECT id_пользователя FROM "растения" 
             WHERE id IN ($1, $2)`,
            [plantId, desiredPlantId]
        );
        
        if (ownersCheck.rows[0].id_пользователя === ownersCheck.rows[1].id_пользователя) {
            throw new Error('Нельзя обмениваться растениями с самим собой');
        }

        // Создание предложения
        const { rows } = await db.query(
            `INSERT INTO "предложения_обмена" 
             (id_растения_от, id_растения_к, id_пользователя_инициатора, статус)
             VALUES ($1, $2, $3, 'ожидание') 
             RETURNING *`,
            [plantId, desiredPlantId, userId]
        );

        return rows[0];
    } catch (error) {
        console.error('Ошибка в SQL запросе:', error);
        throw error;
    }
},

  getExchangeHistory: async () => {
    const { rows } = await db.query(`
      SELECT 
        h.*,
        e.id_растения_от,
        p1.название as растение_от,
        e.id_растения_к,
        p2.название as растение_к,
        u.имя as инициатор
      FROM "история_обменов" h
      JOIN "предложения_обмена" e ON h.id_предложения = e.id
      JOIN "растения" p1 ON e.id_растения_от = p1.id
      LEFT JOIN "растения" p2 ON e.id_растения_к = p2.id
      JOIN "пользователи" u ON e.id_пользователя_инициатора = u.id
      ORDER BY h.дата_создания DESC
    `);
    return rows;
  }
};

module.exports = exchangeModel;
