import { AfterContentInit, AfterViewInit, Component, ContentChildren, EventEmitter, HostBinding, Input, OnInit, Output, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'tabs-wrapper',
  templateUrl: './tabs-wrapper.component.html',
  styleUrls: ['./tabs-wrapper.component.scss']
})
export class TabsWrapperComponent implements OnInit, AfterViewInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @Input('card-shadow') shadow: boolean;
  @Output('tabChange') tabChange: EventEmitter<TabComponent> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // get all active tabs
    setTimeout(() => {
      let activeTabs = this.tabs.filter((tab) => tab.active);
      // if there is no active tab set, activate the first
      if (activeTabs.length === 0) {
        this.selectTab(this.tabs.first);
      }
    });

  }

  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);
    // activate the tab the user has clicked on.
    tab.active = true;
    this.tabChange.emit(tab);
  }

  @HostBinding('class') get classes() {
    return `${this.shadow ? 'shadow' : ''} tab-wrapper card`;
  }


}
