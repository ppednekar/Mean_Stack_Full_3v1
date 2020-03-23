import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from './model/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {

  constructor(private http: HttpClient) { }


  public getCustomer(): Observable<Customer[]> 
  {
    const url = this.createCompleteRoute('customer', environment.urlAddress)
 
    return this.http.get<Customer[]>(url);
  }

  public getCustomerIdWise(id): Observable<Customer> 
  {
    const url = this.createCompleteRoute('customer', environment.urlAddress)
 
    return this.http.get<Customer>(url+'/'+id);
  }



  public updateCustomer(id,customer): Observable<any> 
  {
    const url = this.createCompleteRoute('customer', environment.urlAddress)
 
    return this.http.patch<any>(url+'/'+id, customer);
  }


  
  public insertCustomer(formData : FormData): Observable<String> 
  {
    const url = this.createCompleteRoute('customer', environment.urlAddress)
    return this.http.post<String>(url, formData);
  }

 public deleteCustomer(id): Observable<void> 
  {
    const url = this.createCompleteRoute('customer', environment.urlAddress)
 
    return this.http.delete<void>(url+'/'+id);
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }
  
}
