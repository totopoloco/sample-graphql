import mongoose, { Schema, Document, Model } from 'mongoose';
import historyPlugin from './plugins/historyPlugin';

/**
 * Creates a mongoose model with history tracking enabled
 * @param modelName - Name of the model
 * @param schemaDefinition - Schema field definitions
 * @param options - Schema options
 * @returns The created model
 */
function createModel<T extends Document>(
  modelName: string,
  schemaDefinition: Record<string, any>,
  options: mongoose.SchemaOptions = {}
): Model<T> {
  console.log(`Creating model: ${modelName}`);
  const schema = new Schema(schemaDefinition, {
    timestamps: true,
    ...options
  });

  schema.plugin(historyPlugin, { modelName });

  return mongoose.model<T>(modelName, schema);
}

export default createModel;
