import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-cart-page',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './cart-page.component.html',
    styleUrls: ['./cart-page.component.css']
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