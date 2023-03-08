export interface ISuccessCase {
  id: number;
  name: string;
  comment: string;
  video: string;
  rol: string;
  images: string[];
  createdAt: string | Date;
  updatedAt?: string | Date;
  deletedAt: string | Date;
}
