import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlBarComponentComponent } from './components/control-bar-component/control-bar-component.component';
import { HutListComponentComponent } from './components/hut-list-component/hut-list-component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ControlBarComponentComponent,
    HutListComponentComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HutTrip';
}
