import { TestBed } from '@angular/core/testing';
import CartPage from './cart';
import { CartService } from '../../app/services/cart.service';

class CartServiceMock {
  private _items = [
    { id: 1, title: 'Top',  price: 1000, qty: 2, image: 'x.jpg' },
    { id: 2, title: 'Jean', price: 2000, qty: 1, image: 'y.jpg' },
  ];
  list = () => this._items;
  totalItems = () => this._items.reduce((a, i) => a + i.qty, 0);
  totalPrice = () => this._items.reduce((a, i) => a + i.price * i.qty, 0);
  setQty = jasmine.createSpy('setQty');
  remove = jasmine.createSpy('remove');
  clear = jasmine.createSpy('clear');
}

describe('CartPage', () => {
  let comp: CartPage;
  let cart: CartServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPage],
      providers: [{ provide: CartService, useClass: CartServiceMock }]
    }).compileComponents();

    const fixture = TestBed.createComponent(CartPage);
    comp = fixture.componentInstance;
    cart = TestBed.inject(CartService) as unknown as CartServiceMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should set qty', () => {
    const ev = { target: { value: '3' } } as any;
    comp.setQty(1, ev);
    expect(cart.setQty).toHaveBeenCalledWith(1, 3);
  });

  it('should remove item', () => {
    comp.remove(2);
    expect(cart.remove).toHaveBeenCalledWith(2);
  });

  it('should clear cart', () => {
    comp.clear();
    expect(cart.clear).toHaveBeenCalled();
  });
});
