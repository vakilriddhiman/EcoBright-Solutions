import { motion } from "framer-motion";
import { ShieldCheck, Award, Zap, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const badges = [
    { icon: <ShieldCheck className="w-5 h-5" />, text: "Quality Assured" },
    { icon: <Award className="w-5 h-5" />, text: "1 Year Warranty" },
    { icon: <Zap className="w-5 h-5" />, text: "Energy Saving" },
    { icon: <Leaf className="w-5 h-5" />, text: "Eco Friendly" },
  ];

  return (
    <section id="home" className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden bg-primary">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Modern beautifully lit interior" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary text-sm font-bold tracking-wider mb-6 border border-secondary/30">
              POWERING BRIGHTER, SMARTER LIVING
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.1] mb-6">
              Brighten Your Space with <span className="text-secondary">Smart Energy</span> Solutions
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
              Premium LED lights, energy-saving fans, and advanced solar systems designed for modern homes and businesses. Upgrade your lifestyle while reducing bills.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button 
                onClick={() => scrollTo("#products")}
                size="lg" 
                className="h-14 px-8 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_0_40px_-10px_rgba(244,180,0,0.5)] rounded-xl"
              >
                Shop Now
              </Button>
              <Button 
                onClick={() => scrollTo("#contact")}
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg font-bold text-white border-white/30 hover:bg-white/10 hover:text-white rounded-xl backdrop-blur-sm"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-8 border-t border-white/10"
          >
            {badges.map((badge, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="p-2 rounded-lg bg-white/10 text-secondary">
                  {badge.icon}
                </div>
                <span className="text-sm font-semibold">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
