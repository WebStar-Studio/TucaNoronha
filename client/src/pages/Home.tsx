import Hero from "@/components/home/Hero";
import Experiences from "@/components/home/Experiences";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Accommodations from "@/components/home/Accommodations";
import Testimonials from "@/components/home/Testimonials";
import Packages from "@/components/home/Packages";
import InstagramFeed from "@/components/home/InstagramFeed";
import Cta from "@/components/home/Cta";
import { useEffect } from "react";
import { useExperiencesStore } from "@/store/experiencesStore";
import { useAccommodationsStore } from "@/store/accommodationsStore";
import { usePackagesStore } from "@/store/packagesStore";

export default function Home() {
  const { loadFeaturedExperiences } = useExperiencesStore();
  const { loadFeaturedAccommodations } = useAccommodationsStore();
  const { loadFeaturedPackages } = usePackagesStore();

  useEffect(() => {
    loadFeaturedExperiences();
    loadFeaturedAccommodations();
    loadFeaturedPackages();
  }, [loadFeaturedExperiences, loadFeaturedAccommodations, loadFeaturedPackages]);

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
