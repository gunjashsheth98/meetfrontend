import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  ModalDismissReasons,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DataServiceService } from '../data-service.service';

const now = new Date();

@Component({
  selector: 'app-meetingroom',
  templateUrl: './meetingroom.component.html',
  styleUrls: ['./meetingroom.component.css'],
})
export class MeetingroomComponent implements OnInit {
  model: NgbDateStruct = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
  meetingform: FormGroup;
  submitted = false;
  hourlist: any = [];
  slot = '';
  data: any = {};
  closeResult = '';
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private dataService: DataServiceService
  ) {}

  ngOnInit(): void {
    this.meetingform = this.formBuilder.group({
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern('^[6789]+[0-9]{9}$'),
        ],
      ],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
    });
    this.getmeeting();
  }

  getmeeting() {
    this.hourlist = [
      { slot: '9 AM' },
      { slot: '10 AM' },
      { slot: '11 AM' },
      { slot: '12 PM' },
      { slot: '1 PM' },
      { slot: '2 PM' },
      { slot: '3 PM' },
      { slot: '4 PM' },
      { slot: '5 PM' },
    ];
    let date = this.model.day + '-' + this.model.month + '-' + this.model.year;
    this.dataService.getmeet(date).subscribe(
      (data: any) => {
        if (data.success === true) {
          for (let h of this.hourlist) {
            for (let d of data.data) {
              if (d.slot === h.slot) {
                h.message = 'No Longer Available';
                h.firstname = d.firstname;
                h.lastname = d.lastname;
                h.phoneNumber = d.phonenumber;
                h.id = d._id;
              }
            }
          }
        }
      },
      (error) => {
        if (error.error.message === 'Failed') {
          // this.dataService.logout();
        }
        console.log(error.error.message);
        Swal.fire('Error', error.error.error, 'error');
      }
    );
  }

  addmeeting() {
    this.data.phonenumber = this.meetingform.value.phoneNumber;
    this.data.firstname = this.meetingform.value.firstname;
    this.data.lastname = this.meetingform.value.lastname;
    this.data.date =
      this.model.day + '-' + this.model.month + '-' + this.model.year;
    this.dataService.addmeet(this.data).subscribe(
      (data: any) => {
        if (data.success === true) {
          Swal.fire('Success', 'Meeting Added Successfully !', 'success');
          this.modalService.dismissAll();
          this.ngOnInit();
        }
      },
      (error) => {
        if (error.error.message === 'Failed') {
          // this.dataService.logout();
        }
        console.log(error.error.message);
        Swal.fire('Error', error.error.error, 'error');
      }
    );
  }

  editmeeting() {
    this.data.phonenumber = this.meetingform.value.phoneNumber;
    this.data.firstname = this.meetingform.value.firstname;
    this.data.lastname = this.meetingform.value.lastname;
    this.data.date =
      this.model.day + '-' + this.model.month + '-' + this.model.year;
    this.dataService.editmeet(this.data).subscribe(
      (data: any) => {
        if (data.success === true) {
          Swal.fire('Success', 'Meeting Edited Successfully !', 'success');
          this.modalService.dismissAll();
          this.ngOnInit();
        }
      },
      (error) => {
        console.log(error.error.message);
        Swal.fire('Error', error.error.error, 'error');
      }
    );
  }

  deletemeeting(hour: any) {
    this.dataService.deletemeet(hour.id).subscribe(
      (data: any) => {
        if (data.success === true) {
          Swal.fire('Deleted!', '', 'success');
          this.modalService.dismissAll();
          this.ngOnInit();
        }
      },
      (error) => {
        console.log(error.error.message);
        Swal.fire('Error', error.error.error, 'error');
      }
    );
  }

  openmeeting(content: any, hour: any) {
    this.data.slot = hour;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdrop: 'static',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openeditmeeting(content: any, hour: any) {
    this.slot = hour.slot;
    this.data.id = hour.id;
    this.data.slot = hour.slot;
    this.meetingform.patchValue({
      phoneNumber: hour.phoneNumber,
      firstname: hour.firstname,
      lastname: hour.lastname,
    });
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdrop: 'static',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  opendelete(content: any, hour: any) {
    console.log(hour);
    Swal.fire({
      title: 'Do you want to Delete the Meeting At ' + hour.slot + '?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.deletemeeting(hour);
      }
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  get f() {
    return this.meetingform.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.meetingform.invalid) {
      return;
    } else {
      if (this.slot) {
        this.editmeeting();
      } else {
        this.addmeeting();
      }
    }

    this.meetingform.reset();
    this.submitted = false;
  }

  close() {
    this.modalService.dismissAll();
    this.meetingform.reset();
    this.submitted = false;
    this.slot = '';
  }
}
