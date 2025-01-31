import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterOutlet,
        SharedModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'shop-webapp' title property`, () => {
    expect(component.title).toEqual('shop-webapp');
  });

  it('should render main layout elements', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('should have proper layout structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('div');

    expect(container?.classList.contains('min-h-screen')).toBeTruthy();
    expect(container?.classList.contains('flex')).toBeTruthy();
    expect(container?.classList.contains('flex-col')).toBeTruthy();
  });
});