import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';


import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Api } from '@utils/api';
import { ActivatedRoute } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-form-report',
  templateUrl: './form-report.component.html',
  styleUrls: ['./form-report.component.scss']
})
export class FormReportComponent implements OnInit, AfterViewInit {

  @ViewChild('cont') cont: ElementRef;

  testData: any;
  _idUser: any;
  _vacancyId: any;
  dataCharArray: any;
  public contentHeight: number;

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  constructor(private api: Api, private activatedRoute: ActivatedRoute, ) {
    // admin/candidates/1/1/form-report/1/1
    this.dataCharArray = [];
    this.contentHeight = 100;

  }

  ngOnInit() {
    this._idUser = this.activatedRoute.snapshot.params.id; // user id
    this._vacancyId = this.activatedRoute.snapshot.params.vacancyId;

    this.getTestData();
  }

  ngAfterViewInit() { }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }

  generarPDF() {
    html2canvas(document.getElementById('contenido'), {
      // Opciones
      allowTaint: true,
      useCORS: false,

      // Calidad del PDF
      scale: 1,
    }).then(function (canvas) {
      var img = canvas.toDataURL("image/png");
      var doc = new jsPDF();
      doc.addImage(img, 'PNG', 7, 20, 195, 105);
      doc.save('report.pdf');
    });
  }

  async getTestData() {
    let data = await this.api.get('administrator/resport/test', null, 1, 1000, { vacancyId: this._vacancyId, userId: this._idUser }).toPromise();
    this.testData = data.response;
    console.log('getTestData', data);
    // iterar en array test que ose las pruebas realizadas de un vacnte
    this.testData.vacancy.tests.forEach(element2 => {
      // Iterar questionstest
      let questionstest: [];
      let label;
      element2.questionstest.forEach(element3 => {
        questionstest = element3.questions
        label = element3.questions
        // buscar en testAnswers las respuesta por questionsTestId
        let testAnswers: number[];
        // Iterar testAnswers answers
        element2.testAnswers.forEach(element4 => {
          if (element3.id === element4.questionsTestId) {
            testAnswers = element4.answers
          }
        });
        console.log('questionstest', questionstest);
        console.log('testAnswers', testAnswers);
        this.dataCharArray.push({
          radarChartLabels: questionstest,
          radarChartData: [{ data: testAnswers, label: element3.skill.name }]
        })
      });
      // añadir questionstest y answers al array de graficas
    });
    console.log('dataCharArray', this.dataCharArray);

  }


}
