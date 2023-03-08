import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { IPagination } from '@apptypes/pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {


  @Input('pagination') _pagination: IPagination;
  @Input('loader') _loadingPage: any[];

  itemsPerPage: number[] = [1,5, 10, 15];
  itemPerPage: number = 10;

  to: number;
  from: number;
  pages: any[] = [];

  @Output() _changePage = new EventEmitter();

  constructor() { }


  ngOnInit() {
    if (this._pagination) {
      this.setPage()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes && changes['_pagination']) {
      if (changes['_pagination'].previousValue) {
        this.setPage();
      }
    }

  }

  private setPage() {

    this.from = Math.min(Math.max(1, Number(this._pagination.currentPage) - 4), Number(this._pagination.pagesNumber) - 5);
    this.to = Math.max(Math.min(Number(this._pagination.pagesNumber), Number(this._pagination.currentPage) + 4), 6);
    if (Number(this._pagination.pagesNumber) > 5) {
      this.pages = new Array((this.to - this.from) + 1).fill(0).map((_valor, indice) => indice + this.from);
    } else {
      this.pages = new Array(this._pagination.pagesNumber).fill(0).map((_valor, indice) => indice + 1);
    }
  }

  public goToPage(pageNumber: number, direction?: number) {
    this._changePage.emit({ pageNumber, itemsPerPage: this.itemPerPage, direction });
  }

  public setItemsPerPage(itemsPerPage: string) {
    this.itemPerPage = parseInt(itemsPerPage);

    if(this.itemPerPage >= this._pagination.elementsNumber){
      this._pagination.currentPage = 1;
    }

    this._changePage.emit({
      pageNumber: Number(this._pagination.currentPage),
      itemsPerPage: this.itemPerPage
    });
  }
}
