import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import ProjectsSection from '@/components/ProjectsSection';
import Newsletter from '@/components/Newsletter';
import Brands from '@/components/Brands';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <CategorySection />
      <FeaturedProducts />
      <ProjectsSection />
      <Newsletter />
      <Brands />
      <Contact />
    </>
  );
}
