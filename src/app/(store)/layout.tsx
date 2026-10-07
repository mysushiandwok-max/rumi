import { Header, type MegaMenuData } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { BackToTopButton } from "@/components/BackToTopButton";
import { getAllCategories } from "@/data/categories";
import { getBrandsByPopularity, brands } from "@/data/brands";
import { getFeaturedProducts, getProductsByCategory, getProductBySlug } from "@/data/products";
import { routines } from "@/data/routines";

const MEGA_MENU_BRAND_COUNT = 8;
const MEGA_MENU_PRODUCT_COUNT = 2;
const MEGA_MENU_ROUTINE_SLUGS = ["kit-bestseller", "glass-skin-pdrn", "clean-girl-piel-natural"];

// El menú se arma con los datos reales del catálogo (Header es cliente y no puede tocar la DB),
// así que esto vive en el layout —server component— y baja como props ya resuelto.
function buildMegaMenuData(): MegaMenuData {
  const categories = getAllCategories().map((category) => ({
    slug: category.slug,
    name: category.name,
    tagline: category.tagline,
    tone: category.tone,
    artVariant: category.artVariant,
    hasProducts: getProductsByCategory(category.slug).length > 0,
  }));

  const topBrands = getBrandsByPopularity().slice(0, MEGA_MENU_BRAND_COUNT);

  const featuredProducts = getFeaturedProducts()
    .slice(0, MEGA_MENU_PRODUCT_COUNT)
    .map((product) => ({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      tone: product.tone,
      artVariant: product.artVariant,
    }));

  const featuredRoutines = MEGA_MENU_ROUTINE_SLUGS.flatMap((slug) => {
    const routine = routines.find((r) => r.slug === slug);
    if (!routine) return [];
    const firstProduct = getProductBySlug(routine.steps[0]?.productSlug ?? "");
    return [
      {
        slug: routine.slug,
        name: routine.name,
        tagline: routine.tagline,
        tone: routine.tone,
        artVariant: firstProduct?.artVariant ?? "jar",
        image: firstProduct?.images[0],
      },
    ];
  });

  return { categories, topBrands, totalBrands: brands.length, featuredProducts, featuredRoutines };
}

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const megaMenu = buildMegaMenuData();

  return (
    <>
      <AnnouncementBar />
      <Header megaMenu={megaMenu} />
      <main>{children}</main>
      <Footer />
      <BackToTopButton />
    </>
  );
}
