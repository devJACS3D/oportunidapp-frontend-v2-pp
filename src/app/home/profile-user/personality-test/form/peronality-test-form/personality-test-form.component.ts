import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from '@apptypes/IModal';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Observable, of, Subject } from 'rxjs';
import { finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS } from 'src/app/constants/constants';

@Component({
  selector: 'app-peronality-test-form',
  templateUrl: './personality-test-form.component.html',
  styleUrls: ['./personality-test-form.component.scss']
})
export class PersonalityTestFormComponent implements OnInit {

  items: FormArray;
  itemsPerPage: number = 10;
  pageIndex$: Subject<number> = new Subject();
  questions$: Observable<AbstractControl[]>;
  submitting$: Subject<boolean> = new Subject();
  totalPages: number;
  currentPage: number;
  constructor(
    @Inject(MODAL_DATA) public questions: any[],
    @Inject(MODAL_REFERENCE) private ref: IModalReference,
    private formBuilder: FormBuilder,
    private api: Api,
    private alert: DialogService
  ) { }

  ngOnInit() {
    this.totalPages = Math.ceil(this.questions.length / this.itemsPerPage);
    this.items = this.setItems()

    this.questions$ = this.pageIndex$.pipe(
      startWith(1),
      tap(page => this.currentPage = page),
      switchMap((page) => this.paginate(page))
    );
  }

  setItems(): FormArray {
    const questions = this.formBuilder.array([]);
    this.questions.forEach(q => {
      questions.push(this.formBuilder.group({
        itemId: [q.itemId],
        question: [q.question],
        answerValue: [null, [Validators.required]],
        answers: this.setItemAnswers(q.answers)
      }));
    });

    return questions;
  }

  randomValue(min,max) {
    const number = Math.floor((Math.random() * (max - min + 1)) + min);
    return number;
  }

  setItemAnswers(answers): FormArray {
    const answerArray = this.formBuilder.array([]);
    answers.forEach(answer => {
      const parsedAnswer = JSON.parse(answer);
      answerArray.push(this.formBuilder.group({
        value: [parsedAnswer.value],
        answer: [parsedAnswer.answer]
      }));
    });

    return answerArray;
  }

  paginate(pageIndex: number): Observable<AbstractControl[]> {
    const from = (pageIndex - 1) >= 0 ? (pageIndex - 1) : 0;
    const paginateItems = this.items.controls.slice((from * this.itemsPerPage), pageIndex * this.itemsPerPage);
    return of(paginateItems);
  }

  setPage(pageIndex: number) {
    this.pageIndex$.next(pageIndex)
  }

  get pages() {
    const from = Math.min(Math.max(1, Number(this.currentPage) - 4), Number(this.totalPages) - 5);
    const to = Math.max(Math.min(Number(this.totalPages), Number(this.currentPage) + 4), 6);
    let pages = [];
    if (Number(this.totalPages) > 5) {
      pages = new Array((to - from) + 1).fill(0).map((_valor, indice) => indice + from);
    } else {
      pages = new Array(this.totalPages).fill(0).map((_valor, indice) => indice + 1);
    }
    return pages;
  }

  saveTest() {
    this.submitting$.next(true);

    const mappedPayload = this.items.value.map(item => ({ itemId: item.itemId, answerScore: item.answerValue }))
    this.api.post(`${Entities.userPersonalityTests}/makeTest`, { items: mappedPayload })
      .pipe(
        finalize(() => this.submitting$.next(false))
      )
      .subscribe(res => {
        this.successAlert(res.message);
        this.ref.modalRef.close(true);
      }, (error) => this.errorAlert(error));
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
      autoClose: false,
      closeButton: true
    })
  }

}
