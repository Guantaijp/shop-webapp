import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
    template: `
        <div class="container mx-auto px-4 py-4 mt-16">
            <!-- Search Bar -->
            <div class="mb-6">
                <div class="flex items-center bg-gray-100 rounded-lg p-2">
                    <span class="text-gray-500 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                    </span>
                    <input
                            type="text"
                            [(ngModel)]="searchQuery"
                            (ngModelChange)="onSearch($event)"
                            placeholder="Search products"
                            class="bg-transparent w-full focus:outline-none"
                    >
                </div>
            </div>

            <!-- Promotions Slider -->
            <div class="mb-6 p-4 bg-gray-100">
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-orange-500 rounded-lg p-4 text-white">
                        <div class="flex items-center">
                            <div>
                                <h3 class="font-bold text-lg">WINNING CASH</h3>
                                <p class="text-sm">WEDNESDAY</p>
                            </div>
                            <img src="/api/placeholder/80/80" class="ml-auto" alt="promo">
                        </div>
                        <p class="mt-2 text-sm">Lorem ipsum KSH 1000</p>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-4 text-white flex items-center justify-center">
                        <img src="/api/placeholder/80/80" alt="promo">
                    </div>
                </div>
            </div>

            <!-- Categories -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-semibold">Categories</h2>
                    <a href="#" class="text-blue-600 text-sm">View all</a>
                </div>
                <div class="flex space-x-4 overflow-x-auto pb-2">
                    <button
                            (click)="selectCategory(null)"
                            class="px-4 py-2 rounded-full border whitespace-nowrap"
                            [class.bg-blue-600]="!selectedCategoryId"
                            [class.text-white]="!selectedCategoryId"
                    >
                        All
                    </button>
                    <button
                            *ngFor="let category of categories"
                            (click)="selectCategory(category.id)"
                            class="px-4 py-2 rounded-full border whitespace-nowrap"
                            [class.bg-blue-600]="category.id === selectedCategoryId"
                            [class.text-white]="category.id === selectedCategoryId"
                    >
                        {{ category.name }}
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div *ngIf="isLoading" class="text-center py-4">
                <p>Loading...</p>
            </div>

            <!-- Error State -->
            <div *ngIf="error" class="text-center py-4 text-red-600">
                <p>{{ error }}</p>
            </div>

            <!-- All Products -->
            <div *ngIf="!isLoading && !error" class="mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-semibold">Products</h2>
                    <a href="#" class="text-blue-600 text-sm">View all</a>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div *ngFor="let product of products"
                         class="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition duration-200"
                         [routerLink]="['/product', product.id]">
                        <img [src]="product.images[0]" class="w-full h-32 object-cover mb-2" [alt]="product.title">
                        <h3 class="font-semibold text-sm mb-1">{{ product.title }}</h3>
                        <p class="text-green-600">Kes {{ product.price }}</p>
                    </div>
                </div>
                <div *ngIf="products.length === 0" class="text-center py-4">
                    <p>No products found</p>
                </div>
            </div>

            <!-- Navigation Bar -->
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div class="container mx-auto">
                    <div class="flex justify-between items-center px-4 py-3">
                        <a href="#" class="text-center text-yellow-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span class="text-xs">Home</span>
                        </a>
                        <a href="#" class="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span class="text-xs">Categories</span>
                        </a>
                        <a href="#" class="text-center">
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
    `,
    styles: [`
        :host {
            display: block;
            padding-bottom: 70px; /* Space for bottom navigation */
        }
    `]
})
export class HomePageComponent implements OnInit {
    categories: any[] = [];
    products: any[] = [];
    isLoading = true;
    error: string | null = null;
    searchQuery: string = '';
    selectedCategoryId: number | null = null;
    private searchSubject = new Subject<string>();

    constructor(private apiService: ApiService) {
        // Set up search debounce
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(query => {
                this.isLoading = true;
                return this.apiService.getProductsByTitle(query);
            })
        ).subscribe({
            next: (products) => {
                this.products = products;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to search products';
                this.isLoading = false;
            }
        });
    }

    ngOnInit(): void {
        this.loadCategories();
        this.loadProducts();
    }

    onSearch(query: string): void {
        if (query.trim() === '') {
            this.loadProducts(); // Reset to all products if search is cleared
        } else {
            this.searchSubject.next(query);
        }
    }

    selectCategory(categoryId: number | null): void {
        this.selectedCategoryId = categoryId;
        this.isLoading = true;

        if (categoryId === null) {
            this.loadProducts();
        } else {
            this.apiService.getProductsByCategory(categoryId).subscribe({
                next: (products) => {
                    this.products = products;
                    this.isLoading = false;
                },
                error: (err) => {
                    this.error = 'Failed to load products for category';
                    this.isLoading = false;
                }
            });
        }
    }

    private loadCategories(): void {
        this.apiService.getCategories().subscribe({
            next: (data) => {
                this.categories = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to load categories';
                this.isLoading = false;
            }
        });
    }

    private loadProducts(): void {
        this.apiService.getProducts({ limit: 8 }).subscribe({
            next: (data) => {
                this.products = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to load products';
                this.isLoading = false;
            }
        });
    }
}