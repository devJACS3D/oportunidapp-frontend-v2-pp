import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiResponse } from "@apptypes/api-response";
import { UserAccountService } from "@services/user-account.service";
import { ModalService } from "../components/modal/modal.service";
import { LockSessionComponent } from "../lock-session/lock-session.component";

@Injectable()
export class CatchMessage {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  public getMessage(err: any) {
    try {
      let error: any = err;
      let user_message = "";

      console.log(error);
      /**
       * 0: Error inesperado
       * 1: Todo ok estatus 200
       * 2: Token inválido o no enviado / usuario sin permisos para la acción
       * 3: Token expirado
       * 4: Errores de validación (Ej: Falta algún campo o es inválido)
       * 4001: Credenciales incorrectas.
       */
      if (err.status == 0) {
        user_message = "Error de conexión, por favor intenta más tarde.";
      } else {
        switch (error.error.code) {
          case 401: // invalid token
          case 2:
            this.router.navigate([
              { outlets: { session: "lock" }, relativeTo: this.activatedRoute }
            ]);
            user_message = "Tu sesión ha caducado.";
            break;
          case 4: // Error de validación
            user_message = error.error.message ? `${error.error.message} ` : "";
            if (Array.isArray(error.error.error)) {
              user_message += error.error.error
                .map(validation => validation.msg)
                .join(". ");
            }
            break;

          case 403: // Forbidden resource (Permisos insuficientes)
          case 3:
            user_message =
              "No cuentas con los permisos suficientes para realizar esta acción.";
            break;

          case 1007: // pay transaction error
            user_message =
              error.error.payError.paymentNetworkResponseErrorMessage ||
              "Ha ocurrido un error al realizar la transacción";
            break;
          case 4001: // Invalid credentials
            user_message = "Credenciales incorrectas"
            break;
          default:
            user_message = error.error.message ? error.error.message : "";
            if (error.error.error && typeof error.error.error == "string")
              user_message += ` ${error.error.error}`;
            else if (error.error && error.error.message)
              user_message += ` ${error.error.message}`;
            break;
        }

        if (user_message == "") {
          console.error("error no message: ", err);
          user_message = "Ha ocurrido un error, por favor intente más tarde.";
        }
      }

      return user_message;
    } catch (err) {
      console.error("Error catchMessage()", err);
      return "Ha ocurrido un error, por favor intente más tarde.";
    }
  }
}
