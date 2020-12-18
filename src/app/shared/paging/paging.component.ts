import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ActivatedRoute } from '@angular/router';

export interface IPageChangeEvent {
  page: number;
  maxPage: number;
  pageSize: number;
  total: number;
  fromRow: number;
  toRow: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss']
})
export class PagingComponent implements OnInit {

  private privatePageSize = 50;
  private privateTotal = 0;
  private privatePage = 1;
  private fromRow = 1;
  private toRow = 1;
  private initialized = false;
  private privatePageLinks: number[] = [];
  private privatePageLinkCount = 0;
  // special case when 2 pageLinks, detect when hit end of pages so can lead in correct direction
  private hitEnd = false;
  // special case when 2 pageLinks, detect when hit start of pages so can lead in correct direction
  private hitStart = false;

  /**
   * firstLast?: boolean
   * Shows or hides the first and last page buttons of the paging bar. Defaults to 'false'
   */
  @Input() firstLast = true;

  /**
   * initialPage?: number
   * Sets starting page for the paging bar. Defaults to '1'
   */
  @Input() initialPage = 1;

  /**
   * pageLinkCount?: number
   * Amount of page navigation links for the paging bar. Defaults to '0'
   */
  @Input('pageLinkCount')
  set pageLinkCount(pageLinkCount: number) {
    this.privatePageLinkCount = coerceNumberProperty(pageLinkCount);
    this._calculatePageLinks();
    this.changeDetectorRef.markForCheck();
  }

  get pageLinkCount(): number {
    return this.privatePageLinkCount;
  }

  /**
   * pageSize?: number
   * Selected page size for the pagination. Defaults 50.
   */
  @Input('pageSize')
  set pageSize(pageSize: number) {
    this.privatePageSize = coerceNumberProperty(pageSize);
    this.privatePage = 1;
    if (this.initialized) {
      this._handleOnChange();
    }
    this.changeDetectorRef.markForCheck();
  }

  get pageSize(): number {
    return this.privatePageSize;
  }

  /**
   * total: number
   * Total rows for the pagination.
   */
  @Input('total')
  set total(total: number) {
    this.privateTotal = coerceNumberProperty(total);
    this._calculateRows();
    this._calculatePageLinks();
    this.changeDetectorRef.markForCheck();
  }

  get total(): number {
    return this.privateTotal;
  }

  /**
   * pageLinks: number[]
   * Returns the pageLinks in an array
   */
  get pageLinks(): number[] {
    return this.privatePageLinks;
  }

  /**
   * range: string
   * Returns the range of the rows.
   */
  get range(): string {
    return `${!this.toRow ? 0 : this.fromRow}-${this.toRow}`;
  }

  /**
   * page: number
   * Returns the current page.
   */
  get page(): number {
    return this.privatePage;
  }

  /**
   * page: number
   * Returns the max page for the current pageSize and total.
   */
  get maxPage(): number {
    return Math.ceil(this.privateTotal / this.privatePageSize);
  }

  /**
   * changed?: function
   * Method to be executed when page size changes or any button is clicked in the paging bar.
   * Emits an [IPageChangeEvent] implemented object.
   */
  @Output() changed: EventEmitter<IPageChangeEvent> = new EventEmitter<IPageChangeEvent>();

  get isRTL(): boolean {
    if (this.dir) {
      return this.dir.dir === 'rtl';
    }
    return false;
  }

  constructor(@Optional() private dir: Dir,
              private changeDetectorRef: ChangeDetectorRef,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.privatePage = coerceNumberProperty(this.initialPage);
    this._calculateRows();
    this._calculatePageLinks();
    this.initialized = true;
    this.changeDetectorRef.markForCheck();

    this.route.queryParamMap.subscribe(
      params => {
        this.privatePage = parseInt(params.get('page') || '1', 10);
        this._calculateRows();
        this._calculatePageLinks();
        this.initialized = true;
        this.changeDetectorRef.markForCheck();
      });
  }

  isMinPage(): boolean {
    return this.privatePage <= 1;
  }

  isMaxPage(): boolean {
    return this.privatePage >= this.maxPage;
  }

  private _calculateRows(): void {
    const top: number = (this.privatePageSize * this.privatePage);
    this.fromRow = (this.privatePageSize * (this.privatePage - 1)) + 1;
    this.toRow = this.privateTotal > top ? top : this.privateTotal;
  }

  /**
   * _calculatePageLinks?: function
   * Calculates the page links that should be shown to the user based on the current state of the paginator
   */
  private _calculatePageLinks(): void {
    // special case when 2 pageLinks, detect when hit end of pages so can lead in correct direction
    if (this.isMaxPage()) {
      this.hitEnd = true;
      this.hitStart = false;
    }
    // special case when 2 pageLinks, detect when hit start of pages so can lead in correct direction
    if (this.isMinPage()) {
      this.hitEnd = false;
      this.hitStart = true;
    }
    // If the pageLinkCount goes above max possible pages based on perpage setting then reset it to maxPage
    let actualPageLinkCount: number = this.pageLinkCount;
    if (this.pageLinkCount > this.maxPage) {
      actualPageLinkCount = this.maxPage;
    }
    // reset the pageLinks array
    this.privatePageLinks = [];
    // fill in the array with the pageLinks based on the current selected page
    const middlePageLinks: number = Math.floor(actualPageLinkCount / 2);
    for (let x = 0; x < actualPageLinkCount; x++) {
      // don't go past the maxPage in the pageLinks
      // have to handle even and odd pageLinkCounts differently so can still lead to the next numbers
      if ((actualPageLinkCount % 2 === 0 && (this.page + middlePageLinks > this.maxPage)) ||
        (actualPageLinkCount % 2 !== 0 && (this.page + middlePageLinks >= this.maxPage))) {
        this.privatePageLinks[x] = this.maxPage - (actualPageLinkCount - (x + 1));
        // if the selected page is after the middle then set that page as middle and get the correct balance on left and right
        // special handling when there are only 2 pageLinks to just drop to next if block so can lead to next numbers when moving to right
        // when moving to the left then go into this block
      } else if ((actualPageLinkCount > 2 || actualPageLinkCount <= 2 && this.hitEnd) && (this.page - middlePageLinks) > 0) {
        this.privatePageLinks[x] = (this.page - middlePageLinks) + x;
        // if the selected page is before the middle then set the pages based on the x index leading up to and after selected page
      } else if ((this.page - middlePageLinks) <= 0) {
        this.privatePageLinks[x] = x + 1;
        // other wise just set the array in order starting from the selected page
      } else {
        this.privatePageLinks[x] = this.page + x;
      }
    }
  }

  private _handleOnChange(): void {
    this._calculateRows();
    this._calculatePageLinks();
    const event: IPageChangeEvent = {
      page: this.privatePage,
      maxPage: this.maxPage,
      pageSize: this.privatePageSize,
      total: this.privateTotal,
      fromRow: this.fromRow,
      toRow: this.toRow,
    };
    this.changeDetectorRef.markForCheck();
    this.changed.emit(event);
  }

}
