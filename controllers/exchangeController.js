const exchangeModel = require('../models/exchangeModel');

const exchangeController = {
  createExchange: async (req, res) => {
    try {
      const { plantId, userId, desiredType } = req.body;
      if (!plantId || !userId) {
        return res.status(400).json({ error: 'Не указаны обязательные поля' });
      }

      const exchange = await exchangeModel.createExchange({
        plantId,
        userId,
        desiredType
      });
      res.status(201).json(exchange);
    } catch (error) {
      console.error('Exchange creation error:', error);
      res.status(500).json({ 
        error: 'Не удалось создать предложение обмена',
        details: error.message 
      });
    }
  },

getExchanges: async (req, res) => {
  try {
    const exchanges = await exchangeModel.getExchanges();
    console.log('Получены обмены:', exchanges); // Добавьте лог
    res.json({
      success: true,
      data: exchanges
    });
  } catch (error) {
    console.error('Ошибка получения обменов:', error);
    res.status(500).json({ 
      success: false,
      error: 'Не удалось получить список обменов',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
},

  completeExchange: async (req, res) => {
    try {
      const exchange = await exchangeModel.completeExchange(
        req.params.exchangeId,
        req.body.receiverId
      );
      res.json({
        success: true,
        data: exchange
      });
    } catch (error) {
      console.error('Complete exchange error:', error);
      res.status(400).json({
        success: false,
        error: 'Не удалось завершить обмен',
        details: error.message
      });
    }
  },
proposeExchange: async (req, res) => {
    try {
        console.log('Получен запрос на обмен:', req.body);
        
        const { plantId, desiredPlantId, userId } = req.body;
        
        if (!plantId || !desiredPlantId || !userId) {
            return res.status(400).json({ 
                success: false,
                error: 'Необходимо указать plantId, desiredPlantId и userId'
            });
        }

        const exchange = await exchangeModel.proposeExchange({
            plantId,
            desiredPlantId,
            userId
        });

        res.json({
            success: true,
            data: exchange
        });
    } catch (error) {
        console.error('Ошибка в proposeExchange:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка сервера при создании обмена',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
},
  getExchangeById: async (req, res) => {
    try {
      const exchange = await exchangeModel.getExchangeById(req.params.id);
      if (!exchange) {
        return res.status(404).json({ 
          success: false,
          error: 'Предложение обмена не найдено' 
        });
      }
      res.json({
        success: true,
        data: exchange
      });
    } catch (error) {
      console.error('Get exchange error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Не удалось получить предложение обмена',
        details: error.message 
      });
    }
  },

  cancelExchange: async (req, res) => {
    try {
      await exchangeModel.cancelExchange(req.params.id);
      res.json({
        success: true,
        message: 'Предложение обмена отменено'
      });
    } catch (error) {
      console.error('Cancel exchange error:', error);
      res.status(400).json({
        success: false,
        error: 'Не удалось отменить предложение обмена',
        details: error.message
      });
    }
  },
getExchangeHistory: async (req, res) => {
  try {
    const history = await exchangeModel.getExchangeHistory();
    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('Get exchange history error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Не удалось получить историю обменов',
      details: error.message 
    });
  }
}
};

module.exports = exchangeController;
