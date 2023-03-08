import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminComponent', () => {
	let component: AdminComponent;
	let fixture: ComponentFixture<AdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			providers: [ RouterTestingModule ],
			declarations: [
				AdminComponent,
				NavbarComponent,
				SidebarComponent
			],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA,
				NO_ERRORS_SCHEMA
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
