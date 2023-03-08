import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { image, IFile } from '@apptypes/image';
// import { reject } from 'q';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ApiResponse } from '@apptypes/api-response';

@Component({
  selector: 'app-user-wiew-postulant',
  templateUrl: './user-wiew-postulant.component.html',
  styleUrls: ['./user-wiew-postulant.component.scss']
})
export class UserWiewPostulantComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
