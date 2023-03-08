import { Injectable } from '@angular/core';	
import { navigation } from 'src/app/services/navigation';	
import { Api } from '@utils/api';	
import { SidebarItem } from '@apptypes/sidebar-item';	
import { of, Observable } from 'rxjs';	
import { UserAccountService } from './user-account.service';

@Injectable({	
	providedIn: 'root'	
})	
export class NavigationService {	

	private currentUser: any;	

	constructor(	
		private userAccount: UserAccountService	
	) { }	

	public getNavigation(): Observable<SidebarItem[]>{	
		let items: SidebarItem[] = [];	
		this.currentUser = this.userAccount.getUser();	

		let itemsNavigation: SidebarItem[] = JSON.parse(JSON.stringify(navigation));	
		// console.log("itemsNavigation" , itemsNavigation, "USERTYPE" , this.currentUser.userTypeId);
		for(let item of itemsNavigation){	
			if(item.type == 'item' && item.profiles.includes(this.currentUser.userTypeId)){	
				items.push(item);	
			}else{	
				if(item.type == 'group'){	
					let childItems: SidebarItem[] = [];	
					// console.log("CHILDRENS" , childItems, "USERTYPE" , this.currentUser.userTypeId);
					for(let child of item.children){	
						if(child.profiles.includes(this.currentUser.userTypeId)){	
							childItems.push(child);	
						}	
					}	
					if(childItems.length){	
						item.children = childItems;	
						items.push(item);	
					}	
				}	
			}	
		}	

		return of(items);	
	}	
}