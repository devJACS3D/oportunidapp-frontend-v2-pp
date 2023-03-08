import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { IBusiness } from '@apptypes/entities/IBusiness';
import { BUSINESSTYPES } from '@apptypes/enums/businessTypes.enum';
import { UserAccountService } from '@services/user-account.service';
import { Api } from '@utils/api';

@Directive({
    selector: '[BusinessType]'
})
export class BusinessTypeDirective implements OnInit {

    business: IBusiness;
    @Input() ignoreIfAdmin: boolean | string;
    _businessType: BUSINESSTYPES;
    constructor(
        private templateRef: TemplateRef<any>,
        private userAccount: UserAccountService,
        private viewContainer: ViewContainerRef
    ) { }

    @Input('BusinessType') set businessType(type: BUSINESSTYPES) {
        this._businessType = type;
    }

    ngOnInit() {
        this.business = this.userAccount.getUser<IBusiness>();
        let show: boolean;

        if ((this.ignoreIfAdmin == 'true') && this.ignore()) {
            return this.viewContainer.createEmbeddedView(this.templateRef);
        }

        if (!this.business.businessTypeId)
            show = false;

        if (this.business.businessTypeId == this._businessType)
            show = true;
        else
            show = false

        show == true ? this.viewContainer.createEmbeddedView(this.templateRef) :
            this.viewContainer.clear();
    }

    ignore() {
        if (this.business.isAdminProfile || this.business.isPsychologistProfile)
            return true;
        else
            return false;
    }
}
