import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing-module';
import { UsersComponent } from './users.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    UsersComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }
