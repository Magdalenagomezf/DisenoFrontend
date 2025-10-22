import { TestBed } from '@angular/core/testing';
import FavoritesPage from './favorites';
import { FavoritesService } from '../../app/services/favorites.service';
import { CartService } from '../../app/services/cart.service';

class FavoritesServiceMock {
  private _items = [
    { id: 1, title: 'Top verano', price: 15000, image: 'x.jpg' },
    { id: 2, title: 'Jean mom',  price: 42000, image: 'y.jpg' }
  ];
  list = () => this._items;
  count = () => this._items.length;
  remove = jasmine.createSpy('remove');
}
class CartServiceMock {
  add = jasmine.createSpy('add');
}

describe('FavoritesPage', () => {
  let comp: FavoritesPage;
  let favs: FavoritesServiceMock;
  let cart: CartServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesPage],
      providers: [
        { provide: FavoritesService, useClass: FavoritesServiceMock },
        { provide: CartService, useClass: CartServiceMock },
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(FavoritesPage);
    comp = fixture.componentInstance;
    favs = TestBed.inject(FavoritesService) as unknown as FavoritesServiceMock;
    cart = TestBed.inject(CartService) as unknown as CartServiceMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should add item to cart', () => {
    comp.addToCart({ id: 1, title: 'Top', price: 1000 });
    expect(cart.add).toHaveBeenCalled();
  });

  it('should remove favorite', () => {
    comp.remove(1);
    expect(favs.remove).toHaveBeenCalledWith(1);
  });
});
