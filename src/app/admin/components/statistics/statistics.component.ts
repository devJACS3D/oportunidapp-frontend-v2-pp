import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as moment from 'moment';
import { Utilities } from '@utils/utilities';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { ApiResponse } from '@apptypes/api-response';

const colors = ['#65aef2', '#0079ea', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];

@Component({
	selector: 'app-statistics',
	templateUrl: './statistics.component.html',
	styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
	amountVacancyApplications: any;
	amountVacanciesCreatedByCompanies: any;
	amountRegisteredUsers: any;

	public chartOption: EChartOption = {
		color: colors,
		tooltip: {
			trigger: 'axis',
			axisPointer: {            // 坐标轴指示器，坐标轴触发有效
				type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				axisTick: {
					alignWithLabel: true
				}
			}
		],
		yAxis: [
			{
				type: 'value'
			}
		],
		series: [
			{
				name: '直接访问',
				type: 'bar',
				barWidth: 60,
				data: [10, 52, 200, 334, 390, 330, 220]
			}
		]
	};

	public pieOption: EChartOption;

	public graphOptions: EChartOption;

	get _maxDate(): any {
		return this.calcMaxDate();
	}

	get _minDate(): any {
		return this.calcMinDate();
	}

	get _todayDate(): any {
		let today = moment().unix();
		return Utilities.formatDate(today);
	}

	public _loadingInit: boolean;
	public _loading: boolean;
	public _error: string = null;

	public FormEntity: FormGroup;

	constructor(
		private api: Api
	) {
		this.amountVacancyApplications = 0
		this.amountVacanciesCreatedByCompanies = 0
		this.amountRegisteredUsers = 0
	}

	ngOnInit() {

		this.initForm();
		this.search();
	}

	private calcMaxDate() {
		let end = this.FormEntity.controls.endDate.value;

		let today = moment().unix();
		let todateDate = Utilities.formatDate(today);

		if (end != null && end != '') {
			if (end.year != '')
				return end;
			else {
				return todateDate;
			}
		} else {
			return todateDate;
		}
	}

	private calcMinDate() {
		let start = this.FormEntity.controls.startDate.value;

		let today = moment().unix();
		let todayDate = Utilities.formatDate(today);

		if (start != null && start != '' && start != undefined) {
			if (start.year != '')
				return start;
			else {

				return todayDate;
			}
		} else {
			return todayDate;
		}
	}

	private initForm() {
		let startDate = Utilities.formatDate(moment().subtract(3, 'months').unix());
		let endDate = Utilities.formatDate(moment().unix());

		this.FormEntity = new FormGroup({
			startDate: new FormControl(startDate, [
				Validators.required
			]),
			endDate: new FormControl(endDate, [
				Validators.required
			]),
		});
	}

	public async search() {
		this._loading = true;
		if (this.FormEntity.valid) {
			try {
				let body = this.FormEntity.value;
				body.startDate = Utilities.unixToDate(Utilities.unformatDate(body.startDate));
				body.endDate = Utilities.unixToDate(Utilities.unformatDate(body.endDate));

				let resp = await this.api.getReports(Entities.statistics, body).toPromise() as ApiResponse;

				console.log('response: ', resp);
				this.amountVacancyApplications = resp.response.amountVacancyApplications;
				this.amountVacanciesCreatedByCompanies = resp.response.amountVacanciesCreatedByCompanies;
				this.amountRegisteredUsers = resp.response.amountRegisteredUsers;

				this.graphOptions = {
					color: colors,
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						orient: 'horizontal',
						align: 'right',
						data: ['Hombre', 'Mujer']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'value',
						boundaryGap: [0, 0.01]
					},
					yAxis: {
						type: 'category',
						data: ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+']
					},
					series: [
						{
							name: 'Hombre',
							type: 'bar',
							data: resp.response.getAmountRegisteredUsersAgeMale
						},
						{
							name: 'Mujer',
							type: 'bar',
							data: resp.response.getAmountRegisteredUsersAgeFemale
						}
					]
				}

				this.pieOption = {
					color: colors,
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					legend: {
						orient: 'horizontal',
						bottom: 'auto',
						data: ['Mujer', 'Hombre']
					},
					series: [
						{
							name: 'Genero',
							type: 'pie',
							radius: ['50%', '70%'],
							avoidLabelOverlap: false,
							label: {
								normal: {
									show: false,
									position: 'center'
								},
								emphasis: {
									show: true,
									textStyle: {
										fontSize: '30',
										fontWeight: 'bold'
									}
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data: [
								{ value: resp.response.amountRegisteredUsersMale, name: 'Hombre' },
								{ value: resp.response.amountRegisteredUsersFemale, name: 'Mujer' },
							]
						}
					]
				};
			
				console.log(this.graphOptions);


			} catch (err) {
				this._error = err;
			}
		}

		this._loading = false;
	}

}
