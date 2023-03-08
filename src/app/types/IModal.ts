import { InjectionToken } from "@angular/core";
import { ModalComponent } from "../components/modal/modal.component";

export interface IModalData {
    closeButton?: boolean;
    data?: any;
    customModal?: boolean;
    backdrop?: boolean
}

export interface IModalReference {
    modalRef: ModalComponent
}

export const MODAL_CONFIG_DATA = new InjectionToken<IModalData>(null);
export const MODAL_REFERENCE = new InjectionToken<IModalReference>(null);
export const MODAL_DATA = new InjectionToken<any>(null);