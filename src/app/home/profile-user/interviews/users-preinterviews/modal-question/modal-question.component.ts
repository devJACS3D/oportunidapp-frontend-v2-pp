import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigEditorDisabled } from '@apptypes/classes/configEditor';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-question',
  templateUrl: './modal-question.component.html',
  styleUrls: ['./modal-question.component.scss']
})
export class ModalQuestionComponent implements OnInit {

  @Input() info: any;
  @Output() modalQuestion = new EventEmitter<boolean>();
  @Output() modalVideoP = new EventEmitter<boolean>();
  public question: string = "";
  public disabledEditor = ConfigEditorDisabled
  public ytIdPreinterviews = environment.ytIdPreInterviews;

  constructor() { }

  ngOnInit() {
    if (this.info) {
      this.question = this.info.vacancy.preinterview.question;
    }
  }

  /* close modal video */
  onCloseModalQuestion() {
    this.modalQuestion.emit(false);
  }

  onUploadVideoPreInterview() {
    this.modalQuestion.emit(false);
    this.modalVideoP.emit(true);
  }


}
