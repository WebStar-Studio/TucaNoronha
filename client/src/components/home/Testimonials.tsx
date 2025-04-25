import { GlassCard } from '@/components/ui/GlassCard';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Testimonials() {
  const testimonials = [
    {
      content: "O Passeio à Baía dos Golfinhos foi o ponto alto da nossa viagem! Os guias eram experientes e apaixonados, garantindo uma experiência perfeita e respeitando a vida marinha.",
      name: "Sophia Garcia",
      date: "May 2023",
      avatar: "https://randomuser.me/api/portraits/women/54.jpg",
      initials: "SG",
      delay: "0.1s"
    },
    {
      content: "Ficar na Villa Serenity à beira-mar foi um sonho realizado. As vistas eram espetaculares e a equipe fez de tudo para garantir nosso conforto. Valeu cada centavo!",
      name: "James Wilson",
      date: "June 2023",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      initials: "JW",
      delay: "0.2s"
    },
    {
      content: "O passeio de catamarã ao pôr do sol superou nossas expectativas. A tripulação foi profissional, o catamarã impecável e a vista do pôr do sol com espumante foi simplesmente mágica.",
      name: "Emma Thompson",
      date: "July 2023",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      initials: "ET",
      delay: "0.3s"
    }
  ];

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-foreground">Experiências dos Hóspedes</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Veja o que nossos hóspedes dizem sobre suas jornadas inesquecíveis em Fernando de Noronha.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <GlassCard 
              key={index} 
              className="rounded-xl p-6 animate-slide-up" 
              style={{ animationDelay: testimonial.delay }}
            >
              <div className="flex items-center mb-4">
                <div className="text-accent flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.date}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
