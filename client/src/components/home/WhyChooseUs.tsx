import { GlassCard } from '@/components/ui/GlassCard';
import { MapPin, Leaf, Globe, Shield } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: <MapPin className="text-xl" />,
      title: "Local Expertise",
      description: "Our guides are born and raised in Fernando de Noronha, offering authentic insights and hidden gems.",
      color: "bg-primary/10 text-primary",
      delay: "0.1s"
    },
    {
      icon: <Leaf className="text-xl" />,
      title: "Eco-Conscious",
      description: "All our experiences are designed with sustainability and environmental protection in mind.",
      color: "bg-secondary/10 text-secondary",
      delay: "0.2s"
    },
    {
      icon: <Globe className="text-xl" />,
      title: "Premium Service",
      description: "Enjoy personalized attention and luxurious details that make your experience unforgettable.",
      color: "bg-accent/10 text-accent",
      delay: "0.3s"
    },
    {
      icon: <Shield className="text-xl" />,
      title: "Secure Booking",
      description: "Our platform ensures your personal information is protected with advanced security measures.",
      color: "bg-primary/10 text-primary",
      delay: "0.4s"
    }
  ];

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-foreground">Why Choose Tuca Noronha</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Experience Fernando de Noronha like never before with our premium services and exclusive benefits.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <GlassCard 
              key={index} 
              className="p-6 rounded-xl animate-slide-up" 
              style={{animationDelay: feature.delay}}
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-montserrat font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
