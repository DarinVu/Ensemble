import { NONE_TYPE } from '@angular/compiler';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {
  show = false;
  displayDropdown = 'none';


  onShow() {
    this.show = !this.show;
  }

  onDisplayDropdown() {
    if (this.displayDropdown == 'none') {
      this.displayDropdown = 'block';
    } else {
      this.displayDropdown = 'none';
    }
  }
}
