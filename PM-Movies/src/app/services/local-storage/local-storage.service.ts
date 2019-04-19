import { Injectable } from '@angular/core';
import { Content } from 'src/app/models';
import { IStorageService } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements IStorageService {

  public getStoredContents(): Content[] {
    return JSON.parse(localStorage.getItem(`storedContents`) || '[]')
      .map((contentJSON: any) => this.parseContent((contentJSON))
      );
  }
  /**
   * Stores a content in local storage if any its toWatch or watched property is true
   */
  public storeMarkedContent(content: Content): void {

    if (!content) {
      return;
    }

    if (!content.toWatch && !content.watched) {
      this.removeMarkedContentFromStorage(content);
    }

    const savedContents: Content[] = this.updateStoredContentIfPossible(content);
    localStorage.setItem(`storedContents`, JSON.stringify(savedContents));
  }


  public removeMarkedContentFromStorage(content: Content): void {

    if (!content) {
      return;
    }

    const savedContents: Content[] = this.getStoredContents() || [];
    const savedContentsFiltered = savedContents.filter(c => c.tmdbId !== content.tmdbId);

    if (savedContents.length !== savedContentsFiltered.length) {
      localStorage.setItem(`storedContents`, JSON.stringify(savedContentsFiltered));
    }
  }

  private updateStoredContentIfPossible(content: Content) {
    const savedContents: Content[] = this.getStoredContents() || [];
    const savedContentList = savedContents.filter(c => c.tmdbId === content.tmdbId);

    if (!savedContentList.length) {
      savedContents.push(content);
    } else {
      savedContentList[0].toWatch = content.toWatch;
      savedContentList[0].watched = content.watched;
    }
    return savedContents;
  }
  private parseContent(contentJSON: any): Content {

    const parsedContent = new Content(contentJSON.title, contentJSON.duration, new Date(contentJSON.releaseDate));
    parsedContent.tmdbId = contentJSON.tmdbId;
    parsedContent.toWatch = contentJSON.toWatch;
    parsedContent.watched = contentJSON.watched;

    return parsedContent;
  }
}
