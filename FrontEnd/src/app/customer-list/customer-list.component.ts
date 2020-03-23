import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from '../customer-api.service';
import { Customer } from '../model/Customer';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ConfirmationDialog } from '../confirmation-dialog.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customerApiService :CustomerApiService
  customerArr = new Array<Customer>();
  searchText: string
  router : Router
  public useDefault = false;

  constructor(customerApiService: CustomerApiService, _router : Router, private dialog: MatDialog,
    private snackBar: MatSnackBar) {

    this.router = _router;
    this.customerApiService =  customerApiService

    this.getCustomer ()
  }

  getCustomer ()
  {
    this.customerApiService.getCustomer().subscribe(response => {
      this.customerArr = response as Customer[];

    })
  }

  ngOnInit(): void {
  }

  editCustomer (customer)
  {
      console.log(customer)
      this.router.navigate(['/edit', customer._id])
  }

  openDialog(customerId) {
    const dialogRef = this.dialog.open(ConfirmationDialog,{
      data:{
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: ' YES ',
          cancel: ' NO '
        }
      }
    });

    dialogRef.afterClosed().subscribe(
      (data) => {

        if(data === true)
        {
          this.deleteCustomer(customerId)
        }
      } 
  );
  }


   deleteCustomer (id) {

    this.customerApiService.deleteCustomer(id).subscribe(() => {
      alert('Customer deleted successfully.');
      this.getCustomer()

    });
    
  }

  direction: number;
  isDesc: boolean = false;
  column: string = 'name';

// Change sort function to this: 
sort(property){
  this.isDesc = !this.isDesc; //change the direction    
  this.column = property;
  this.direction = this.isDesc ? 1 : -1;
}

public toggle(event: MatSlideToggleChange) {
  console.log('toggle', event.checked);
  this.useDefault = event.checked;
  this.sort('date');
}
 

}
