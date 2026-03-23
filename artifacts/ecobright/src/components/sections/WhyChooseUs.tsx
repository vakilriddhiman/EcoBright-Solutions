import { Zap, ShieldCheck, IndianRupee, Paintbrush, Leaf, Truck } from "lucide-react";
import { motion } from "framer-motion";

export function WhyChooseUs() {
  const reasons = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Energy Efficient",
      desc: "Cut down electricity bills with our advanced low-consumption technology."
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Durable & Reliable",
      desc: "Built to last. High-quality materials backed by solid warranties."
    },
    {
      icon: <IndianRupee className="w-8 h-8" />,
      title: "Affordable Pricing",
      desc: "Premium quality doesn't have to break the bank. Best prices guaranteed."
    },
    {
      icon: <Paintbrush className="w-8 h-8" />,
      title: "Modern Designs",
      desc: "Sleek aesthetics that complement any contemporary home or office interior."
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Eco-Friendly",
      desc: "Reduce your carbon footprint with our sustainable solar and LED solutions."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Delivery",
      desc: "Quick and secure shipping across Surat and surrounding regions."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white">
            Why Choose <span className="text-secondary">EcoBright</span>
          </h2>
          <p className="text-white/80 text-lg">
            We don't just sell products; we provide complete energy solutions tailored for your space.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {reasons.map((reason, idx) => (
            <motion.div 
              key={idx}
              variants={item}
              className="bg-white/5 border border-white/10 backdrop-blur-sm p-8 rounded-3xl hover:bg-white/10 transition-colors duration-300"
            >
              <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-2xl flex items-center justify-center mb-6">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{reason.title}</h3>
              <p className="text-white/70 leading-relaxed">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
