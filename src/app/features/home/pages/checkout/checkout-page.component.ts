import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../../../core/services/cart.service';

interface CheckoutStep {
    title: string;
    isComplete: boolean;
}

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
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
        this.orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        this.cartService.clearCart();
        this.currentStep++;
        this.steps[2].isComplete = true;
    }

    goToHome(): void {
        this.router.navigate(['/']);
    }
}