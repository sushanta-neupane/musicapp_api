import Joi from 'joi';

// Add Favorite Schema
export const addFavSchema = Joi.object({
  userId: Joi.string().required(),
  musicId: Joi.string().required(),
  platform: Joi.string().required(),
  title: Joi.string().required(),
  artist: Joi.string().required(),
  thumbnail: Joi.string().uri().required()
});

// Remove Favorite Schema
export const removeFavSchema = Joi.object({
  id: Joi.string().required()
});
export const removeFavByDataSchema = Joi.object({
  userId: Joi.string().required(),
  musicId: Joi.string().required(),
  platform: Joi.string().required(),
  title: Joi.string().required(),
  artist: Joi.string().required(),
  thumbnail: Joi.string().uri().required()
});

// Clear Favorites Schema
export const clearFavSchema = Joi.object({
  userId: Joi.string().required()
});

// Toggle Favorite Schema
export const toggleFavSchema = Joi.object({
  userId: Joi.string().required(),
  musicId: Joi.string().required(),
  platform: Joi.string().required(),
  title: Joi.string().required(),
  artist: Joi.string().required(),
  thumbnail: Joi.string().uri().required()
});

// List Favorites Schema
export const listFavSchema = Joi.object({
  userId: Joi.string().required()
});
