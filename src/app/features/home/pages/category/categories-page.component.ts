import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-categories-page',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
        <div class="container mx-auto px-4 py-4 mt-16">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-bold">Categories</h1>
                <div class="relative">
                    <input
                        type="text"
                        [(ngModel)]="searchQuery"
                        (ngModelChange)="filterCategories()"
                        placeholder="Search categories"
                        class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                </div>
            </div>

            <!-- Loading State -->
            <div *ngIf="isLoading" class="text-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p class="mt-4 text-gray-600">Loading categories...</p>
            </div>

            <!-- Error State -->
            <div *ngIf="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{{ error }}</p>
                <button 
                    (click)="loadCategories()"
                    class="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                    Try again
                </button>
            </div>

            <!-- Categories Grid -->
            <div *ngIf="!isLoading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                    *ngFor="let category of filteredCategories"
                    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                    [routerLink]="['/category', category.id]"
                >
                    <!-- Category Image -->
                    <div class="relative h-48">
                        <img 
                            [src]="category.image || '/api/placeholder/400/300'"
                            [alt]="category.name"
                            class="w-full h-full object-cover"
                        >
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 right-0 p-4">
                            <h3 class="text-white text-xl font-bold">{{ category.name }}</h3>
                            <p class="text-white/80 text-sm mt-1">
                                {{ category.productsCount }} Products
                            </p>
                        </div>
                    </div>

                    <!-- Category Info -->
                    <div class="p-4">
                        <p class="text-gray-600 text-sm line-clamp-2">
                            {{ category.description || 'Explore our collection of ' + category.name }}
                        </p>
                        
                        <!-- Popular Products Preview -->
                        <div *ngIf="category.popularProducts?.length" class="mt-4">
                            <h4 class="text-sm font-semibold text-gray-700 mb-2">Popular Items</h4>
                            <div class="flex space-x-2 overflow-x-auto">
                                <div 
                                    *ngFor="let product of category.popularProducts.slice(0, 3)"
                                    class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden"
                                >
                                    <img 
                                        [src]="product.images[0]" 
                                        [alt]="product.title"
                                        class="w-full h-full object-cover"
                                    >
                                </div>
                            </div>
                        </div>

                        <!-- View Category Button -->
                        <button class="w-full mt-4 py-2 text-blue-600 text-sm font-semibold hover:bg-blue-50 rounded-lg transition duration-200">
                            View Category →
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="filteredCategories.length === 0 && !isLoading && !error" class="text-center py-8">
                <div class="text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-xl font-semibold">No categories found</p>
                    <p class="mt-2">Try adjusting your search terms</p>
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
            min-height: 100vh;
            background-color: #f9fafb;
        }
        
        /* Custom scrollbar for popular products */
        ::-webkit-scrollbar {
            height: 4px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 2px;
        }
    `]
})
export class CategoriesPageComponent implements OnInit {
    categories: any[] = [];
    filteredCategories: any[] = [];
    isLoading = true;
    error: string | null = null;
    searchQuery = '';

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.isLoading = true;
        this.error = null;

        this.apiService.getCategories().subscribe({
            next: async (categories) => {
                // Load additional data for each category
                const enrichedCategories = await Promise.all(
                    categories.map(async (category) => {
                        try {
                            const products = await this.apiService
                                .getProductsByCategory(category.id)
                                .toPromise();

                            return {
                                ...category,
                                productsCount: products?.length || 0,
                                popularProducts: products?.slice(0, 3) || []
                            };
                        } catch (error) {
                            return {
                                ...category,
                                productsCount: 0,
                                popularProducts: []
                            };
                        }
                    })
                );

                this.categories = enrichedCategories;
                this.filteredCategories = enrichedCategories;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to load categories. Please try again.';
                this.isLoading = false;
            }
        });
    }

    filterCategories(): void {
        if (!this.searchQuery.trim()) {
            this.filteredCategories = this.categories;
            return;
        }

        const query = this.searchQuery.toLowerCase().trim();
        this.filteredCategories = this.categories.filter(category =>
            category.name.toLowerCase().includes(query) ||
            (category.description && category.description.toLowerCase().includes(query))
        );
    }
}