import { User } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      decoded?: User;
      undecoded?: User;
      images?: [];
      uploadDir?: string;
      allowGuest?: true;
      email?: string;
      auth?: { userId: string | null; sessionId: string | null };
    }
  }
}
