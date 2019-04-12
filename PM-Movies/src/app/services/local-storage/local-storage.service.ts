import { Injectable } from '@angular/core';
import { Content } from 'src/app/models';
import { IStorageService } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements IStorageService {

  public getStoredContents(): Content[] {
    return JSON.parse(localStorage.getItem(`storedContents`) || '[]');
  }

  public addToWatchlist(content: Content): void {

    const savedContents: Content[] = this.getStoredContents() || [];
    const savedContentList = savedContents.filter(c => c.tmdbId === content.tmdbId);

    if (savedContentList.length > 0) {

      savedContentList[0].toWatch = true;
    } else {

      content.toWatch = true;
      savedContents.push(content);
    }

    localStorage.setItem(`storedContents`, JSON.stringify(savedContents));
  }

  public removeFromWatchList(content: Content): void {

    let savedContents: Content[] = this.getStoredContents() || [];
    const savedContentList = savedContents.filter(c => c.tmdbId === content.tmdbId);

    if (savedContentList.length > 0 && !savedContentList[0].watched) {

      savedContents = savedContents.filter(c => c.tmdbId !== content.tmdbId);
    } else if (savedContentList.length > 0) {

      savedContentList[0].toWatch = false;
    }

    localStorage.setItem(`storedContents`, JSON.stringify(savedContents));
  }

  public addToWatchedContents(content: Content): void {

    const savedContents: Content[] = this.getStoredContents() || [];
    const savedContentList = savedContents.filter(c => c.tmdbId === content.tmdbId);

    if (savedContentList.length > 0) {

      savedContentList[0].watched = true;
    } else {

      content.watched = true;
      savedContents.push(content);
    }

    localStorage.setItem(`storedContents`, JSON.stringify(savedContents));
  }

  public removeFromWatchedContents(content: Content): void {

    let savedContents: Content[] = this.getStoredContents() || [];
    const savedContentList = savedContents.filter(c => c.tmdbId === content.tmdbId);

    if (savedContentList.length > 0 && !savedContentList[0].toWatch) {

      savedContents = savedContents.filter(c => c.tmdbId !== content.tmdbId);
    } else if (savedContentList.length > 0) {

      savedContentList[0].watched = false;
    }

    localStorage.setItem(`storedContents`, JSON.stringify(savedContents));
  }
}
