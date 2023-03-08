import { Component, Type, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
	selector: 'app-dialog-alert',
	templateUrl: './dialog-alert.component.html',
	styleUrls: ['./dialog-alert.component.scss']
})
export class DialogAlertComponent implements AfterViewInit, OnDestroy {

	public message: string;

	childComponentType: Type<any>;

	ngAfterViewInit() {
	}

	ngOnDestroy() {
	}

	onOverlayClicked(evt: MouseEvent) {
		// close the dialog
	}

	onDialogClicked(evt: MouseEvent) {
		evt.stopPropagation();
	}

}
