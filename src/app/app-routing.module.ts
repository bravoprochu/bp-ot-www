import { IdentGuard } from './ui/guards/ident.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "app/components/home/home.component";
import { NotFoundComponent } from "app/components/not-found/not-found.component";
import { UiModule } from '@bpUI/ui.module';

const routes: Routes = [
  // {
  //   path: 'ui',
  //   loadChildren: "./ui/ui.module#UiModule"
  // },
  { path: 'home', component: HomeComponent },
  //{ path: '**', component: NotFoundComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
