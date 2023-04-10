import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  stop() {
    throw new Error('Method not implemented.');
  }
  start() {
    throw new Error('Method not implemented.');
  }
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  signup(data: any) {
    return this.httpClient.post(this.url + '/user/signup', data);
  }

  login(data:any){
    return this.httpClient.post(this.url+ '/user/login',data)
  }

  checkToken(){
    return this.httpClient.get(this.url + "/user/checkToken");
  }

  // for users
  getUser(){
    return this.httpClient.get(this.url+"/user/get");
  }

  update(data:any){
    return this.httpClient.patch(this.url+"/user/update",data,{
      headers:new HttpHeaders().set('Content-type',"application/json")
    })
  }
}
