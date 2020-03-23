import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Customer } from '../model/Customer';
import { CustomerApiService } from '../customer-api.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {

  id;
  customerApiService: CustomerApiService
  route: ActivatedRoute;
  router: Router;
  Country: any = ['India', 'USA', 'China', 'Japan']
  hobbyData: any = [
    { name: 'Cricket', checked: false },
    { name: 'Football', checked: false },
    { name: 'Reading', checked: false },
    { name: 'Travelling', checked: false },
    { name: 'Other', checked: false }
  ];

  buttonName: string = 'Submit'
  titleName: string = 'Create Customer'
  countryIndex: number
  updateCustomerObj : Customer

  @ViewChild('fileUploader') fileUploader: ElementRef;

  loginForm: FormGroup;
  myForm: FormGroup;


  error_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' },
    ],

    'gender': [
      { type: 'required', message: 'Gender is required.' }
    ],

    'address': [
      { type: 'required', message: 'Address is required.' },
    ],

    'city': [
      { type: 'required', message: 'City is required.' },

    ],
    'state': [
      { type: 'required', message: 'State is required.' },
    ],

    'country': [
      { type: 'required', message: 'Country is required.' },
    ],

    'hobbies': [
      { type: 'required', message: 'Hobbies is required.' },
    ]
  }


  constructor(public formBuilder: FormBuilder, _customerApiService: CustomerApiService, _route: ActivatedRoute,router :Router) {

    this.customerApiService = _customerApiService
    this.route = _route
    this.router =  router

    this.loginForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      gender: new FormControl('', Validators.compose([
        Validators.required
      ])),
      address: new FormControl('', Validators.compose([
        Validators.required
      ])),
      city: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      state: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      country: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      hobbies: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      profile: ['']
    });

  }

  ngOnInit(): void {

    this.myForm = this.formBuilder.group({
      userhobby: this.formBuilder.array([])
    });



    this.route.paramMap.subscribe(parameterMap => {

       this.id = parameterMap.get('id');
      console.log("ID ", this.id)

      if (this.id !== '0') {
        this.customerApiService.getCustomerIdWise(this.id).subscribe(customer => {
          this.updateCustomerObj = customer;
          this.setData(customer);
        })
      }

    })

  }

  // Set customer data to form fields
  setData(row: any) {
    this.loginForm.get('name').setValue(row.name);
    this.loginForm.get('gender').setValue(row.gender.toLowerCase());
    this.loginForm.get('address').setValue(row.address);
    this.loginForm.get('city').setValue(row.city);
    this.loginForm.get('state').setValue(row.state);
    this.loginForm.get('country').setValue(row.country);
    // this.loginForm.get('hobbies').setValue(row.hobbies);
    this.buttonName = 'Update';
    this.titleName = 'Update Customer'

    this.hobbyData = this.hobbyData.map(item => {
      item.checked = false
      return item;
    });


    this.hobbyData = this.hobbyData.map(item => {
      if (row.hobbies.includes(item.name)) {
        item.checked = true
      }
      return item;
    });

    console.log("row.hobbies", row.hobbies);
    console.log("this.hobbyData", this.hobbyData);

  }

  // Choose country using select dropdown
  changeCountry(e) {
    console.log(e)

    this.countryIndex = e.target.selectRow


  }


  // File select event
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.loginForm.get('profile').setValue(file);
      console.log(this.loginForm.get('profile'));

    }
  }


  // Hobby checkbox change event
  selectedOptions() {
    return this.hobbyData
      .filter(opt => opt.checked)
      .map(opt => opt.name)
  }

  onChangeHobby(hobby: any) {
    hobby.checked = !hobby.checked;
    console.log(this.myForm.value.userhobby);
  }


  // Submit form event
  submit(): void {
    console.log("name", this.name.value);
    console.log("gender", this.gender.value);
    console.log("address", this.address.value);
    console.log("city", this.city.value);
    console.log("state", this.state.value);
    console.log("country@", this.loginForm.value.country);
    console.log("country#", this.country.value);
    console.log("country^^", this.country);
    console.log("hobbies", this.selectedOptions().toString());


    var customerObj = {
      name: this.name.value,
      gender: this.gender.value,
      address: this.address.value,
      city: this.city.value,
      state: this.state.value,
      country: this.loginForm.value.country,
      photo: "Photo",
      hobbies: this.selectedOptions().toString(),

    }

    if (this.id == '0')
    {
      this.insertCustomerData(customerObj);
    } else {
      customerObj.photo =this.updateCustomerObj.photo
      this.updateCustomerData(customerObj);
    }
    

  }

  insertCustomerData(customerObj: Customer) {
    const formData = new FormData();
    formData.append('image', this.loginForm.get('profile').value);
    formData.append('name', customerObj.name);
    formData.append('gender', customerObj.gender);
    formData.append('address', customerObj.address);
    formData.append('city', customerObj.city);
    formData.append('state', customerObj.state);
    formData.append('country', customerObj.country);
    formData.append('hobbies', customerObj.hobbies);

    this.customerApiService.insertCustomer(formData).subscribe
      (
        result => {
          console.log("create api ", result);

        },
        error => {
          alert('Something went wrong');
        },
        () => {

          alert('Customer saved successfully');
          // this.getAllData();

        }
      );
  }

  updateCustomerData(customerObj: Customer) {

    this.customerApiService.updateCustomer(this.id,customerObj).subscribe
    (
      result => {
       // console.log("create api ", result);

      },
      error => {
        alert('Something went wrong in update');
      },
      () => {

        alert('Customer updated successfully');
        // this.getAllData();
        this.router.navigate(['/customerlist'])

      }
    );

  }



  // reset form data
  resetData() {
    this.hobbyData.forEach(item => item.checked = false);
    this.loginForm.reset();
    this.buttonName = 'Submit';
    this.titleName = 'Create Customer'
    console.log("this.hobbyData ", this.hobbyData);
    this.fileUploader.nativeElement.value = null;
  }

  get name() {
    return this.loginForm.get('name');
  }

  get gender() {
    return this.loginForm.get('gender');
  }

  get address() {
    return this.loginForm.get('address');
  }

  get city() {
    return this.loginForm.get('city');
  }

  get state() {
    return this.loginForm.get('state');
  }

  get country() {
    return this.loginForm.get('country');
  }

  get hobbies() {
    return this.myForm.get('userhobby');
  }

}
