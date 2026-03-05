import Image from 'next/image';

const brands = [
  { name: 'Pentair', logo: '/brands/pentair.jpg' },
  { name: 'Franklin Electric', logo: '/brands/franklin.png' },
  { name: 'Katalox', logo: '/brands/katalox.jpg' },
  { name: 'LEO', logo: '/brands/leo.jpg' },
  { name: 'Sunresin', logo: '/brands/sunresin.png' },
  { name: 'Vontron', logo: '/brands/Vontron.png' },
  { name: 'American Water Heaters', logo: '/brands/americanwaterheaters.png' },
  { name: 'APEC Pump', logo: '/brands/apecpump.png' },
  { name: 'Rheem', logo: '/brands/rheem.svg' },
  { name: 'Sta-Rite', logo: '/brands/Sta-Rite.jpg' },
];

export default function Brands() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
          Marcas que Representamos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-32"
            >
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={140}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <span className="text-sm text-gray-600 text-center font-medium">{brand.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
