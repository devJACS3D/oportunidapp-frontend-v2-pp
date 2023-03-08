import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalsServicesComponent } from './additionals-services.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Api } from '@utils/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AditionalsServicesComponent', () => {
	let component: AdditionalsServicesComponent;
	let fixture: ComponentFixture<AdditionalsServicesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			providers: [ 
				Api, 
				HttpClientTestingModule
			],
			imports: [ 
				RouterTestingModule,
				// HttpClientTestingModule
			],
			declarations: [ AdditionalsServicesComponent ],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA,
				NO_ERRORS_SCHEMA
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdditionalsServicesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
