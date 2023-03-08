import { Component, OnInit } from "@angular/core";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Observable, Subject } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { ModalService } from "src/app/components/modal/modal.service";
import { COLORS } from "src/app/constants/constants";
import { PersonalityTestFormComponent } from "./form/peronality-test-form/personality-test-form.component";
import { InstructionsPtComponent } from "./instructions-pt/instructions-pt.component";

@Component({
  selector: "app-personality-test",
  templateUrl: "./personality-test.component.html",
  styleUrls: ["./personality-test.component.scss"]
})
export class PersonalityTestComponent implements OnInit {
  personalityTest$: Observable<any>;
  refresh$: Subject<boolean> = new Subject();
  constructor(
    private api: Api,
    private alert: DialogService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.personalityTest$ = this.refresh$.pipe(
      startWith(true),
      switchMap(() => this.fetchTest())
    );
  }

  fetchTest() {
    return this.api
      .get(`${Entities.userPersonalityTests}/me`)
      .pipe(map(response => response.response));
  }

  openInstructions() {
    const modal = this.modalService.create(InstructionsPtComponent, {});

    modal.afterDestroy$.subscribe(() => this.makeTest());
  }

  makeTest() {
    this.api
      .get(`${Entities.userPersonalityTests}/makeTest`)
      .pipe(
        map(response => response.response || []),
        map((questions: any[]) => this.mapQuestions(questions))
      )
      .subscribe(
        res => this.openTestModal(res),
        err => this.errorAlert(err)
      );
  }

  openTestModal(data: any) {
    const modal = this.modalService.create(PersonalityTestFormComponent, {
      data
    });

    modal.afterDestroy$.subscribe(() => {
      this.refresh$.next(true);
    });
  }

  mapQuestions(questions: any[]) {
    return questions.map(q => {
      const answerObject = q.facet.factor.factorAnswerOption.fpoAnswerOption;
      return {
        itemId: q.id,
        question: q.content,
        isPositive: q.isPositive,
        answers: q.isPositive
          ? answerObject.answers
          : answerObject.answersInverse
      };
    });
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
    });
  }

  errorAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.DANGER,
      icon: COLORS.WARNING,
      bgTop: true,
      autoClose: false,
      closeButton: true
    });
  }
}
