import { ShoppingCart, Trash2, CreditCard, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface StudentCartProps {
  onCartUpdate: (count: number) => void;
}

export function StudentCart({ onCartUpdate }: StudentCartProps) {
  const cartItems = [
    {
      id: '1',
      courseName: 'Certified Welder',
      image: 'https://images.unsplash.com/photo-1611633002310-d8a3211ddfdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxkaW5nJTIwcHJvZmVzc2lvbmFsJTIwd29ya3xlbnwxfHx8fDE3NjM5NTYwMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 950,
      duration: '6 weeks',
      nextBatch: 'Dec 1, 2024',
      validityPeriod: '2 years'
    },
    {
      id: '2',
      courseName: 'HVAC Technician License',
      image: 'https://images.unsplash.com/photo-1762176264161-09219da49794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFpbmluZyUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NjM5NTYwMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 750,
      duration: '5 weeks',
      nextBatch: 'Dec 5, 2024',
      validityPeriod: '3 years'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleRemoveItem = (id: string) => {
    onCartUpdate(cartItems.length - 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Shopping Cart
        </h1>
        <p className="text-gray-600">Review your selected courses before checkout</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.length === 0 ? (
            <Card className="border-violet-100">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-violet-600" />
                </div>
                <div className="mb-2">Your cart is empty</div>
                <p className="text-gray-600 mb-4">Add some courses to get started</p>
                <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {cartItems.map((item) => (
                <Card key={item.id} className="border-violet-100">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.courseName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="mb-1">{item.courseName}</div>
                            <div className="flex gap-2 mb-2">
                              <Badge variant="secondary">{item.duration}</Badge>
                              <Badge variant="secondary">Valid {item.validityPeriod}</Badge>
                            </div>
                            <p className="text-gray-600">Next batch: {item.nextBatch}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent text-2xl">
                          ${item.price}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>{cartItems.length} course(s) in cart</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                disabled={cartItems.length === 0}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>

              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>

          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle>Have a Coupon?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Enter coupon code" />
                <Button variant="outline">
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-gray-600">Enter your coupon code to get discounts</p>
            </CardContent>
          </Card>

          <Card className="border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="mb-1">Secure Payment</div>
                    <p className="text-gray-600">Your payment information is secure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="mb-1">Money-back Guarantee</div>
                    <p className="text-gray-600">30-day refund policy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="mb-1">Instant Access</div>
                    <p className="text-gray-600">Start learning immediately</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
