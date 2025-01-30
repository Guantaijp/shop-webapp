import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {SharedModule} from "./shared/shared.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SharedModule
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header class="hidden sm:block"></app-header>
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      <app-footer class="hidden sm:block"></app-footer>
    </div>
  `
})
export class AppComponent {}