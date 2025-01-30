import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ProductCardComponent, // ✅ Import instead of declaring
        HeaderComponent,      // ✅ Import instead of declaring
        FooterComponent       // ✅ Import instead of declaring
    ],
    exports: [
        ProductCardComponent,
        HeaderComponent,
        FooterComponent
    ]
})
export class SharedModule { }