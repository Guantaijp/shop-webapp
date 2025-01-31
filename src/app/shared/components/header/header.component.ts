// src/app/shared/components/header/header.component.ts
import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [
        RouterLink
    ],
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    isMenuOpen = false;

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }
}
