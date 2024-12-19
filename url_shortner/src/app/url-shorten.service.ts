import { environment } from './../environments';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
interface urlPayload{
  originalUrl:string,
  redirectPrefix:string
}
interface redirectPayload{
  id:string,
}
@Injectable({
  providedIn: 'root'
})
export class UrlShortenService {

  constructor(private http:HttpClient) {
   }
   getShortUrl(data:urlPayload){
    return this.http.post(`${environment.api_url}/common/shorturl`,data)
   }
   redirectUrl(data:redirectPayload){
    return this.http.post(`${environment.api_url}/common/redirect`,data);
   }
}
