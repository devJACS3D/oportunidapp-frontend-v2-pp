import { Component, OnInit, OnDestroy } from "@angular/core";
import { navigation } from "src/app/services/navigation";
import { SidebarItem } from "@apptypes/sidebar-item";
import { fromEvent, Observable, Observer, Subscription } from "rxjs";
import { NavigationService } from "@services/navigation.service";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit, OnDestroy {
  // public navigation: SidebarItem[] = navigation;
  public navigation$: Observable<SidebarItem[]>;
  navigations: SidebarItem[];
  public subscription = new Subscription();
  textShouldBeHidden: boolean = false;
  constructor(private navigationProv: NavigationService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription.add(this.handleNavigation());

    this.subscription.add(this.handleWindowsResize());
  }

  private handleNavigation() {
    return this.navigationProv
      .getNavigation()
      .pipe(
        map(res => {
          return res.map(nav => ({ ...nav, showItems: false }));
        })
      )
      .subscribe(navigation => {
        this.navigations = navigation;
      });
  }

  private handleWindowsResize() {
    return fromEvent(window, "resize")
      .pipe(startWith(window.innerWidth))
      .subscribe(_ => {
        if (window.innerWidth <= 765) {
          this.textShouldBeHidden = true;
        } else {
          this.textShouldBeHidden = false;
        }
      });
  }

  closeAll(item: SidebarItem) {
    if (!this.navigations || !this.navigations.length) return;

    this.navigations.forEach(nav => {
      nav.showItems = false;
    });
  }
}
