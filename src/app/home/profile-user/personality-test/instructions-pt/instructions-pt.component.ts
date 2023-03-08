import { Component, Inject, OnInit } from "@angular/core";
import { IModalReference, MODAL_REFERENCE } from "@apptypes/IModal";

@Component({
  selector: "app-instructions-pt",
  templateUrl: "./instructions-pt.component.html",
  styleUrls: ["./instructions-pt.component.scss"]
})
export class InstructionsPtComponent implements OnInit {
  view: number = 1;
  constructor(@Inject(MODAL_REFERENCE) private ref: IModalReference) {}

  ngOnInit() {}

  doTest() {
    this.ref.modalRef.close(true);
  }
}
