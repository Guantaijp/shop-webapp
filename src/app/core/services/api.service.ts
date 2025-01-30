import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'https://api.escuelajs.co/api/v1';

    constructor(private http: HttpClient) {}

    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/categories`);
    }

    getProducts(params?: any): Observable<any[]> {
        let httpParams = new HttpParams();

        if (params) {
            Object.keys(params).forEach(key => {
                httpParams = httpParams.set(key, params[key]);
            });
        }

        return this.http.get<any[]>(`${this.apiUrl}/products`, { params: httpParams });
    }
    getProduct(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/products/${id}`);
    }

    getProductsByTitle(title: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/products`, { params: { title } });
    }

    getProductsByPrice(price: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/products`, { params: { price: price.toString() } });
    }

    getProductsByPriceRange(min: number, max: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/products`, { params: { price_min: min.toString(), price_max: max.toString() } });
    }

    getProductsByCategory(categoryId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/products`, { params: { categoryId: categoryId.toString() } });
    }
}
