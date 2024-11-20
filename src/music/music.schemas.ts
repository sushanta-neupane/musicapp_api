import Joi from 'joi';
import { music_filters } from './music.utils';
import { availablePlatform } from './music.utils';

export const MusicQuerySchema = Joi.object({
  query: Joi.string().min(1).max(100).required(),
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  isPlaylist: Joi.string().optional(),
  platform: Joi.string()
    .valid(...Object.keys(availablePlatform))
    .optional()
});
export const DiscoverQuerySchema = Joi.object({
  filter: Joi.string()
    .valid(...music_filters)
    .optional(),
  platform: Joi.string().valid(...Object.keys(availablePlatform))
});

export const DetailsQuerySchema = Joi.object({
  platform: Joi.string().valid(...Object.keys(availablePlatform)),
  id: Joi.string()
});

export const DownloadQuerySchema = Joi.object({
  id: Joi.string().required(),
  platform: Joi.string().required()
});
