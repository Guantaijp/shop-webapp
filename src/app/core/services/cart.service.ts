// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
    available: number; // Available stock
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = new BehaviorSubject<CartItem[]>([]);

    constructor() {
        // Load cart from localStorage if exists
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cartItems.next(JSON.parse(savedCart));
        }
    }

    getCartItems(): Observable<CartItem[]> {
        return this.cartItems.asObservable();
    }

    addToCart(item: CartItem): void {
        const currentItems = this.cartItems.value;
        const existingItem = currentItems.find(i => i.id === item.id);

        if (existingItem) {
            existingItem.quantity += 1;
            this.cartItems.next([...currentItems]);
        } else {
            this.cartItems.next([...currentItems, { ...item, quantity: 1 }]);
        }
        this.saveToLocalStorage();
    }

    updateQuantity(itemId: number, quantity: number): void {
        const currentItems = this.cartItems.value;
        const updatedItems = currentItems.map(item =>
            item.id === itemId ? { ...item, quantity } : item
        );
        this.cartItems.next(updatedItems);
        this.saveToLocalStorage();
    }

    removeItem(itemId: number): void {
        const filteredItems = this.cartItems.value.filter(item => item.id !== itemId);
        this.cartItems.next(filteredItems);
        this.saveToLocalStorage();
    }

    clearCart(): void {
        this.cartItems.next([]);
        localStorage.removeItem('cart');
    }

    getTotal(): Observable<number> {
        return new Observable<number>(observer => {
            this.cartItems.subscribe(items => {
                const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                observer.next(total);
            });
        });
    }

    getItemCount(): Observable<number> {
        return new Observable<number>(observer => {
            this.cartItems.subscribe(items => {
                const count = items.reduce((sum, item) => sum + item.quantity, 0);
                observer.next(count);
            });
        });
    }

    private saveToLocalStorage(): void {
        localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
    }
}