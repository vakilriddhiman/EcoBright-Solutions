import { useState } from "react";
import { Star, MessageSquareQuote } from "lucide-react";
import { useGetReviews, useCreateReview } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const reviewSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
  reviewText: z.string().min(10, "Review must be at least 10 characters"),
});

export function Reviews() {
  const { data: reviews, isLoading, refetch } = useGetReviews();
  const { mutateAsync: createReview, isPending } = useCreateReview();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      customerName: "",
      rating: 5,
      reviewText: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    try {
      await createReview({ data: values });
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });
      setIsOpen(false);
      form.reset();
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to submit",
        description: "Please try again later.",
      });
    }
  };

  // Ensure we show at most 6 reviews
  const displayReviews = reviews?.slice(0, 6) || [];

  return (
    <section id="reviews" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground text-lg">
              Don't just take our word for it. See why homes and businesses in Surat trust EcoBright.
            </p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg">
                <MessageSquareQuote className="w-5 h-5 mr-2" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display text-primary">Share Your Experience</DialogTitle>
                <DialogDescription>
                  Your feedback helps us improve and helps others make better choices.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-muted/50 border-transparent rounded-xl focus-visible:ring-primary h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">Rating</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => field.onChange(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                              >
                                <Star
                                  className={`w-8 h-8 ${
                                    star <= field.value
                                      ? "fill-secondary text-secondary"
                                      : "text-muted-foreground/30 fill-transparent"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reviewText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">Your Review</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about the products you bought..." 
                            className="resize-none bg-muted/50 border-transparent rounded-xl focus-visible:ring-primary min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                    disabled={isPending}
                  >
                    {isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card p-8 rounded-3xl border border-border">
                <div className="flex gap-1 mb-4"><Skeleton className="w-24 h-4" /></div>
                <Skeleton className="w-full h-16 mb-6" />
                <Skeleton className="w-32 h-4" />
              </div>
            ))}
          </div>
        ) : displayReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-border border-dashed">
            <MessageSquareQuote className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No reviews yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayReviews.map((review, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={review.id}
                className="bg-card p-8 rounded-3xl border border-border/60 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="absolute top-6 right-6 text-primary/5">
                  <MessageSquareQuote className="w-16 h-16" />
                </div>
                <div className="flex gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? "fill-secondary text-secondary"
                          : "text-muted-foreground/20 fill-transparent"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-foreground/80 italic mb-6 relative z-10 leading-relaxed">
                  "{review.reviewText}"
                </p>
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-primary">{review.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
