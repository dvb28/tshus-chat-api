import mongoose from 'mongoose';

export type RoomPageDto = {
  page: number;

  room: mongoose.Types.ObjectId;
};
