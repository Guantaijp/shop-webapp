// src/app/app.routes.ts
import { Routes } from '@angular/router';
import {ProductDetailComponent} from "./features/home/products/product-detail.component";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/home/pages/home-page/home-page.component')
                .then(m => m.HomePageComponent)
    },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: '**', redirectTo: '' }
];