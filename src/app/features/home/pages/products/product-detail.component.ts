import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { CartItem, CartService } from "../../../../core/services/cart.service";

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="container mx-auto px-4 py-4 mt-16">
            <!-- Toast Notification -->
            <div *ngIf="showToast"
                 class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300"
                 [class.opacity-0]="toastFading"
                 [class.opacity-100]="!toastFading">
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Item added to cart successfully!
                </div>
            </div>

            <!-- Rest of the existing template remains the same -->
            <!-- Back Button -->
            <button (click)="goBack()" class="mb-4 flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
            </button>

            <!-- Loading State -->
            <div *ngIf="isLoading" class="text-center py-4">
                <p>Loading...</p>
            </div>

            <!-- Error State -->
            <div *ngIf="error" class="text-center py-4 text-red-600">
                <p>{{ error }}</p>
            </div>

            <!-- Product Details -->
            <div *ngIf="product && !isLoading" class="bg-white rounded-lg shadow">
                <!-- Image Slider -->
                <div class="relative h-64 mb-4">
                    <img
                            [src]="product.images[currentImageIndex]"
                            class="w-full h-64 object-cover rounded-t-lg"
                            [alt]="product.title"
                    >
                    <!-- Image Navigation -->
                    <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        <button
                                *ngFor="let image of product.images; let i = index"
                                (click)="currentImageIndex = i"
                                class="w-2 h-2 rounded-full"
                                [class.bg-white]="i === currentImageIndex"
                                [class.bg-gray-400]="i !== currentImageIndex"
                        ></button>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="p-4">
                    <h1 class="text-2xl font-bold mb-2">{{ product.title }}</h1>
                    <p class="text-gray-600 mb-4">{{ product.description }}</p>

                    <!-- Price and Category -->
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <p class="text-xl font-bold text-green-600">
                                Kes {{ product.price }}
                            </p>
                            <p class="text-sm text-gray-500">
                                Category: {{ product.category?.name }}
                            </p>
                        </div>
                    </div>

                    <!-- Add to Cart Button -->
                    <button
                            (click)="addToCart()"
                            class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            min-height: 100vh;
            background-color: #f9fafb;
        }
    `]
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
            }, 300);
        }, 2000);
    }
}