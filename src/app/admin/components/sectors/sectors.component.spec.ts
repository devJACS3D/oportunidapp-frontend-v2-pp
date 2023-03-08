import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorsComponent } from './sectors.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentsModule } from 'src/app/components/components.module';
import { Api } from '@utils/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('SectorsComponent', () => {
	let component: SectorsComponent;
	let fixture: ComponentFixture<SectorsComponent>;
	let service: Api;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SectorsComponent],
			providers: [Api],
			imports: [
				RouterTestingModule,
				ComponentsModule,
				HttpClientTestingModule
			],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA,
				NO_ERRORS_SCHEMA
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SectorsComponent);
		component = fixture.componentInstance;
		service = component.api;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
