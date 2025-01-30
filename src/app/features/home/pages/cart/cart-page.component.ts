// cart-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-cart-page',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
        <div class="container mx-auto px-4 py-4 mt-16 mb-20">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-bold">Shopping Cart</h1>
                <button 
                    *ngIf="cartItems.length > 0"
                    (click)="clearCart()"
                    class="text-red-600 text-sm hover:text-red-800"
                >
                    Clear Cart
                </button>
            </div>

            <!-- Empty Cart State -->
            <div *ngIf="cartItems.length === 0" class="text-center py-8">
                <div class="text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p class="text-xl font-semibold">Your cart is empty</p>
                    <p class="mt-2">Add some items to get started</p>
                    <button 
                        routerLink="/"
                        class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>

            <!-- Cart Items -->
            <div *ngIf="cartItems.length > 0" class="space-y-4">
                <div 
                    *ngFor="let item of cartItems" 
                    class="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
                >
                    <!-- Product Image -->
                    <img 
                        [src]="item.image" 
                        [alt]="item.title"
                        class="w-20 h-20 object-cover rounded-lg"
                    >
                    
                    <!-- Product Details -->
                    <div class="flex-grow">
                        <h3 class="font-semibold">{{ item.title }}</h3>
                        <p class="text-green-600">Kes {{ item.price }}</p>
                    </div>

                    <!-- Quantity Controls -->
                    <div class="flex items-center space-x-2">
                        <button 
                            (click)="updateQuantity(item, item.quantity - 1)"
                            [disabled]="item.quantity <= 1"
                            class="w-8 h-8 rounded-full border flex items-center justify-center"
                            [class.opacity-50]="item.quantity <= 1"
                        >
                            -
                        </button>
                        <input 
                            type="number" 
                            [(ngModel)]="item.quantity"
                            (ngModelChange)="updateQuantity(item, $event)"
                            class="w-16 text-center border rounded-lg"
                            min="1"
                            [max]="item.available"
                        >
                        <button 
                            (click)="updateQuantity(item, item.quantity + 1)"
                            [disabled]="item.quantity >= item.available"
                            class="w-8 h-8 rounded-full border flex items-center justify-center"
                            [class.opacity-50]="item.quantity >= item.available"
                        >
                            +
                        </button>
                    </div>

                    <!-- Remove Button -->
                    <button 
                        (click)="removeItem(item.id)"
                        class="text-red-600 hover:text-red-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Cart Summary -->
            <div *ngIf="cartItems.length > 0" class="fixed bottom-16 left-0 right-0 bg-white border-t p-4">
                <div class="container mx-auto">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <p class="text-gray-600">Subtotal ({{ totalItems }} items)</p>
                            <p class="text-xl font-bold">Kes {{ total | number:'1.2-2' }}</p>
                        </div>
                        <button 
                            routerLink="/checkout"
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div class="container mx-auto">
                    <div class="flex justify-between items-center px-4 py-3">
                        <a href="#" class="text-center text-yellow-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span class="text-xs">Home</span>
                        </a>
                        <a
                                [routerLink]="['/categories']"
                                routerLinkActive="text-yellow-500"
                                class="text-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span class="text-xs">Categories</span>
                        </a>
                        <a
                                [routerLink]="['/cart']"
                                routerLinkActive="text-yellow-500"
                                class="text-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span class="text-xs">My Cart</span>
                        </a>
                        <a href="#" class="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="text-xs">Payments</span>
                        </a>
                        <a href="#" class="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                            <span class="text-xs">More</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class CartPageComponent implements OnInit {
    cartItems: CartItem[] = [];
    total: number = 0;
    totalItems: number = 0;

    constructor(private cartService: CartService) {}

    ngOnInit(): void {
        this.cartService.getCartItems().subscribe(items => {
            this.cartItems = items;
        });

        this.cartService.getTotal().subscribe(total => {
            this.total = total;
        });

        this.cartService.getItemCount().subscribe(count => {
            this.totalItems = count;
        });
    }

    updateQuantity(item: CartItem, quantity: number): void {
        if (quantity < 1 || quantity > item.available) return;
        this.cartService.updateQuantity(item.id, quantity);
    }

    removeItem(itemId: number): void {
        this.cartService.removeItem(itemId);
    }

    clearCart(): void {
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cartService.clearCart();
        }
    }
}