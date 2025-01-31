import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-categories-page',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './categories-page.component.html',
    styleUrls: ['./categories-page.component.css']
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