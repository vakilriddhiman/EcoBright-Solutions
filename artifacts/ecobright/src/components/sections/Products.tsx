import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Info, Lightbulb, Wind, Sun } from "lucide-react";
import { useGetProducts } from "@workspace/api-client-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["All", "LED Lights", "Fans", "Solar Products"];

const categoryIcons = {
  "LED Lights": <Lightbulb className="w-12 h-12" />,
  "Fans": <Wind className="w-12 h-12" />,
  "Solar Products": <Sun className="w-12 h-12" />,
};

export function Products() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addItem } = useCart();
  
  // Use the generated hook. If 'All', don't pass category param
  const { data: products, isLoading, isError } = useGetProducts(
    activeCategory === "All" ? undefined : { category: activeCategory }
  );

  return (
    <section id="products" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-4">
            Our Premium Products
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover our curated selection of energy-efficient solutions designed for modern living.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-4 border border-border shadow-sm">
                <Skeleton className="w-full aspect-[4/3] rounded-xl mb-4" />
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-10 w-1/3" />
                  <Skeleton className="h-10 w-1/3 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 bg-red-50 text-red-600 rounded-2xl">
            <p>Failed to load products. Please try again later.</p>
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-3xl">
            <p className="text-lg text-muted-foreground">No products found in this category.</p>
          </div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {products?.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-card rounded-3xl p-5 border border-border/50 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted/30 mb-6 flex items-center justify-center">
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 z-10 bg-secondary text-secondary-foreground hover:bg-secondary font-bold px-3 py-1">
                        {product.badge}
                      </Badge>
                    )}
                    
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="text-primary/20 group-hover:scale-110 transition-transform duration-500 group-hover:text-primary/40">
                        {categoryIcons[product.category as keyof typeof categoryIcons] || <Lightbulb className="w-12 h-12" />}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <p className="text-sm font-semibold text-secondary mb-2 tracking-wide uppercase">
                      {product.category}
                    </p>
                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 mb-4">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span className="font-bold text-sm">{product.rating}</span>
                      <span className="text-muted-foreground text-sm">({product.reviewCount})</span>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                      {product.description}
                    </p>

                    <div className="mt-auto flex items-end justify-between pt-4 border-t border-border/50">
                      <div>
                        {product.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through mb-0.5">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </p>
                        )}
                        <p className="text-2xl font-display font-bold text-primary">
                          ₹{product.price.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="rounded-full w-10 h-10 border-primary/20 text-primary hover:bg-primary/5"
                          title="View Details"
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => addItem(product)}
                          className="rounded-full px-5 bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
