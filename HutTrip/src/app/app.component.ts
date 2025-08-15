import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ControlBarComponentComponent} from './components/control-bar-component/control-bar-component.component';
import {HutListComponentComponent} from './components/hut-list-component/hut-list-component.component';
import {inject} from '@vercel/analytics';

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
export class AppComponent implements OnInit {

  title = 'Hut Trip Planner';
  desc = 'Plan your perfect mountain adventure'

  ngOnInit() {
    inject();
  }
}
