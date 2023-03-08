import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @Input() id: string;
  @Input() src: string;
  @Input() width: string;
  @Input() height: string;
  @Input() autoplay: boolean;


  constructor() { }

  ngOnInit() {
  }

}
