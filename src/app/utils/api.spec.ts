import { TestBed, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, Headers } from '@angular/http';

import { Api } from './api';
import { RouterTestingModule } from '@angular/router/testing';
import { Entities } from '@services/entities';

fdescribe('ApiService', () => {
	let service: Api;
	let mockBackend: MockBackend;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				Api,
				MockBackend,
				BaseRequestOptions,
				{
					provide: Http,
					useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
						return new Http(backend, defaultOptions);
					},
					deps: [MockBackend, BaseRequestOptions],
				}
			]
		});

		service = TestBed.get(Api)
		mockBackend = TestBed.get(MockBackend);
	});

	it('should be created', () => {
		const service: Api = TestBed.get(Api);
		expect(service).toBeTruthy();
	});

	it('be able to get data', () => {
		mockBackend.connections.subscribe(
			(connection: MockConnection) => {
				connection.mockRespond(new Response(
					new ResponseOptions({
						body: [{ name: 'Jerry' }, { name: 'George' }, { name: 'Elaine' }, { name: 'Kramer' }],
						status: 200,
						headers: new Headers({ 'Content-Type': 'application/json' })
					})
				));
			}
		);

		service.get('Entidad x').subscribe(data => {
			expect(data).toEqual([{ name: 'Jerry' }, { name: 'George' }, { name: 'Elaine' }, { name: 'Kramer' }]);
		});
	});

	xit('not be able to get data', async(() => {
		mockBackend.connections.subscribe(
			(connection: MockConnection) => {
				connection.mockError(new Error());
			}
		);
		service.get('Entidad x').subscribe(
			data => data,
			error => {
				expect(error.toString()).toContain('Something went wrong. Please try again later.');
			}
		);
	}));
});
