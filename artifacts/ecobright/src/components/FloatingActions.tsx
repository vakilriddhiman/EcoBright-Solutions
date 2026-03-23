import { MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingActions() {
  return (
    <>
      {/* WhatsApp Floating Button */}
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        href="https://wa.me/919601067777"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:scale-110 transition-transform duration-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
      </motion.a>

      {/* Mobile Sticky Bottom Call Button */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-white border-t p-3 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <a 
          href="tel:+919601067777"
          className="flex w-full h-12 items-center justify-center gap-2 bg-primary text-white rounded-xl font-bold shadow-lg"
        >
          <Phone className="w-5 h-5 fill-current" />
          Call Now
        </a>
      </div>
    </>
  );
}
