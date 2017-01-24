import { Routes, RouterModule } from '@angular/router';

import { NoContentComponent } from './shared/components/no-content/no-content.component';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '**',    component: NoContentComponent },
];
