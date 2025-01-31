import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { CartItem, CartService } from "../../../../core/services/cart.service";

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterLinkActive, RouterLink],
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
    product: any = null;
    isLoading = true;
    error: string | null = null;
    currentImageIndex = 0;
    showToast = false;
    toastFading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apiService: ApiService,
        private cartService: CartService
    ) {}

    ngOnInit(): void {
        const productId = this.route.snapshot.paramMap.get('id');
        if (productId) {
            this.loadProduct(parseInt(productId));
        } else {
            this.error = 'Product not found';
            this.isLoading = false;
        }
    }

    private loadProduct(id: number): void {
        this.apiService.getProduct(id).subscribe({
            next: (data) => {
                this.product = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to load product';
                this.isLoading = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/']);
    }

    addToCart(): void {
        const cartItem: CartItem = {
            id: this.product.id,
            title: this.product.title,
            price: this.product.price,
            quantity: 1,
            image: this.product.images[0],
            available: this.product.stock || 99
        };
        this.cartService.addToCart(cartItem);
        this.showToast = true;

        // Start fade out after 2 seconds
        setTimeout(() => {
            this.toastFading = true;
            // Hide toast after fade animation completes
            setTimeout(() => {
                this.showToast = false;
                this.toastFading = false;
            }, 500); // Adjusted to match fade out duration
        }, 2000);
    }
}