import Image from 'next/image';
import Link from 'next/link';

// Navigation component
function BreadcrumbNav({ productName }) {
  return (
    <div className="flex items-center gap-2 text-sm mb-6">
      <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
      <span className="text-gray-500">/</span>
      <span className="text-gray-700">{productName}</span>
    </div>
  );
}

async function getProduct(slug) {
  try {
    const [productDetailsRes, productImageRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/products?filters[documentId][$eq]=${slug}&populate[adonConfig][populate]=*`, {
        cache: 'no-store'
      }),
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/products?filters[documentId][$eq]=${slug}&populate=image`, {
        cache: 'no-store'
      })
    ]);

    if (!productDetailsRes.ok || !productImageRes.ok) 
      throw new Error('Failed to fetch product');

    const [detailsData, imageData] = await Promise.all([
      productDetailsRes.json(),
      productImageRes.json()
    ]);

    // Merge the image data with the product details
    const productDetails = detailsData.data[0];
    const productImage = imageData.data[0]?.image;

    return {
      ...productDetails,
      image: productImage
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

async function getAddons() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/addons?populate[addonOptions]=*`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch addons');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching addons:', error);
    throw error;
  }
}

export default async function ProductPage({ params }) {
  const [productData, addonsData] = await Promise.all([
    getProduct(params.slug),
    getAddons()
  ]);

  const product = productData;
  const addons = addonsData.data;

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  // Create addons map using documentId
  const addonMap = {};
  addons.forEach(addon => {
    addonMap[addon.documentId] = {
      ...addon,
      options: addon.addonOptions || []
    };
  });

  // Process product addons using documentId matching
  const productAddons = [];
  if (product.adonConfig && Array.isArray(product.adonConfig)) {
    product.adonConfig.forEach(config => {
      if (config.addon_group && config.addon_group.documentId) {
        const matchedAddon = addonMap[config.addon_group.documentId];
        if (matchedAddon) {
          productAddons.push({
            ...matchedAddon,
            required: config.required || false,
            selectionType: config.selectionType || 'single'
          });
        }
      }
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav productName={product.itemName} />
      
      <div className="bg-white rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Product Image */}
          <div className="md:w-1/2">
            <div className="sticky top-24">
              <h1 className="text-3xl font-bold mb-4">{product.itemName}</h1>
              {product.image && (
                <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-6">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL.replace('/api', '')}${product.image.url}`}
                    alt={product.itemName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Right side - Addons */}
          <div className="md:w-1/2">
            {/* Addons Sections */}
            {productAddons.map((addon) => (
              <div key={addon.documentId} className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{addon.name}</h3>
                  {addon.required && (
                    <span className="text-red-500 text-sm">Required</span>
                  )}
                </div>
                <div className="space-y-3">
                  {addon.options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input
                          type={addon.selectionType === 'multiple' ? 'checkbox' : 'radio'}
                          id={`option-${option.id}`}
                          name={`addon-${addon.documentId}`}
                          className="w-4 h-4 accent-yellow-400"
                          required={addon.required}
                        />
                        <label htmlFor={`option-${option.id}`} className="font-medium">
                          {option.title}
                        </label>
                      </div>
                      {option.price !== null && (
                        <span className="text-gray-600">
                          Rs. {option.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add to Cart Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 md:relative md:p-0">
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
