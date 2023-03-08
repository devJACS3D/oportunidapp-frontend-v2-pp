import { Component, OnInit } from '@angular/core';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ApiResponse } from '@apptypes/api-response';

@Component({
  selector: 'app-postulant',
  templateUrl: './postulant.component.html',
  styleUrls: ['./postulant.component.scss']
})
export class PostulantComponent implements OnInit {
  _loadingForm: any;
  _postulants: any;
  constructor(
    private api: Api,
    private alert: DialogService
  ) {

  }

  ngOnInit() {
    this.getPostulant();
  }
  //"{"ETag":"\"034d630c019b91748c6c55c4760857dc\"","Location":"https://oportunidapp-data.s3.amazonaws.com/profilePicture/profilePicture-2019-09-05T14%3A30%3A20%2B00%3A00-a74ff932f8c0333fcb3f2a1794e2663c.jpg","key":"profilePicture/profilePicture-2019-09-05T14:30:20+00:00-a74ff932f8c0333fcb3f2a1794e2663c.jpg","Key":"profilePicture/profilePicture-2019-09-05T14:30:20+00:00-a74ff932f8c0333fcb3f2a1794e2663c.jpg","Bucket":"oportunidapp-data"}"
  getPostulant() {

    this.api.get('user/all/postulate', null, 1, 100).subscribe((resp: ApiResponse) => {
      this._loadingForm = false;
      console.log('Postulantes', resp);
      this._postulants = resp.response;
      let i = 0;
      this._postulants.forEach(element => {

        let image: any;
        image = JSON.parse(element.user.image);
        console.log(image);
        element.user.image = image;

        this._postulants[i] = element;
        i = i + 1;
      });
      console.log(this._postulants);

      //Cargar datos necesario en formulario

    }, err => {
      // this._loadingForm = false;
      alert(err);
    });
  }

  goTo(e) {
    console.log('e', e);
    
  }


}
