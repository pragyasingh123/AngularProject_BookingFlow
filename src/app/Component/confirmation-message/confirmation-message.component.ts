import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-confirmation-message',
  templateUrl: './confirmation-message.component.html',
  styleUrls: ['./confirmation-message.component.css']
})
export class ConfirmationMessageComponent implements OnInit {

  message:string;
  buttonText:string;
  isLoggedIn:boolean;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,public dialog: MatDialogRef<ConfirmationMessageComponent>) {
    if(data){
      this.message = data.message || this.message;
      this.isLoggedIn = data.isLoggedIn;
      }
  }

  onCancel() {
    this.dialog.close({ data: false })
  }

  onContinue() {
    this.dialog.close({ data: true })
  }

  ngOnInit() {
  }

}
