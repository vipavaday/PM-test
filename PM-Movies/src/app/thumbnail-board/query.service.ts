import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  private queryUpdatedSource = new Subject<string>();

  queryUpdated$ = this.queryUpdatedSource.asObservable();

  updateQuery(query: string){

    this.queryUpdatedSource.next(query);
  }

  constructor() { }
}
