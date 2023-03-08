import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-username-requirements',
	templateUrl: './username-requirements.component.html',
	styleUrls: ['./username-requirements.component.scss']
})
export class UsernameRequirementsComponent implements OnInit {

	@Input() username: string = '';

	get validatePWrequirement_1(): boolean {
		return this.validatePWrequirement(1);
	}

	get validatePWrequirement_2(): boolean {
		return this.validatePWrequirement(2);
	}

	get validatePWrequirement_3(): boolean {
		return this.validatePWrequirement(3);
	}

	get validatePWrequirement_4(): boolean {
		return this.validatePWrequirement(4);
	}

	get validatePWrequirement_5(): boolean {
		return this.validatePWrequirement(5);
	}

	constructor() { }

	ngOnInit() {
	}

	validatePWrequirement(value: number): boolean {
		let text: string;
		text = this.username;

		let startBySpecialChar: string | RegExp = /^[\_\-\.]/;
		let endBySpecialChar: string | RegExp = /[\_\-\.]$/;
		let nonWhiteSpace: string | RegExp = /^(\S)+$/;
		let minLength: string | RegExp = /^[\w|\D]{6,}$/;
		let hasUpperCase: string | RegExp = /[A-Z]/;

		switch (value) {
			case 1:
				return !startBySpecialChar.test(text);
			case 2:
				return !endBySpecialChar.test(text);
			case 3:
				return nonWhiteSpace.test(text);
			case 4:
				return minLength.test(text);
			case 5:
				return !hasUpperCase.test(text);
		}
	}
}
