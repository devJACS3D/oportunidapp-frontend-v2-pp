export class SuccessCaseDto {
  id: number;
  name: string;
  comment: string;
  rol: string;
  video: string;
  images: string[];
  constructor(data?: object) {
    Object.assign(this, data);
  }
}
