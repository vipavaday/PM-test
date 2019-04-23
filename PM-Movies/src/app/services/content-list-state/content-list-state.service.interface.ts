/**
* Enables the search bar to notify the ThumbnailBoard component when the search
* query is updated in order to refresh the displayed results
**/
export interface IContentListStateService {
  updateQuery(query: string): void;
}
