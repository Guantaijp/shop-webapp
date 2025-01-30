import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {CartItem, CartService} from '../../../../core/services/cart.service';

interface CheckoutStep {
    title: string;
    isComplete: boolean;
}

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4 max-w-4xl">
        <!-- Checkout Steps -->
        <div class="mb-8">
          <div class="flex justify-between items-center">
            <div *ngFor="let step of steps; let i = index" 
                 class="flex-1 relative">
              <div class="flex items-center">
                <div [class]="getStepNumberClass(i)">
                  {{ i + 1 }}
                </div>
                <div class="ml-3">
                  <p [class]="getStepTitleClass(i)">{{ step.title }}</p>
                </div>
              </div>
              <div *ngIf="i < steps.length - 1" 
                   class="absolute top-1/2 left-1/2 w-full h-0.5"
                   [class]="i < currentStep ? 'bg-blue-600' : 'bg-gray-300'">
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
          <div class="space-y-4">
            <div *ngFor="let item of cartItems" class="flex justify-between items-center">
              <div class="flex items-center">
                <img [src]="item.image" 
                     [alt]="item.title" 
                     class="w-16 h-16 object-cover rounded">
                <div class="ml-4">
                  <p class="font-medium">{{ item.title }}</p>
                  <p class="text-gray-500">Quantity: {{ item.quantity }}</p>
                </div>
              </div>
              <p class="font-semibold">Kes {{ item.price * item.quantity }}</p>
            </div>
          </div>
          <div class="border-t mt-4 pt-4">
            <div class="flex justify-between items-center">
              <p class="font-medium">Total</p>
              <p class="text-xl font-bold text-blue-600">Kes {{ total }}</p>
            </div>
          </div>
        </div>

        <!-- Checkout Forms -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <!-- Shipping Information -->
          <form *ngIf="currentStep === 0" [formGroup]="shippingForm" (ngSubmit)="nextStep()">
            <h2 class="text-xl font-semibold mb-4">Shipping Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input type="text" 
                       formControlName="firstName"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <div *ngIf="shippingForm.get('firstName')?.errors?.['required'] && shippingForm.get('firstName')?.touched"
                     class="text-red-500 text-sm mt-1">
                  First name is required
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input type="text" 
                       formControlName="lastName"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <div *ngIf="shippingForm.get('lastName')?.errors?.['required'] && shippingForm.get('lastName')?.touched"
                     class="text-red-500 text-sm mt-1">
                  Last name is required
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input type="text" 
                       formControlName="address"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <div *ngIf="shippingForm.get('address')?.errors?.['required'] && shippingForm.get('address')?.touched"
                     class="text-red-500 text-sm mt-1">
                  Address is required
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input type="tel" 
                       formControlName="phone"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <div *ngIf="shippingForm.get('phone')?.errors?.['required'] && shippingForm.get('phone')?.touched"
                     class="text-red-500 text-sm mt-1">
                  Phone number is required
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input type="email" 
                       formControlName="email"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <div *ngIf="shippingForm.get('email')?.errors?.['required'] && shippingForm.get('email')?.touched"
                     class="text-red-500 text-sm mt-1">
                  Email is required
                </div>
                <div *ngIf="shippingForm.get('email')?.errors?.['email'] && shippingForm.get('email')?.touched"
                     class="text-red-500 text-sm mt-1">
                  Please enter a valid email
                </div>
              </div>
            </div>
            <button type="submit"
                    [disabled]="!shippingForm.valid"
                    class="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:bg-gray-400">
              Continue to Payment
            </button>
          </form>

          <!-- Payment Information -->
          <form *ngIf="currentStep === 1" [formGroup]="paymentForm" (ngSubmit)="nextStep()">
            <h2 class="text-xl font-semibold mb-4">Payment Information</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input type="text" 
                       formControlName="cardNumber"
                       placeholder="1234 5678 9012 3456"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input type="text" 
                         formControlName="expiryDate"
                         placeholder="MM/YY"
                         class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input type="text" 
                         formControlName="cvv"
                         placeholder="123"
                         class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input type="text" 
                       formControlName="cardName"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>
            <div class="flex gap-4 mt-6">
              <button type="button"
                      (click)="previousStep()"
                      class="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-200">
                Back
              </button>
              <button type="submit"
                      [disabled]="!paymentForm.valid"
                      class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:bg-gray-400">
                Place Order
              </button>
            </div>
          </form>

          <!-- Order Confirmation -->
          <div *ngIf="currentStep === 2" class="text-center py-8">
            <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <h2 class="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
            <p class="text-gray-600 mb-6">Your order has been placed successfully.</p>
            <p class="font-medium mb-4">Order #{{ orderId }}</p>
            <button (click)="goToHome()"
                    class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})

export class CheckoutComponent implements OnInit {
    steps: CheckoutStep[] = [
        { title: 'Shipping', isComplete: false },
        { title: 'Payment', isComplete: false },
        { title: 'Confirmation', isComplete: false }
    ];

    currentStep = 0;
    cartItems: CartItem[] = [];
    total: number = 0;
    orderId = '';

    shippingForm: FormGroup;
    paymentForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private cartService: CartService
    ) {
        this.shippingForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            address: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });

        this.paymentForm = this.fb.group({
            cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
            expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$')]],
            cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
            cardName: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        // Subscribe to the observables to get values
        this.cartService.getCartItems().subscribe((items: CartItem[]) => {
            this.cartItems = items;
        });

        this.cartService.getTotal().subscribe((total: number) => {
            this.total = total;
        });
    }

    getStepNumberClass(index: number): string {
        if (index < this.currentStep) {
            return 'w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center';
        } else if (index === this.currentStep) {
            return 'w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center';
        } else {
            return 'w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center';
        }
    }

    getStepTitleClass(index: number): string {
        if (index <= this.currentStep) {
            return 'text-sm font-medium text-blue-600';
        } else {
            return 'text-sm font-medium text-gray-500';
        }
    }

    nextStep(): void {
        if (this.currentStep === 0 && this.shippingForm.valid) {
            this.steps[0].isComplete = true;
            this.currentStep++;
        } else if (this.currentStep === 1 && this.paymentForm.valid) {
            this.steps[1].isComplete = true;
            this.processOrder();
        }
    }

    previousStep(): void {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    private processOrder(): void {
        // Here you would typically:
        // 1. Send order details to your backend
        // 2. Process payment
        // 3. Clear cart
        // 4. Generate order ID

        // Simulating order processing
        this.orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        this.cartService.clearCart();
        this.currentStep++;
        this.steps[2].isComplete = true;
    }

    goToHome(): void {
        this.router.navigate(['/']);
    }
}