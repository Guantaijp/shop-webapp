// src/app/features/home/home.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
    {
        path: '',
        component: HomePageComponent
    }
];

@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        HomePageComponent
    ]
})
export class HomeModule { }