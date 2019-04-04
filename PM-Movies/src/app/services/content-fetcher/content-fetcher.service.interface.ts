import { Observable } from 'rxjs';

import { Content } from 'src/app/models';

export interface IContentFetcherService {

  getContentInfo(title: string): Observable<Content[]>;
  getContentDetails(type: string, id: string): Observable<Content>;
}
