
const plantModel = require('../models/plantModel');

// Создаем объект контроллера
const plantController = {
  getAllPlants: async (req, res) => {
    try {
      const { type, region } = req.query;
      const plants = await plantModel.getAllPlants(type, region);
      
      res.json({
        success: true,
        count: plants.length,
        data: plants
      });
    } catch (error) {
      console.error('Error getting plants:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch plants',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

getPlantById: async (req, res) => {
  try {
    const plant = await plantModel.getPlantById(req.params.id);
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

  createPlant: async (req, res) => {
    try {
      const newPlant = await plantModel.createPlant(req.body);
      res.status(201).json({
        success: true,
        data: newPlant
      });
    } catch (error) {
      console.error('Error creating plant:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to create plant',
        details: error.message
      });
    }
  },

  updatePlant: async (req, res) => {
    try {
      const updatedPlant = await plantModel.updatePlant(
        req.params.id,
        req.body
      );
      res.json({
        success: true,
        data: updatedPlant
      });
    } catch (error) {
      console.error('Error updating plant:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to update plant'
      });
    }
  },

  deletePlant: async (req, res) => {
    try {
      await plantModel.deletePlant(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting plant:', error);
      res.status(400).json({
        success: false,
        error: 'Failed to delete plant'
      });
    }
  }
};

// Экспортируем объект контроллера
module.exports = plantController;/*const plantModel = require('../models/plantModel');

module.exports = {
  getAllPlants: async (req, res) => {
    try {
      const { type, region } = req.query;
      const plants = await plantModel.getAllPlants(type, region);
      
      res.json({
        success: true,
        count: plants.length,
        data: plants
      });
    } catch (error) {
      console.error('Error getting plants:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch plants'
      });
    }
  }
},

  getPlantById: async (req, res) => {
    try {
      const plant = await plantModel.getPlantById(req.params.id);
      if (!plant) return res.status(404).json({ error: 'Plant not found' });
      res.json(plant);
    } catch (error) {
      console.error('Error in getPlantById:', error);
      res.status(500).json({ error: 'Failed to fetch plant' });
    }
  },

  createPlant: async (req, res) => {
    try {
      const newPlant = await plantModel.createPlant(req.body);
      res.status(201).json(newPlant);
    } catch (error) {
      console.error('Error in createPlant:', error);
      res.status(400).json({ error: 'Failed to create plant' });
    }
  },

  updatePlant: async (req, res) => {
    try {
      const updatedPlant = await plantModel.updatePlant(req.params.id, req.body);
      res.json(updatedPlant);
    } catch (error) {
      console.error('Error in updatePlant:', error);
      res.status(400).json({ error: 'Failed to update plant' });
    }
  },

  deletePlant: async (req, res) => {
    try {
      await plantModel.deletePlant(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('Error in deletePlant:', error);
      res.status(400).json({ error: 'Failed to delete plant' });
    }
  }
};
*/
