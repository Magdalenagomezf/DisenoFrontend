import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductCardComponent } from './producto';
import { MLItem } from '../../app/services/api';
import { LoginService } from '../../app/services/login.service';
import { CartService } from '../../app/services/cart.service';
import { FavoritesService } from '../../app/services/favorites.service';

class LoginServiceMock {
  private _logged = true;
  isLoggedIn = () => this._logged;
  setLogged(v: boolean) { this._logged = v; }
}
class CartServiceMock { add = jasmine.createSpy('add'); }
class FavoritesServiceMock { toggle = jasmine.createSpy('toggle'); }

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let auth: LoginServiceMock;
  let cart: CartServiceMock;
  let favs: FavoritesServiceMock;
  let router: Router;

  const mockProduct: MLItem = {
    id: 176,
    title: 'Women Handbag Black',
    price: 59.99,
    currency_id: 'USD',
    permalink: 'https://dummyjson.com/products/176',
    thumbnail: 'https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/thumbnail.webp',
    category: 'womens-bags'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, RouterTestingModule],
      providers: [
        provideNoopAnimations(),
        { provide: LoginService, useClass: LoginServiceMock },
        { provide: CartService, useClass: CartServiceMock },
        { provide: FavoritesService, useClass: FavoritesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    auth = TestBed.inject(LoginService) as unknown as LoginServiceMock;
    cart = TestBed.inject(CartService) as unknown as CartServiceMock;
    favs = TestBed.inject(FavoritesService) as unknown as FavoritesServiceMock;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to detail on goDetail', () => {
    const navSpy = spyOn(router, 'navigate');
    component.goDetail(new MouseEvent('click'));
    expect(navSpy).toHaveBeenCalledWith(['/detalle', mockProduct.id]);
  });

  it('should add to cart when logged in', () => {
    auth.setLogged(true);
    component.onAddToCart();
    expect(cart.add).toHaveBeenCalled();
  });

  it('should redirect to login when not logged in (add)', () => {
    const navSpy = spyOn(router, 'navigate').and.stub();
    spyOn(window, 'alert').and.stub();
    auth.setLogged(false);

    component.onAddToCart();

    expect(cart.add).not.toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should toggle favorite when logged in', () => {
    auth.setLogged(true);
    component.onToggleFav();
    expect(favs.toggle).toHaveBeenCalled();
  });
});
