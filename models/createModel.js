const mongoose = require('mongoose');
const historyPlugin = require('./plugins/historyPlugin');

/**
 * Creates a mongoose model with history tracking enabled
 * @param {string} modelName - Name of the model
 * @param {Object} schemaDefinition - Schema field definitions
 * @param {Object} options - Schema options
 * @returns {mongoose.Model} - The created model
 */
function createModel(modelName, schemaDefinition, options = {}) {
  console.log(`Creating model: ${modelName}`);
  const schema = new mongoose.Schema(schemaDefinition, {
    timestamps: true,
    ...options
  });

  schema.plugin(historyPlugin, { modelName });

  return mongoose.model(modelName, schema);
}

module.exports = createModel;