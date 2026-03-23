import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, totalPrice } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    let message = "Hello EcoBright Lights! I would like to place an order:\n\n";
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - Qty: ${item.quantity} - ₹${item.price * item.quantity}\n`;
    });
    message += `\n*Total: ₹${totalPrice.toLocaleString("en-IN")}*`;
    message += "\n\nPlease let me know the payment and delivery details.";
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919601067777?text=${encodedMessage}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2 text-primary">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="text-xl font-display font-bold">Your Cart</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center gap-4">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <div>
                    <p className="font-medium text-lg text-foreground">Your cart is empty</p>
                    <p className="text-sm mt-1">Looks like you haven't added any energy solutions yet.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-full px-6">
                  <div className="py-6 space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="w-20 h-20 bg-muted rounded-xl flex-shrink-0 overflow-hidden relative">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                              <ShoppingBag className="w-6 h-6 opacity-50" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="font-semibold text-sm line-clamp-2 leading-tight">
                                {item.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border rounded-lg overflow-hidden bg-background">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2.5 py-1.5 hover:bg-muted text-muted-foreground transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2.5 py-1.5 hover:bg-muted text-muted-foreground transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="font-bold text-primary">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t bg-muted/30">
                <div className="flex justify-between mb-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold text-lg">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  Taxes and shipping calculated at checkout via WhatsApp.
                </p>
                <Button 
                  onClick={handleCheckout}
                  className="w-full h-14 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/20 rounded-xl"
                >
                  Checkout on WhatsApp
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
