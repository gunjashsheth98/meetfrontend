import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetingroomComponent } from './meetingroom/meetingroom.component';

const routes: Routes = [
  { path: 'meeting', component: MeetingroomComponent },
  { path: '', redirectTo: '/meeting', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
