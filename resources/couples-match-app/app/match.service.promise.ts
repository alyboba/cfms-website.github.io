// Promise Version
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Location }           from './location';

@Injectable()
export class MatchService {
  // URL to web api
  private locationsUrl = 'data/locations.json';
  private categoriesUrl = 'data/categories.json';

  constructor (private http: Http) {}

  getItemsA() : Promise<[]> {
  
    let getUrl = 'data/testData/itemsA.json';
    
    return this.http.get(getUrl)
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }
  
    getItemsB() : Promise<[]> {
  
    let getUrl = 'data/testData/itemsB.json';
    
    return this.http.get(getUrl)
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }
  

  getLocations (): Promise<Location[]> {
    return this.http.get(this.locationsUrl)
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }

  getCategories (): Promise<[]> {
    return this.http.get(this.categoriesUrl)
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    //console.log(res);
    let body = res.json();
    //console.log(body);
    return body || { };
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Promise.reject(errMsg);
  }

}

