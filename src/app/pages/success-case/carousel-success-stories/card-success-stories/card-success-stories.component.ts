import { Component, OnInit, Input } from '@angular/core';
import { ISuccessStory } from '@apptypes/entities/success-story';
import { Utilities } from '@utils/utilities';

@Component({
	selector: 'app-card-success-stories',
	templateUrl: './card-success-stories.component.html',
	styleUrls: ['./card-success-stories.component.scss']
})
export class CardSuccessStoriesComponent implements OnInit {

	@Input('successStory') item: ISuccessStory;
	utils = Utilities;	
	constructor() { }

	ngOnInit() {
	}

}
