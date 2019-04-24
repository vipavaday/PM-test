import { Injectable } from '@angular/core';

import { Content } from '../../models';
import {
  MDBTvShowJSON,
  MDBMovieJSON,
  MDBContentImagesJSON,
  IContentParser,
  MDBContentJSON,
  MDBSearchResponseJSON,
  MDBResultJSON
} from './content-parser.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentParserServiceMock implements IContentParser {


  public parseContentList(response: MDBSearchResponseJSON, imgBaseUrl: string) {
    return response.results.map(res => this.parse(res, imgBaseUrl));
  }

  public parse(json: MDBContentJSON, imgBaseUrl: string, content?: Content): Content {
    return new Content();
  }

  public parseContentCommons(json: MDBResultJSON, imgBaseUrl: string, content= new Content()): Content {
    return content;
  }

  // Partie specifique
  public parseTvShow(json: MDBTvShowJSON, imgBaseUrl: string, content = new Content()): Content {
    return content;
  }

  public parseMovie(json: MDBMovieJSON, imgBaseUrl: string, content = new Content()): Content {
    return content;
  }

  public parseContentImages(json: MDBContentImagesJSON, imgBaseUrl: string, content: Content = new Content()): string[] {
    return content.backdrops;
  }
}
