// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
    declarations: [
        // AppComponent should be in declarations
    ],
    imports: [
        BrowserModule,
        HttpClientModule,    // Only import once
        AppRoutingModule,
        CoreModule,
        SharedModule,
        AppComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }