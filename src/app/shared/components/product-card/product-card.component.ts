import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-product-card',
    standalone: true, // ✅ Mark this as a standalone component
    imports: [CommonModule], // ✅ Import CommonModule for built-in directives
    template: `
    <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <img [src]="product.image" [alt]="product.name" class="w-full h-48 object-cover rounded-lg mb-4">
      <h3 class="text-lg font-semibold mb-2">{{ product.name }}</h3>
      <p class="text-gray-600 mb-2">{{ product.description | slice:0:100 }}...</p>
      <div class="flex justify-between items-center">
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>
  `
})
export class ProductCardComponent {
    @Input() product: any;
}
