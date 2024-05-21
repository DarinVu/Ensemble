import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  constructor(private router: Router, private route: ActivatedRoute) {}

  onNext() {
      this.router.navigate(['profile-creation', { relativeTo: this.route }])

  }
}
