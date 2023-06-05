import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstpageComponent } from './firstpage/firstpage.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  {
    path: '', component: FirstpageComponent,
    children: [
      { path: 'setting', component: SettingComponent }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
