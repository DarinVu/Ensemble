import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
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

  onCloseDropdown() {
    this.displayDropdown = 'none'
  }
}
