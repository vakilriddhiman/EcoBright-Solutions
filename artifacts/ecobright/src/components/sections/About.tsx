import { motion } from "framer-motion";
import { Package, Users, CalendarHeart, Sparkles } from "lucide-react";

export function About() {
  const stats = [
    { icon: <Package />, value: "500+", label: "Products" },
    { icon: <Users />, value: "1000+", label: "Happy Customers" },
    { icon: <CalendarHeart />, value: "5+ Years", label: "Experience" },
    { icon: <Sparkles />, value: "100%", label: "Eco Friendly" },
  ];

  return (
    <section id="about" className="py-24 bg-muted/50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              Empowering Surat with <br/>
              <span className="text-secondary">Sustainable Energy</span>
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                At EcoBright Lights, we specialize in providing high-quality LED lighting, energy-efficient fans, and advanced solar solutions designed to brighten homes and businesses while reducing energy costs.
              </p>
              <p>
                Our products combine durability, modern design, and eco-friendly performance to help you create a smarter and more sustainable space. We are more reliable and modern than local shops, and more personalized than large chains.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-12">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-2 p-6 bg-white rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-2">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-display font-bold text-foreground">{stat.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative">
              <img 
                src={`${import.meta.env.BASE_URL}images/about-solar.png`}
                alt="Solar panels on modern home" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent"></div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
