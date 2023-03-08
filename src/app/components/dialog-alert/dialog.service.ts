import {
  Injectable,
  ComponentRef,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef
} from "@angular/core";
import { ComponentsModule } from "../components.module";
import { DialogAlertComponent } from "./dialog-alert.component";
import { Utilities } from "@utils/utilities";
import { SuccessComponent } from "./success/success.component";
import { Subject } from "rxjs";
import { ErrorComponent } from "./error/error.component";
import { CustomAlertComponent } from "./custom-alert/custom-alert.component";
import { CustomAlert } from "@apptypes/classes/customAlert";

@Injectable({
  providedIn: "root"
  // providedIn: ComponentsModule
})
export class DialogService {
  private subjectOkButton = new Subject<any>();

  errorComponentRef: ComponentRef<ErrorComponent>;
  successComponentRef: ComponentRef<SuccessComponent>;
  customComponentRef: ComponentRef<CustomAlertComponent>;
  dialogComponentRef: ComponentRef<DialogAlertComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  private appendDialogComponentToBody(message: string) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      DialogAlertComponent
    );
    const componentRef = componentFactory.create(this.injector);
    componentRef.instance.message = message;
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.dialogComponentRef = componentRef;
  }

  private appendSuccessDialogToBody(title: string, message: string) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      SuccessComponent
    );
    const componentRef = componentFactory.create(this.injector);
    componentRef.instance.title = title;
    componentRef.instance.message = message;
    componentRef.instance.onOkButton.subscribe(() => {
      console.log("emit from service");
      this.subjectOkButton.next();
      this.removeDialogComponentFromBody(this.successComponentRef);
    });

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.successComponentRef = componentRef;
  }

  private appendErrorDialog(message: string) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      ErrorComponent
    );
    const componentRef = componentFactory.create(this.injector);

    componentRef.instance.message = message;
    componentRef.instance.onOkButton.subscribe(() => {
      this.removeDialogComponentFromBody(this.errorComponentRef);
    });

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.errorComponentRef = componentRef;
  }

  private removeDialogComponentFromBody(componentRef) {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }

  private appendCustomDialogToBody(params: CustomAlert) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      CustomAlertComponent
    );
    const componentRef = componentFactory.create(this.injector);
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        componentRef.instance[key] = params[key];
      }
    }
    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
    this.customComponentRef = componentRef;
  }

  public async success(message: string) {
    this.appendDialogComponentToBody(message);
    await Utilities.sleep(3000);

    this.removeDialogComponentFromBody(this.dialogComponentRef);
  }

  /**
   * function that allows creating a modal alert
   * @param {CustomAlert} params list of parameters such as title, icon, message
   */
  public async customAlert(params: CustomAlert) {
    /* validate if closebuttom custom alert */
    params.closeButton ? (params.closeButton = () => this.closeAlert()) : null;
    /* validate if closeBackDrop custom alert */
    params.closeBackDrop
      ? (params.closeBackDrop = () => this.closeAlert())
      : null;
    /* asignament params custom alert */
    this.appendCustomDialogToBody(params);
    /* validate if autoclose and time sleep custom alert */
    if (params.autoClose) {
      await Utilities.sleep(params.timeSleep ? params.timeSleep : 3000);
      this.closeAlert();
    }
  }

  /**
   * allows to have a wait for data loading
   * @param element element to be used as internal reference of the onClick function
   * @param active defines if it is loading data
   */
  public loadingAlert(element: any, active: boolean) {
    this.customComponentRef.instance.disabled = element.loading = active;
  }

  /**
   * allows you to remove the component from the modal custom alert
   */
  public closeAlert() {
    this.removeDialogComponentFromBody(this.customComponentRef);
  }

  public error(message: string) {
    if (message != "expired") {
      this.appendErrorDialog(message);
    }
  }

  public onOkButton() {
    return this.subjectOkButton.asObservable();
  }

  /**
   *
   * @param message
   * @param okButton
   * @param autoClose
   */
  public async test(
    title: string,
    message: string,
    okButton?: boolean,
    autoClose?: boolean
  ) {
    this.appendSuccessDialogToBody(title, message);
  }

  public successAlert(message: string = "") {
    this.customAlert({
      message,
      bgColor: "success",
      icon: "success",
      bgBottom: true,
      autoClose: true
    });
  }

  errorAlert(message: string = "Ha ocurrido un error.") {
    this.customAlert({
      message,
      bgColor: "danger",
      icon: "warning",
      bgTop: true,
      autoClose: false,
      closeButton: true,
      buttons: [
        {
          name: "Ok",
          onClick: () => this.closeAlert(),
          class: "primary-default",
        }
      ]
    });
  }

  infoAlert(message: string = "Ha ocurrido un error.",icon="warning",bgColor="warning",bgTop=true) {
    this.customAlert({
      message,
      bgColor,
      icon,
      bgTop,
      autoClose: false,
      closeButton: true,
      buttons: [
        {
          name: "Ok",
          onClick: () => this.closeAlert(),
          class: "primary-default",
        }
      ]
    });
  }

  warningAlert(message: string = "Ha ocurrido un error.") {
    this.customAlert({
      message,
      bgColor: "warning",
      icon: "warning",
      bgTop: true,
      autoClose: false,
      closeButton: true,
      buttons: [
        {
          name: "Ok",
          onClick: () => this.closeAlert(),
          class: "primary-default",
        }
      ]
    });
	}

  public confirmAlert(opts?: object) {
    let options = {
      message: "",
      bgColor: "warning",
      icon: "warning",
      bgBottom: false,
      bgTop:true,
      btnCancelText: "Cancelar",
      btnOkText: "Aceptar"
    };
    if (opts) options = Object.assign(options, opts);

    return new Promise((resolve, reject) => {
      this.customAlert({
        ...options,
        buttons: [
          {
            name: options.btnCancelText,
            class: "primary-border",
            onClick: () => {
              this.closeAlert();
              resolve(false);
            }
          },
          {
            name: options.btnOkText,
            class: "primary-default",
            onClick: () => {
              this.closeAlert();
              resolve(true);
            }
          }
        ]
      });
    });
  }
}
