export interface IPost {
  id: number;
  name: string;
  description: string;
  author: string;
  images?: string[];
  aboutAuthor: string;
  createdAt?: string;
  updatedAt?: string;
}
