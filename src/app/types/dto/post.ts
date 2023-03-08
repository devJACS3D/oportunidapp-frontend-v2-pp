export class PostDto {
  id: number | string;
  name: string;
  description: string;
  aboutAuthor: string;
  author: string;
  images: string[]

  constructor(data?: object) {
    Object.assign(this, data);
  }
}
