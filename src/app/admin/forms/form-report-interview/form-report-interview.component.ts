import { Component, OnInit } from '@angular/core';
import { Api } from '@utils/api';
import { ActivatedRoute } from '@angular/router';

import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-form-report-interview',
  templateUrl: './form-report-interview.component.html',
  styleUrls: ['./form-report-interview.component.scss']
})
export class FormReportInterviewComponent implements OnInit {
  testData: any;
  _idUser: any;
  _vacancyId: any;
  user: any;
  date: any;
  title: any;
  vacancy_data: any;
  constructor(private api: Api, private activatedRoute: ActivatedRoute, ) { }

  ngOnInit() {
    this._idUser = this.activatedRoute.snapshot.params.id; // user id
    this._vacancyId = this.activatedRoute.snapshot.params.vacancyId;

    this.getData();
    this.getUserById(this._idUser);

    this.date = new Date();
   
  }
  // http://localhost:4200/admin/candidates/1/0/form-report-interview/1/1
  async getData() {
    let data = await this.api.get('administrator/resport/interviewsAndFerencesLaborals', null, 1, 1000, { vacancyId: this._vacancyId, userId: this._idUser }).toPromise();
    this.testData = data.response;
    let vacancy = await this.api.get('administrator/vacancy/'+this._vacancyId, null, 1, 1000).toPromise();
    this.vacancy_data = vacancy.response
    console.log('getDatainterviews ', data);
  }

  generarPDF() {


    html2canvas(document.getElementById('contenido'), {
      // Opciones
      allowTaint: true,
      useCORS: false,

      // Calidad del PDF
      scale: 1
    }).then(function (canvas) {
      var img = canvas.toDataURL("image/png");
      var doc = new jsPDF();

      doc.addImage(img, 'PNG', 7, 20, 180, 105);

      doc.save('postres.pdf');
    });
  }

  getUserById(id) {
    this.api.get('user/' + id).subscribe(
      (data: any) => {
        console.log(data.user);
        this.user = data.user;
        this.title = data.title;
      }, err => {
        console.log(err);

      });
  }

}
