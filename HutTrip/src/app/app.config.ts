import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { ControlBarComponentComponent } from './components/control-bar-component/control-bar-component.component';
import { DatePickerComponentComponent } from './components/date-picker-component/date-picker-component.component';
import { HutSearchComponentComponent } from './components/hut-search-component/hut-search-component.component';
import { HutListComponentComponent } from './components/hut-list-component/hut-list-component.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
