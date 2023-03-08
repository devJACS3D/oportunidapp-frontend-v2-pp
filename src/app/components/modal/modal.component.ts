import {
  Component,
  ComponentFactoryResolver,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ComponentFactory,
  ComponentRef,
  Type
} from "@angular/core";
import {
  IModalData,
  MODAL_CONFIG_DATA,
  MODAL_DATA,
  MODAL_REFERENCE
} from "@apptypes/IModal";
import { ModalService } from "src/app/components/modal/modal.service";
import { Subject } from "rxjs";
import { ModalDirective } from "./modal.directive";



@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"]
})
export class ModalComponent implements OnInit, OnDestroy {
  serviceRef: ModalService;
  component: Type<any>;
  injector: Injector;
  id: string;
  class: string;
  loading: boolean;
  @ViewChild(ModalDirective, {}) modalDirective: ModalDirective;
  afterDestroy$: Subject<any> = new Subject();
 
  public componentRef: ComponentRef<any>
  constructor(
    @Inject(MODAL_CONFIG_DATA) public modalData: IModalData,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const componentFactoryRef = this.componentFactoryResolver.resolveComponentFactory(
      this.component
    );
    const reference = this.modalDirective.viewContainerRef.createComponent<any>(
      componentFactoryRef,
      null,
      this.injector
    );
    reference.changeDetectorRef.detectChanges();
    this.componentRef = reference;
  }
  ngOnDestroy(): void {
    this.afterDestroy$.complete();
  }

  async getReference(): Promise<any>{
    return new Promise(async (resolve, reject) => {
      await this.sleep();
      resolve(this.componentRef);
    });
  }


  async sleep() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 1);
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  setComponent<T>(component: Type<T>) {
    this.component = component;
    return this;
  }
  setId(id: string) {
    this.id = id;
    return this;
  }
  setClass(newClass: string) {
    try {
      this.class = newClass;
      return this;
    } catch (error) {}
  }
  setLoading(loading: boolean) {
    try {
      this.loading = loading;
      return this;
    } catch (error) {}
  }
  setServiceRef(serviceRef: ModalService) {
    this.serviceRef = serviceRef;
    return this;
  }

  setInjector(data: any) {
    this.injector = Injector.create({
      providers: [
        {
          provide: MODAL_DATA,
          useValue: data
        },
        {
          provide: MODAL_REFERENCE,
          useValue: {
            modalRef: this
          }
        }
      ]
    });
    return this;
  }

  close(value?: any) {
    if (value) this.afterDestroy$.next(value);

    this.serviceRef.close(this.id);
  }

  refresh(value?: any) {
    if (value) this.afterDestroy$.next(value);
  }
}
