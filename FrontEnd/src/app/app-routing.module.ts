import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';


const routes: Routes = [
  { path : '', redirectTo: '/customerlist', pathMatch: 'full'}, //pathMatch: 'full' signifies that the complete URL path requires to be matched and is utilized by the route matching mechanism.
  { path : 'customerlist', component: CustomerListComponent},
  { path : 'edit/:id', component: CreateCustomerComponent},
  { path: '**', component: NoPageFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
