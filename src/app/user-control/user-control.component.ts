import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-user-control',
  templateUrl: './user-control.component.html',
  styleUrls: ['./user-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserControlComponent implements OnInit {
  @Input() padding: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
