import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
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
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css'],

})
export class HomePageComponent implements OnInit {
    categories: any[] = [];
    products: any[] = [];
    isLoading = true;
    error: string | null = null;
    searchQuery: string = '';
    selectedCategoryId: number | null = null;
    promoImagePath = '../assets/promo1.png';
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