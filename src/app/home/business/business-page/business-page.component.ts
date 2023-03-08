import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBusiness } from '@apptypes/entities/IBusiness';
import { BusinessItem } from '@apptypes/entities/IBusinessItem';
import { IPartner } from '@apptypes/entities/IPartner';
import { Utilities } from '@utils/utilities';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-business-page',
  templateUrl: './business-page.component.html',
  styleUrls: ['./business-page.component.scss']
})
export class BusinessPageComponent implements OnInit {

  utils = Utilities;
  item: BusinessItem
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.data
      .pipe(
        map((route) => route.business.registerDetails),
        tap((val) => this.mapItem(val))
      )
      .subscribe(business => {
      });
  }

  mapItem(data: IPartner | IBusiness) {

    let image: string;

    if (data['images'])
      image = data['images'].length ? data['images'][0] : null;
    else
      image = data['image'];

    this.item = Object.assign({}, {
      name: data.name,
      url: data.url,
      image,
      description: data.description,
      mission: data['mission'] ? data['mission'] : null,
      vision: data['vision'] ? data['vision'] : null,
      principles: data['principles'] ? data['principles'] : null,
    });
    return this.item;
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute })
  }

}
