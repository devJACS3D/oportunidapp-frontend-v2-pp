import createNumberMask from 'text-mask-addons/dist/createNumberMask';
export class RegexUtils {
	public static _rxEmail: RegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
	public static _password: RegExp = /^(?=.*[a-zA-Z])(?=.*[\d])(?!.*\s).{6,20}$/;
	public static _username: RegExp = /^([a-z0-9]+(?:[\_\-\.][a-z0-9]+)*){6,60}$/;

	public static _rxUnits: RegExp = /^\d+(\.\d)?\d*$/;
	public static _rxNumber: RegExp = /^\d+$/;
	public static _rxCurrency: RegExp = /^(\d|,|\$)+(\.\d)?\d*$/;

	public static _rxPhone: RegExp = /^(\+)*\d+$/;

	public static _creditCard: RegExp = /^((36)\d{12}|(4)\d{12}|(4)\d{15}|(51|52|53|54|55)\d{14}|(34|37)\d{13})$/;
	// public static _creditCard: RegExp = /^(((34|37)\d{13})|((36)\d{12})|((4)\d{12})|((4)\d{15})|((51|52|53|54|55)\d{14}))$/;

	private static _valPhone1: RegExp = new RegExp('\[\\+\\d\]');
	private static _valPhone2: RegExp = new RegExp('\\d');
	public static _maskPhone = { 'A': { pattern: RegexUtils._valPhone1 }, 'B': { pattern: RegexUtils._valPhone2 }, optional: false };

	public static _maskUnits = createNumberMask({
		prefix: '',
		suffix: '',
		includeThousandsSeparator: false,
		allowDecimal: true,
		integerLimit: 10,
		decimalLimit: 10
	});

	public static _maskNumber = createNumberMask({
		prefix: '',
		suffix: '',
		includeThousandsSeparator: false
	});

	public static _maskCurrency = createNumberMask({
		prefix: '$',
		suffix: '',
		allowDecimal: true
	});


	public static _unMaskCurrency(expression: any) {

		let number: string = expression.toString();

		let withoutMaskArry: any[];
		let withoutMask: string = '';

		withoutMaskArry = number.match(/[\d.]+/g);
		withoutMaskArry.forEach(element => {
			withoutMask += element;
		});

		return parseFloat(withoutMask);
	}

	/**
	 * 
	 * @param nit 
	 * @description Valida nit
	 */
	static validateNit(unsetNit: string): boolean {
		const nit = this.setNit(unsetNit);
		// const nit = unsetNit;
		const sub_nit = nit.substring(0, nit.indexOf('-'));
		const d_chequeo: Number = Number(nit.substring(nit.indexOf('-') + 1));
		const ceros = '000000';
		const li_peso = new Array();
		li_peso[0] = 71;
		li_peso[1] = 67;
		li_peso[2] = 59;
		li_peso[3] = 53;
		li_peso[4] = 47;
		li_peso[5] = 43;
		li_peso[6] = 41;
		li_peso[7] = 37;
		li_peso[8] = 29;
		li_peso[9] = 23;
		li_peso[10] = 19;
		li_peso[11] = 17;
		li_peso[12] = 13;
		li_peso[13] = 7;
		li_peso[14] = 3;

		const ls_str_nit: any = ceros + sub_nit;

		let li_suma = 0;
		for (let i = 0; i < 15; i++) {
			li_suma += ls_str_nit.substring(i, i + 1) * li_peso[i];
		}

		let digito_chequeo = li_suma % 11;

		if (digito_chequeo >= 2) {
			digito_chequeo = 11 - digito_chequeo;
		}
		if (d_chequeo !== digito_chequeo) {
			return false;
		} else {
			return true;
		}
	}

	/* 	static validateNIT(myNit) {
			let z: number;
			let x: number = 0;
			let y: number = 0;
			let vpri;
	
			// Se limpia el Nit
			myNit = myNit.replace(/\s/g, ""); // Espacios
			myNit = myNit.replace(/,/g, ""); // Comas
			myNit = myNit.replace(/\./g, ""); // Puntos
			myNit = myNit.replace(/-/g, ""); // Guiones
	
			// Se valida el nit
			if (isNaN(myNit)) {
				console.log("El nit/cédula '" + myNit + "' no es válido(a).");
				return "";
			};
	
			// Procedimiento
			vpri = new Array(16);
			z = myNit.length;
	
			vpri[1] = 3;
			vpri[2] = 7;
			vpri[3] = 13;
			vpri[4] = 17;
			vpri[5] = 19;
			vpri[6] = 23;
			vpri[7] = 29;
			vpri[8] = 37;
			vpri[9] = 41;
			vpri[10] = 43;
			vpri[11] = 47;
			vpri[12] = 53;
			vpri[13] = 59;
			vpri[14] = 67;
			vpri[15] = 71;
	
			for (var i = 0; i < z; i++) {
				y = (myNit.substr(i, 1));
				// console.log ( y + "x" + vpri[z-i] + ":" ) ;
	
				x += (y * vpri[z - i]);
				// console.log ( x ) ;    
			}
	
			y = x % 11;
			// console.log ( y ) ;
	
			return (y > 1) ? 11 - y : y;
		} */

	public static setNit(fieldnit: string) {
		let nit: string = fieldnit;
		let subnit: string = nit.substring(0, nit.length - 1);
		let digit: string = nit.substring(nit.length - 1, nit.length);

		let valor = subnit + '-' + digit;
		return valor;
	}
}