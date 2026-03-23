import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  message: z.string().min(10, "Please provide more details in your message"),
});

export function Contact() {
  const { mutateAsync: submitContact, isPending } = useSubmitContact();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    try {
      await submitContact({ data: values });
      toast({
        title: "Message Sent!",
        description: "We will get back to you shortly.",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try calling us instead.",
      });
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground text-lg">
            Have questions about our products or need a consultation? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Contact Info & Map (Takes 3 columns) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-muted/30 p-6 rounded-3xl border border-border">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Visit Our Store</h3>
                <p className="text-muted-foreground leading-relaxed">
                  13, 7th Floor, H Latesh Apartment,<br/>
                  Near Handloom House, Nanpura,<br/>
                  Surat, Gujarat
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-3xl border border-border">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Call Us</h3>
                <div className="space-y-2">
                  <a href="tel:9601067777" className="block text-muted-foreground hover:text-primary font-medium transition-colors">
                    +91 96010 67777
                  </a>
                  <a href="tel:9099100070" className="block text-muted-foreground hover:text-primary font-medium transition-colors">
                    +91 90991 00070
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-sm border border-border h-[350px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.08226027581!2d72.8122393!3d21.1888806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e5d5a23075b%3A0xc31fa40a4afbd6dc!2sHandloom%20House!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="EcoBright Store Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Form (Takes 2 columns) */}
          <div className="lg:col-span-2 bg-primary p-8 md:p-10 rounded-[2.5rem] shadow-xl text-white">
            <h3 className="text-2xl font-display font-bold mb-6">Send a Message</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Jane Doe" 
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-secondary h-12 rounded-xl" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+91 98765 43210" 
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-secondary h-12 rounded-xl" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">How can we help?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="I'm interested in solar panels for my home..." 
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-secondary min-h-[120px] rounded-xl resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-14 rounded-xl text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 mt-4 shadow-lg shadow-secondary/20"
                >
                  {isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>

        </div>
      </div>
    </section>
  );
}
