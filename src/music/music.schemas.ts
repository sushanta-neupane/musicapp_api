import Joi from 'joi';

export const MusicQuerySchema = Joi.object({
  query: Joi.string().min(1).max(100).required(),
  page: Joi.number().optional(),
  limit: Joi.number().optional()
});

export const DownloadQuerySchema = Joi.object({
  query: Joi.string().required(),
  id: Joi.string().optional(),
  type: Joi.string().required()
});
