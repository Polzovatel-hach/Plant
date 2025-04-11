const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController'); // <-- Объявление plantController

router.get('/', plantController.getAllPlants); // <-- Использование plantController
router.get('/:id(\d+)', plantController.getPlantById);
router.post('/', plantController.createPlant);
router.put('/:id(\d+)', plantController.updatePlant);
router.delete('/:id(\d+)', plantController.deletePlant);

module.exports = router;


