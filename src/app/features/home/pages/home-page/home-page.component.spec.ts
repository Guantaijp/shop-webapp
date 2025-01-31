import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { ApiService } from '../../../../core/services/api.service';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('HomePageComponent', () => {
    let component: HomePageComponent;
    let fixture: ComponentFixture<HomePageComponent>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;

    const mockProducts = [
        {
            id: 1,
            title: 'Product 1',
            price: 1000,
            images: ['image1.jpg']
        },
        {
            id: 2,
            title: 'Product 2',
            price: 2000,
            images: ['image2.jpg']
        }
    ];

    const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' }
    ];

    beforeEach(async () => {
        apiServiceSpy = jasmine.createSpyObj('ApiService', [
            'getProducts',
            'getCategories',
            'getProductsByTitle',
            'getProductsByCategory'
        ]);

        await TestBed.configureTestingModule({
            imports: [
                HomePageComponent,
                HttpClientTestingModule,
                RouterTestingModule,
                FormsModule
            ],
            providers: [{ provide: ApiService, useValue: apiServiceSpy }]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
        apiServiceSpy.getProducts.and.returnValue(of(mockProducts));
        apiServiceSpy.getCategories.and.returnValue(of(mockCategories));
    });

    describe('UI Elements', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should render search bar', () => {
            const searchInput = fixture.debugElement.query(By.css('input[type="text"]'));
            expect(searchInput).toBeTruthy();
            expect(searchInput.attributes['placeholder']).toBe('Search products');
        });

        it('should render promotions section', () => {
            const promotionsSection = fixture.debugElement.query(By.css('.mb-6.p-4.bg-gray-100'));
            expect(promotionsSection).toBeTruthy();

            const winningCard = fixture.debugElement.query(By.css('.bg-orange-500'));
            expect(winningCard.query(By.css('h3')).nativeElement.textContent).toBe('WINNING CASH');
        });

        it('should render categories section with buttons', () => {
            const categoryButtons = fixture.debugElement.queryAll(By.css('.rounded-full.border'));
            // +1 for the "All" button
            expect(categoryButtons.length).toBe(mockCategories.length + 1);

            // Check "All" button is present
            const allButton = categoryButtons[0];
            expect(allButton.nativeElement.textContent.trim()).toBe('All');
        });

        it('should render products grid', () => {
            const productCards = fixture.debugElement.queryAll(By.css('.shadow-md.rounded-lg'));
            expect(productCards.length).toBe(mockProducts.length);

            // Check first product card content
            const firstCard = productCards[0];
            expect(firstCard.query(By.css('img')).attributes['src']).toBe(mockProducts[0].images[0]);
            expect(firstCard.query(By.css('h3')).nativeElement.textContent).toContain(mockProducts[0].title);
            expect(firstCard.query(By.css('p')).nativeElement.textContent).toContain(mockProducts[0].price);
        });

        it('should render navigation bar', () => {
            const navbar = fixture.debugElement.query(By.css('.fixed.bottom-0'));
            expect(navbar).toBeTruthy();

            const navItems = navbar.queryAll(By.css('a'));
            expect(navItems.length).toBe(5); // Home, Categories, Cart, Payments, More
        });
    });

    describe('Search Functionality', () => {
        it('should update search results on input change', fakeAsync(() => {
            const searchTerm = 'test';
            apiServiceSpy.getProductsByTitle.and.returnValue(of(mockProducts));

            fixture.detectChanges();

            const searchInput = fixture.debugElement.query(By.css('input[type="text"]'));
            searchInput.nativeElement.value = searchTerm;
            searchInput.nativeElement.dispatchEvent(new Event('input'));

            tick(300); // Wait for debounce
            fixture.detectChanges();

            expect(apiServiceSpy.getProductsByTitle).toHaveBeenCalledWith(searchTerm);
        }));
    });

    describe('Category Selection', () => {
        it('should highlight selected category button and update selectedCategoryId', () => {
            fixture.detectChanges();

            const categoryButtons = fixture.debugElement.queryAll(By.css('.rounded-full.border'));
            const secondCategoryButton = categoryButtons[1];

            secondCategoryButton.nativeElement.click();
            fixture.detectChanges();

            expect(secondCategoryButton.classes['bg-blue-600']).toBeTruthy();
            expect(component.selectedCategoryId).toBe(mockCategories[0].id);
        });

        it('should show "All" as selected when no category is selected', () => {
            fixture.detectChanges();

            const allButton = fixture.debugElement.query(By.css('.rounded-full.border'));
            expect(allButton.classes['bg-blue-600']).toBeTruthy();
        });
    });

    describe('Loading and Error States', () => {
        it('should show loading state', async () => {
            // Reset other states first
            component.error = '';
            component.products = mockProducts;
            component.isLoading = true;

            fixture.detectChanges();

            // Wait for any asynchronous tasks to finish
            await fixture.whenStable();

            // Check for loading state using a more specific selector
            const loadingElement = fixture.debugElement.query(By.css('div.text-center.py-4'));
            expect(loadingElement).toBeTruthy();
            expect(loadingElement.nativeElement.textContent.trim()).toBe('Loading...');
        });
        it('should show error state', () => {
            // Reset other states first
            component.isLoading = false;
            component.products = mockProducts;
            component.error = 'Error message';

            fixture.detectChanges();

            const errorElement = fixture.debugElement.query(
                By.css('.text-center.py-4.text-red-600')
            );
            expect(errorElement).toBeTruthy();
            expect(errorElement.nativeElement.textContent.trim()).toBe('Error message');
        });

        it('should show "No products found" when products array is empty', () => {
            // Reset other states first
            component.isLoading = false;
            component.error = '';
            component.products = [];

            fixture.detectChanges();

            // Be more specific with the selector
            const noProductsElement = fixture.debugElement.query(
                By.css('.grid + div.text-center.py-4')
            );
            expect(noProductsElement).toBeTruthy();
            expect(noProductsElement.nativeElement.textContent.trim()).toBe('No products found');
        });
    });
});