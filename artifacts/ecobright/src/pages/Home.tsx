import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Products } from "@/components/sections/Products";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Reviews } from "@/components/sections/Reviews";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { FloatingActions } from "@/components/FloatingActions";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <WhyChooseUs />
      <Reviews />
      <Contact />
      <Footer />
      <CartSidebar />
      <FloatingActions />
    </main>
  );
}
