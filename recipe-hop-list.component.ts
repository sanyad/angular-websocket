import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Hop} from '../models/Hop';
import {getValueByIdFromEntitiesList, QueryMapValue} from '../util/Misc';
import {Rsp} from '../models/BeerbrewApi';
import {WebsocketService} from '../service/websocket/websocket.service';
import {fromEvent, Subscription} from 'rxjs';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {IdName, Paged, PagerEvent, SelectedEvent} from '../models/Util';
import {debounceTime, map} from 'rxjs/operators';
import {NotifierService} from 'angular-notifier';
import {AppWsHelpers} from '../util/app.ws-helpers';

@Component({
  selector: 'app-recipe-hop-list',
  templateUrl: 'recipe-hop-list.component.html',
  styleUrls: ['recipe-hop-list.component.scss']
})
export class RecipeHopListComponent extends AppWsHelpers implements OnDestroy, AfterViewInit {
  @ViewChild('table', { static: true }) table!: DatatableComponent;
  @ViewChild('search', { static: true }) search!: ElementRef;
  readonly headerHeight = 44;
  readonly rowHeight = 71;
  readonly pSize = 10;
  total = 0;
  loadingIndicator = true;
  filterName = '';
  isDisabled = true;
  rows: Hop[] = [];
  hopTypes: IdName[] = [];
  origins: IdName[] = [];
  forms: IdName[] = [];
  subscription: Subscription[];
  getValueByIdFromEntitiesList = getValueByIdFromEntitiesList;

  constructor(private router: Router,
              private ws: WebsocketService,
              private notifier: NotifierService) {

    super(ws, notifier);

    this.subscription = [
      this.ws.on<Paged<Hop>>('Hops', 'List').subscribe(this.listHandler),
      this.ws.on<number[]>('Hops', 'Deleted').subscribe(this.deletedHandler),

      this.ws.on<IdName[]>('HopOrigins', 'List').pipe(map((res) => {
          return {response: res, destination: 'origins'}
        })).subscribe(this.resolveDataHandle),

      this.ws.on<IdName[]>('HopTypes', 'List').pipe(map((res) => {
        return {response: res, destination: 'forms'}
      })).subscribe(this.resolveDataHandle),

      this.ws.on<IdName[]>('HopForms', 'List').pipe(map((res) => {
        return {response: res, destination: 'hopTypes'}
      })).subscribe(this.resolveDataHandle),
    ];

    this.getList('Hops');
    this.getList('HopTypes', new Map([['limit', 1000]]));
    this.getList('HopOrigins', new Map([['limit', 1000]]));
    this.getList('HopForms', new Map([['limit', 1000]]));
  }

  ngAfterViewInit() {
    fromEvent(this.search.nativeElement, 'keyup')
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.getList('Hops', new Map<string, QueryMapValue>([
          ['limit', this.pSize],
          ['name', this.filterName]
        ]));
      });
  }

  ngOnDestroy() {
    this.subscription.forEach(s => s.unsubscribe());
  }

  deletedHandler = (message: Rsp<number[]>) => {
    if (!message.error) {
      this.getList('Hops');
      this.notifier.notify('success', 'Deleted!');
    }
  };

  listHandler = (msg: Rsp<Paged<Hop>>) => {
    if (msg.payload) {
      this.rows = msg.payload.data;
      this.loadingIndicator = false;
      this.total = msg.payload.total;
    }
  };

  onSelect(event: SelectedEvent<Hop>) {
    this.isDisabled = event.selected.length === 0;
  }

  navigate(...args: string[]) {
    this.router.navigate(['/recipe-hop-list/'].concat(args));
  }

  onPageChanged(event: PagerEvent) {
    this.getList('Hops', new Map([
      ['offset', (event.page - 1) * this.pSize],
      ['limit', this.pSize]
    ]));
  }

  edit() {
    const selected: Hop[] = this.table.selected;
    this.navigate('edit', (selected[selected.length - 1].id || -1).toString());
  }

  delete() {
    if (confirm(`Are you sure you want to delete Hops with names ${this.table.selected.map(o => o.name)}?`)) {
      this.ws.send<number[]>({
        topic: 'Hops',
        event: 'Delete',
        payload: this.table.selected.map(o => o.id)
      });
    }
  }
}
