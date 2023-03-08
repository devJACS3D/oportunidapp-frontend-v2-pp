import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'upload-picture',
  templateUrl: './upload-picture.component.html',
  styleUrls: ['./upload-picture.component.scss']
})
export class UploadPictureComponent implements OnInit {
  @Input('imageSrc') imgSrc: string = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_13.jpg';
  @Output('onFiles') onFiles: EventEmitter<File | File[]> = new EventEmitter();
  file: File;
  constructor() { }

  ngOnInit() {
  }

  public onInputImageChange(e) {
    /* this._vacancyImage.Name = e.target.value;
    this._vacancyImage.Data = e.target.files[0]; */
    this.file = e.target.files[0];
    this.onFiles.emit(this.file);
    this.getImage(this.file);
  }

  public getImage(file: any) {
    let reader: FileReader = new FileReader();
    if (file.type.startsWith('image')) {
      reader.onload = (e) => {
        let url = reader.result;
        this.imgSrc = url as string;
      }
      reader.readAsDataURL(file);
    } else {
      alert('¡Sólo se admiten imágenes!');
    }
  }
}
