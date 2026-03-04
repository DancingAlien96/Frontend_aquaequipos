import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CategorySection from '@/components/CategorySection';
import Newsletter from '@/components/Newsletter';
import Brands from '@/components/Brands';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <CategorySection />
      <Hero />
      <Features />
      <Newsletter />
      <Brands />
      <Contact />
    </>
  );
}
