import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
interface IFieldErrors {
  required: string | Function;
  minlength: string | Function;
  maxlength: string | Function;
  min: string | Function;
  max: string | Function;
  pattern: string | Function;
  email: string | Function;
}

@Component({
  selector: "field-error",
  templateUrl: "./field-error.component.html",
  styleUrls: ["./field-error.component.scss"]
})
export class FieldErrorComponent implements OnInit {
  @Input("fcontrol") formControl: FormControl;

  private errors: IFieldErrors = {
    required: "Este campo es requerido.",
    minlength: this.minlengthToStr,
    maxlength: this.maxlengthToStr,
    min: this.minNumber,
    max: this.maxNumber,
    pattern: "Ingrese un valor valido.",
    email: "Ingrese un correo electrónico valido."
  };

  error$: Observable<string>;
  constructor() {}

  ngOnInit() {
    this.error$ = this.formControl.statusChanges.pipe(
      map(_ => this.formControl.errors),
      map(errors => this.mapErrorToStr(errors))
    );
  }

  @Input("errorsMsg") set errorsMsg(errors: IFieldErrors) {
    this.errors = Object.assign(this.errors, errors);
  }

  mapErrorToStr(errors: object | null) {
    if (!errors || errors == null) return;
    // getting first object key
    const key = Object.keys(errors)[0];

    const errorAtKey: string | Function = this.errors[key];
    if (!errorAtKey) return `Ingrese un valor valido.`;

    if (typeof errorAtKey == "function") {
      return errorAtKey(errors[key]);
    }
    return errorAtKey;
  }

  minlengthToStr(errorLength: {
    actualLength: number;
    requiredLength: number;
  }) {
    return `Este campo debe contener al menos ${errorLength.requiredLength} caracteres (${errorLength.actualLength}/${errorLength.requiredLength})`;
  }

  maxlengthToStr(errorLength: {
    actualLength: number;
    requiredLength: number;
  }) {
    return `Este campo debe contener máximo ${errorLength.requiredLength} caracteres (${errorLength.actualLength}/${errorLength.requiredLength})`;
  }

  minNumber(min: { min: number; actual: number }) {
    return `Este campo debe ser mínimo ${min.min}. Valor actual ${min.actual}`;
  }
  maxNumber(max: { max: number; actual: number }) {
    return `Este campo debe ser máximo ${max.max}. Valor actual ${max.actual}`;
  }
}
