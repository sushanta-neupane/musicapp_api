import { Favorite } from '@prisma/client';
import db from '../db';

// Adds a favorite entry
export const addFav = async (data: Favorite) => {
  return db.favorite.create({ data });
};

// Removes a favorite by data
export const removeFav = async (data: Favorite) => {
  return db.favorite.delete({
    where: { musicAnduser: { musicId: data.musicId, userId: data.userId } }
  });
};

// Toggles a favorite entry: adds if not found, removes if found
export const toggleFav = async (data: Favorite) => {
  const existingFav = await db.favorite.findFirst({
    where: {
      userId: data.userId,
      musicId: data.musicId
    }
  });

  if (existingFav) {
    const deletedFav = await db.favorite.delete({
      where: { id: existingFav.id }
    });
    return { status: 'removed', isLiked: false, favorite: deletedFav };
  } else {
    const newFavorite = await db.favorite.create({ data });
    return { status: 'added', isLiked: true, favorite: newFavorite };
  }
};

// Lists all favorites for a specific user
export const listFav = async (userId: string) => {
  return db.favorite.findMany({
    where: { userId }
  });
};

export const clearFav = async (userId: string) => {
  return db.favorite.deleteMany({
    where: { userId }
  });
};
