const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController'); // Добавьте эту строку

// Маршруты
router.get('/', exchangeController.getExchanges);
router.post('/', exchangeController.createExchange);
router.post('/propose', exchangeController.proposeExchange); // Теперь контроллер определен
router.post('/:exchangeId/complete', exchangeController.completeExchange);
router.delete('/:id', exchangeController.cancelExchange);
router.get('/history', exchangeController.getExchangeHistory);

module.exports = router;
