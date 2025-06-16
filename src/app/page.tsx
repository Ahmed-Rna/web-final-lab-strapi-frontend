import Image from "next/image";
import Link from "next/link";
import Hero from "../../Sections/Hero";
import SliderWrapper from "../../Components/SliderWrapper";
import { Metadata } from 'next';


const CACHE_DURATION = 3600;

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/categories?populate=*`, {
      next: { revalidate: CACHE_DURATION },
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/products?populate=*`, {
      next: { revalidate: CACHE_DURATION },
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Generate metadata for the page
export async function generateMetadata(): Promise<Metadata> {
  try {
    const productsData = await getProducts();
    const firstProduct = productsData.data[0];

    return {
      title: firstProduct?.metaData?.metaTitle || 'Food Delivery App',
      description: firstProduct?.metaData?.metaDescription || 'Find the best food in town',
      openGraph: {
        title: firstProduct?.metaData?.metaTitle || 'Food Delivery App',
        description: firstProduct?.metaData?.metaDescription || 'Find the best food in town',
        images: firstProduct?.image?.url
          ? [`${process.env.NEXT_PUBLIC_STRAPI_URL}${firstProduct.image.url}`]
          : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Food Delivery App',
      description: 'Find the best food in town',
    };
  }
}

// Generate static paths
export async function generateStaticParams() {
  try {
    const categoriesData = await getCategories();
    return categoriesData.data.map((category) => ({
      category: category.Name.toLowerCase(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Enable Incremental Static Regeneration at the page level
export const revalidate = CACHE_DURATION;

export default async function Home() {
  try {
    const [categoriesData, productsData] = await Promise.all([
      getCategories(),
      getProducts()
    ]);

    const productsByCategory = productsData.data.reduce((acc, product) => {
      if (product.category?.id) {
        if (!acc[product.category.id]) {
          acc[product.category.id] = [];
        }
        acc[product.category.id].push(product);
      }
      return acc;
    }, {});

    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
        <Hero />
        <SliderWrapper categories={categoriesData.data} />

        <main className="flex-1">
          <div id="main" className="md:mx-30">
            <div className="mt-10">
              {categoriesData.data?.map((category) => (
                <div key={category.id} id={`category-${category.id}`} className="mb-16 scroll-mt-24">
                  <div className="hidden">
                    <meta name="description" content={`Browse our ${category.Name} selection`} />
                    <meta property="og:title" content={`${category.Name} - Food Delivery`} />
                    <meta property="og:description" content={`Browse our ${category.Name} selection`} />
                  </div>

                  <h2 className="text-3xl font-bold mb-6 text-gray-800">{category.Name}</h2>

                  {category.image && (
                    <div className="shadow relative mb-8">
                      <Image
                        className="object-cover rounded-lg"
                        src={`${process.env.NEXT_PUBLIC_STRAPI_URL.replace('/api', '')}${category.image.url}`}
                        alt={category.Name || "Category Image"}
                        width={2000}
                        height={2000}
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        priority={category.image.id <= 50}
                        fetchPriority={category.image.id <= 50 ? "high" : "auto"}
                        loading={category.image.id <= 50 ? "eager" : "lazy"}
                        quality={85}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {productsByCategory[category.id]?.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.documentId}`}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-3"
                      >
                        <div className="flex gap-6">
                          <div className="relative w-40 h-40 flex-shrink-0">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_STRAPI_URL.replace('/api', '')}${product.image.url}`}
                              alt={product.itemName || "Product Image"}
                              fill
                              className="object-contain"
                              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                              priority={category.image.id <= 50}
                              fetchPriority={category.image.id <= 50 ? "high" : "auto"}
                              loading={category.image.id <= 50 ? "eager" : "lazy"}
                              quality={75}
                            />
                            {product.baseInfo.displayTag && (
                              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 text-sm whitespace-nowrap rounded">
                                {product.baseInfo.displayTag}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-base font-extrabold whitespace-nowrap overflow-hidden text-black mb-2">
                                {product.itemName}
                              </h3>
                              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                {product.baseInfo.description}
                              </p>
                            </div>

                            <div className="flex flex-col gap-2">
                              <span className="text-xs w-1/2 font-bold bg-red-500 text-white px-2 py-1 rounded whitespace-nowrap">
                                Rs {product.baseInfo.price.toFixed(2)}
                              </span>
                              <div className="flex justify-between items-center gap-2">
                                <span className="flex-1 bg-yellow-400 text-sm font-extrabold hover:bg-yellow-500 text-black py-1.5 px-1 rounded-lg transition-colors whitespace-nowrap text-center">
                                  Add To Cart
                                </span>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error in Home component:', error);
    throw error;
  }
}
