// src/app/app.routes.ts
import { Routes } from '@angular/router';
import {ProductDetailComponent} from "./features/home/pages/products/product-detail.component";
import {CategoriesPageComponent} from "./features/home/pages/category/categories-page.component";
import {CartPageComponent} from "./features/home/pages/cart/cart-page.component";
import {CheckoutComponent} from "./features/home/pages/checkout/checkout-page.component";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/home/pages/home-page/home-page.component')
                .then(m => m.HomePageComponent)
    },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'categories', component: CategoriesPageComponent },
    // { path: 'category/:id', component: CategoryDetailComponent },
    // cart
    {path: 'cart', component: CartPageComponent},
    {path: 'checkout', component: CheckoutComponent},
    { path: '**', redirectTo: '' }
];