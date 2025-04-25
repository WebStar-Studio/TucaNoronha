import Hero from "@/components/home/Hero";
import Experiences from "@/components/home/Experiences";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Accommodations from "@/components/home/Accommodations";
import Testimonials from "@/components/home/Testimonials";
import Packages from "@/components/home/Packages";
import InstagramFeed from "@/components/home/InstagramFeed";
import Cta from "@/components/home/Cta";

export default function Home() {
  // Os hooks React Query já carregam automaticamente os dados ao renderizar os componentes

  return (
    <main>
      <Hero />
      <Experiences />
      <WhyChooseUs />
      <Accommodations />
      <Testimonials />
      <Packages />
      <InstagramFeed />
      <Cta />
    </main>
  );
}
