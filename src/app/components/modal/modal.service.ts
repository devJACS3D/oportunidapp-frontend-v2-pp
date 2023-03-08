import {
  Injectable,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ComponentFactory,
  Component,
  Type,
  Injector,
  ApplicationRef,
  EmbeddedViewRef
} from '@angular/core';
import { IModalData, MODAL_CONFIG_DATA, } from '@apptypes/IModal';
import { ModalComponent } from './modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalRefs: {} = {};
  private topModal: ComponentRef<ModalComponent>;
  private idCounter: number = 0;
  private lastId: string;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
  ) { }


  public create<T = any>(component: Type<T>, options: IModalData): ModalComponent {

    const modalOpts: IModalData = {
      closeButton: true,
      data: null,
      backdrop: true,
      customModal: false
    }
    const opts = Object.assign(modalOpts, options);
    const injector: Injector = Injector.create({
      providers:
        [{
          provide: MODAL_CONFIG_DATA, useValue: opts
        }],
    });

    const modalRef = this.componentFactoryResolver
      .resolveComponentFactory(ModalComponent)
      .create(injector);

    // set id for this new modal
    const id = `MODAL${this.idCounter++}`
    this.lastId = id;
    modalRef.instance
      .setComponent(component)
      .setId(id)
      .setServiceRef(this)
      .setInjector(options.data);

    // set top modal
    this.topModal = modalRef;
    //add new modal to the refs
    this.modalRefs[id] = { modalRef, hostView: modalRef.hostView };
    //attaching to the view
    this.appRef.attachView(modalRef.hostView);
    //adding to the dom
    const domElem = (modalRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    return modalRef.instance;
  }

  close(id?: string) {
    if (!id)
      this.removeRef(this.lastId);
    this.removeRef(id);
  }

  private removeRef(id: string) {
    if (!this.modalRefs[id]) return;
    this.modalRefs[id].modalRef.destroy();
    this.appRef.detachView(this.modalRefs[id].hostView);
  }
}
