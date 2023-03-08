import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS } from 'src/app/constants/constants';

@Component({
  selector: 'app-save-fpo-item',
  templateUrl: './save-fpo-item.component.html',
  styleUrls: ['./save-fpo-item.component.scss']
})
export class SaveFPOItemComponent implements OnInit {

  header = 'Crear item';
  submitting$:Subject<boolean> = new Subject();
  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private alert:DialogService,
    private api:Api
  ) { }

  ngOnInit() {
  }


  save(payload:any){
    this.submitting$.next(true);
    console.log(payload);
    this.api.post(Entities.fpoItems,{items:payload.items})
    .pipe(
      finalize(() => this.submitting$.next(false) )
    ).subscribe(res => {
      console.log(res);
      this.successAlert(res.message);
      this.router.navigate(['../list'],{relativeTo:this.activatedRoute});
    })
    
  }

   /* ................................................................................................. */
  /* ALERTS */
  /* ................................................................................................. */
  successAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.SUCCESS,
      icon: COLORS.SUCCESS,
      bgBottom: true,
      autoClose: true
    })
  }

  errorAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.DANGER,
      icon: COLORS.WARNING,
      bgTop: true,
      autoClose: true
    })
  }

}
