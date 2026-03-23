import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A292A] text-white/80 pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-secondary text-secondary-foreground p-2 rounded-xl">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-tight">
                EcoBright
              </span>
            </div>
            <p className="mb-6 leading-relaxed">
              Powering Brighter, Smarter, Greener Living. Premium LED lights, fans, and solar solutions for modern spaces.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#home" className="hover:text-secondary transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-secondary transition-colors">About Us</a></li>
              <li><a href="#products" className="hover:text-secondary transition-colors">Our Products</a></li>
              <li><a href="#reviews" className="hover:text-secondary transition-colors">Customer Reviews</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Categories</h4>
            <ul className="space-y-4">
              <li><a href="#products" className="hover:text-secondary transition-colors">Premium LED Lights</a></li>
              <li><a href="#products" className="hover:text-secondary transition-colors">Energy Saving Fans</a></li>
              <li><a href="#products" className="hover:text-secondary transition-colors">Solar Systems</a></li>
              <li><a href="#products" className="hover:text-secondary transition-colors">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                <span>13, 7th Floor, H Latesh Apt,<br/>Near Handloom House,<br/>Nanpura, Surat</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <a href="tel:9601067777" className="hover:text-white transition-colors">+91 96010 67777</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <a href="mailto:info@ecobright.in" className="hover:text-white transition-colors">info@ecobright.in</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {currentYear} EcoBright Lights. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
