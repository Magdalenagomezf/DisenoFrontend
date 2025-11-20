import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private base = 'https://dummyjson.com';


  sendContact(payload: any) {
    return this.http.post<{ id: number }>('https://dummyjson.com/posts/add', {
    ...payload,
    userId: 1
  });
    }
updateContact(id: number, payload: any) {
  return this.http.put(`https://dummyjson.com/posts/${id}`, {
    ...payload,
    userId: 1
  });
}
}
