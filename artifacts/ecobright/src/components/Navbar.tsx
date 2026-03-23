import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Link } from "wouter";
import { ShoppingCart, Leaf, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Products", href: "#products" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("#home")}
            className="flex items-center gap-2 group"
          >
            <div className="bg-primary text-white p-2 rounded-xl group-hover:bg-secondary transition-colors duration-300">
              <Leaf className="w-6 h-6" />
            </div>
            <span
              className={`text-xl font-display font-bold tracking-tight transition-colors duration-300 ${
                isScrolled ? "text-primary" : "text-white"
              }`}
            >
              EcoBright <span className="text-secondary">Lights</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.href)}
                className={`text-sm font-semibold transition-colors hover:text-secondary ${
                  isScrolled ? "text-foreground" : "text-white/90"
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/919601067777"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold bg-[#25D366]/10 text-[#25D366] px-4 py-2 rounded-full hover:bg-[#25D366] hover:text-white transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>9601067777</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-full transition-colors ${
                isScrolled
                  ? "text-primary hover:bg-muted"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`md:hidden p-2 rounded-full ${
                isScrolled ? "text-primary" : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-lg font-semibold text-foreground py-2 border-b border-muted hover:text-secondary"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
