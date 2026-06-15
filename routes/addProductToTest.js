import mongoose from 'mongoose';
import Category from '../shema/Category.js'; // تأكد من المسار الصحيح
import Product from '../shema/Productes.js'; // تأكد من المسار الصحيح
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// بيانات الفئات
const categories = [
  {
    name: 'الإضاءة',
    slug: 'lighting',
    description: 'جميع أنواع الإضاءة والمصابيح والنجف',
    image: 'https://vitrine-furniture.com/cdn/shop/files/modern-chandelier-with-three-white-metal-cages-hanging-at-different-heights-lighting-vitrine-furniture-780710_400x.jpg?v=1749043226'
  },
  {
    name: 'المنتجات الخارجية',
    slug: 'outdoor',
    description: 'أثاث الحدائق والبلكونات والمساحات الخارجية',
    image: 'https://vitrine-furniture.com/cdn/shop/files/beige-hanging-swing-chair-outdoor-products-vitrine-furniture-715739_400x.jpg?v=1749043827'
  },
  {
    name: 'غرفة الطعام',
    slug: 'dining',
    description: 'طاولات وكراسي غرف الطعام وإكسسواراتها',
    image: 'https://vitrine-furniture.com/cdn/shop/files/a-modern-and-simple-dining-table-design-furniture-vitrine-furniture-891445_400x.jpg?v=1749044068'
  },
  {
    name: 'ركنة حرف L',
    slug: 'sofa-l',
    description: 'ركنات على شكل حرف L لتوفير المساحة',
    image: 'https://vitrine-furniture.com/cdn/shop/files/off-white-corner-with-a-chaise-longue-furniture-vitrine-furniture-648521_400x.jpg?v=1749044255'
  },
  {
    name: 'غرفة المعيشة',
    slug: 'living-room',
    description: 'أثاث غرف المعيشة والصالونات',
    image: 'https://vitrine-furniture.com/cdn/shop/files/grey-corner-sofa-wooden-shelves-movable-headrest-l-shape-sofa-set-vitrine-furniture-545982_400x.jpg?v=1749044317'
  },
  {
    name: 'غرف النوم',
    slug: 'bedroom',
    description: 'أثاث غرف النوم للكبار والأطفال',
    image: 'https://vitrine-furniture.com/cdn/shop/files/black-back-cafe-bedroom-elegance-bed-sets-vitrine-furniture-944261_400x.jpg?v=1749044526'
  },
  {
    name: 'قطع أثاث منفصلة',
    slug: 'single-pieces',
    description: 'قطع أثاث فردية متنوعة للديكور والاستخدام',
    image: 'https://vitrine-furniture.com/cdn/shop/files/100-white-wardrobe-with-two-doors-furniture-vitrine-furniture-498290_400x.jpg?v=1749043269'
  },
  {
    name: 'إفرش بيتك كامل',
    slug: 'full-house',
    description: 'باقات أثاث كاملة لتأثيث المنزل',
    image: 'https://vitrine-furniture.com/cdn/shop/files/wooden-beige-bedroom-grey-bed-sets-vitrine-furniture-232159_400x.jpg?v=1749044524'
  }
];

// بيانات المنتجات مع تحديد الفئة لكل منتج
const productsData = [
  {
    name: "ركنه حرف L",
    price: 13500,
    description: "ركنه حرف L مميزه للاماكن الضيقه",
    offer: { isActive: true, discountPercent: 15, discountedPrice: 11475 },
    category: "sofa-l",
    image: "https://vitrine-furniture.com/cdn/shop/files/off-white-corner-with-a-chaise-longue-furniture-vitrine-furniture-648521_400x.jpg?v=1749044255"
  },
  {
    name: "دولاب ملابس كبير",
    price: 4500,
    description: "دولاب واسع مع عدة رفوف لتعزيز التخزين.",
    offer: { isActive: true, discountPercent: 10, discountedPrice: 4050 },
    category: "single-pieces",
    image: "https://vitrine-furniture.com/cdn/shop/files/100-white-wardrobe-with-two-doors-furniture-vitrine-furniture-498290_400x.jpg?v=1749043269"
  },
  {
    name: "غرفة سفره",
    price: 10300,
    description: "سفره مودرن مميزه بالوان عصريه",
    offer: { isActive: true, discountPercent: 20, discountedPrice: 8240 },
    category: "dining",
    image: "https://vitrine-furniture.com/cdn/shop/files/a-modern-and-simple-dining-table-design-furniture-vitrine-furniture-891445_400x.jpg?v=1749044068"
  },
  {
    name: "كومودينو جانبي",
    price: 950,
    description: "طاولة جانبية صغيرة لغرفة النوم.",
    offer: { isActive: true, discountPercent: 25, discountedPrice: 713 },
    category: "single-pieces",
    image: "https://vitrine-furniture.com/cdn/shop/files/beige-wooden-side-table-and-cat-house-decor-vitrine-furniture-805203_400x.jpg?v=1749043140"
  },
  {
    name: "مرآة حائط ديكور",
    price: 700,
    description: "مرآة حائط بتصميم عصري تناسب أي غرفة.",
    offer: { isActive: true, discountPercent: 15, discountedPrice: 595 },
    category: "single-pieces",
    image: "https://vitrine-furniture.com/cdn/shop/files/led-mirror-elegant-zigzag-frame-for-modern-spaces-mirrors-vitrine-furniture-918856_400x.jpg?v=1749044259"
  },
  {
    name: "غرفة نوم كلاسيك",
    price: 20000,
    description: "غرفة نوم كلاسيك كبيرة الحجم للقصور والفلل",
    offer: { isActive: true, discountPercent: 10, discountedPrice: 18000 },
    category: "bedroom",
    image: "https://vitrine-furniture.com/cdn/shop/files/black-back-cafe-bedroom-elegance-bed-sets-vitrine-furniture-944261_400x.jpg?v=1749044526"
  },
  {
    name: "غرفة نوم",
    price: 221500,
    description: "غرفة نوم انيقه بالوان عصريه كلاسيكيه",
    offer: { isActive: true, discountPercent: 20, discountedPrice: 177200 },
    category: "bedroom",
    image: "https://vitrine-furniture.com/cdn/shop/files/wooden-beige-bedroom-grey-bed-sets-vitrine-furniture-232159_400x.jpg?v=1749044524"
  },
  {
    name: "غرفة نوم اطفال",
    price: 11800,
    description: "غرفة نوم اطفال مودرن ",
    offer: { isActive: true, discountPercent: 15, discountedPrice: 10030 },
    category: "bedroom",
    image: "https://vitrine-furniture.com/cdn/shop/files/a-complete-youth-room-beige-with-a-library-of-books-bed-sets-vitrine-furniture-108062_400x.jpg?v=1749044322"
  },
  {
    name: "غرفة سفره خشب زان",
    price: 10000,
    description: "سفره مميزه خشب بني كلاسيك",
    offer: { isActive: true, discountPercent: 25, discountedPrice: 7500 },
    category: "dining",
    image: "https://vitrine-furniture.com/cdn/shop/files/rectangular-dining-table-furniture-vitrine-furniture-711392_400x.jpg?v=1749043398"
  },
  {
    name: "غرفة سفره مودرن ",
    price: 7000,
    description: "غرفه سفره صغيره مودرن للاماكن الصغيره",
    offer: { isActive: true, discountPercent: 10, discountedPrice: 6300 },
    category: "dining",
    image: "https://vitrine-furniture.com/cdn/shop/files/dining-table-blackgrey-furniture-vitrine-furniture-893024_400x.jpg?v=1749044068"
  },
  {
    name: "ركنة رمادي كلاسيك",
    price: 8000,
    description: "ركنة مريحة مصممة بألوان هادئة.",
    offer: { isActive: true, discountPercent: 15, discountedPrice: 6800 },
    category: "living-room",
    image: "https://vitrine-furniture.com/cdn/shop/files/grey-corner-sofa-wooden-shelves-movable-headrest-l-shape-sofa-set-vitrine-furniture-545982_400x.jpg?v=1749044317"
  },
  {
    name: "ركنة على شكل L",
    price: 5800,
    description: "ركنة مودرن بتصميم زاوية L لتوفير المساحة.",
    offer: { isActive: true, discountPercent: 20, discountedPrice: 4640 },
    category: "sofa-l",
    image: "https://vitrine-furniture.com/cdn/shop/files/beige-bed-cozy-comfort-sizzling-style-l-shape-sofa-set-vitrine-furniture-265409_400x.jpg?v=1749044319"
  },
  {
    name: "ركنة صغيرة للأماكن الضيقة",
    price: 5000,
    description: "ركنة مناسبة للشقق الصغيرة بتصميم أنيق.",
    offer: { isActive: true, discountPercent: 25, discountedPrice: 3750 },
    category: "living-room",
    image: "https://vitrine-furniture.com/cdn/shop/files/off-white-sofa-elegant-and-versatile-comfort-furniture-vitrine-furniture-852697_400x.jpg?v=1749044254"
  },
  {
    name: "نجفة سقف كلاسيكية",
    price: 950,
    description: "نجفة سقف بزخارف كلاسيكية تناسب غرفة الجلوس.",
    offer: { isActive: true, discountPercent: 10, discountedPrice: 855 },
    category: "lighting",
    image: "https://vitrine-furniture.com/cdn/shop/files/modern-chandelier-with-three-white-metal-cages-hanging-at-different-heights-lighting-vitrine-furniture-780710_400x.jpg?v=1749043226"
  },
  {
    name: "أباجورة طاولة مودرن",
    price: 550,
    description: "أباجورة طاولة بتصميم عصري ومريح للعين.",
    offer: { isActive: true, discountPercent: 15, discountedPrice: 468 },
    category: "lighting",
    image: "https://vitrine-furniture.com/cdn/shop/files/modern-white-ball-lampshade-lighting-vitrine-furniture-958211_400x.jpg?v=1749043409"
  },
  {
    name: "مصباح أرضي",
    price: 6000,
    description: "مصباح أرضي بإضاءة ناعمة تناسب غرف النوم.",
    offer: { isActive: true, discountPercent: 20, discountedPrice: 4800 },
    category: "lighting",
    image: "https://vitrine-furniture.com/cdn/shop/files/lighting-lampshade-golden-lighting-vitrine-furniture-668700_400x.jpg?v=1749043407"
  },
  {
    name: "نجفه مضيئه",
    price: 3500,
    description: "نجفه مودرن باضاءات الوان ",
    offer: { isActive: true, discountPercent: 25, discountedPrice: 2625 },
    category: "lighting",
    image: "https://vitrine-furniture.com/cdn/shop/files/white-macrame-pendant-light-lighting-vitrine-furniture-667102_400x.jpg?v=1750050269"
  },
  {
    name: "ركنه مودرن",
    price: 7550,
    description: "ركنه مميزه بالوان عصريه",
    offer: { isActive: true, discountPercent: 15, discountedPrice: 6418 },
    category: "living-room",
    image: "https://vitrine-furniture.com/cdn/shop/files/l-shaped-sectional-modern-comfort-style-l-shape-sofa-set-vitrine-furniture-118828_400x.jpg?v=1749044518"
  },
  {
    name: "لوحة فنية زيتية",
    price: 1200,
    description: "لوحة فنية مرسومة بالزيت لإضافة لمسة فنية.",
    offer: { isActive: true, discountPercent: 10, discountedPrice: 1080 },
    category: "single-pieces",
    image: "https://vitrine-furniture.com/cdn/shop/files/tableau-for-a-group-of-sailboats-decor-vitrine-furniture-362119_400x.jpg?v=1749043583"
  },
  {
    name: "اباجوره مودرن",
    price: 1400,
    description: "اباجوره اضاءات مختلفه",
    offer: { isActive: true, discountPercent: 20, discountedPrice: 1120 },
    category: "lighting",
    image: "https://vitrine-furniture.com/cdn/shop/files/modern-lamp-lighting-vitrine-furniture-758316_400x.jpg?v=1749043411"
  },
  {
    name: "كونسول مودرن ",
    price: 4000,
    description: "كونسول لمدخل المنزل للديكور دهبي",
    offer: { isActive: true, discountPercent: 25, discountedPrice: 3000 },
    category: "single-pieces",
    image: "https://vitrine-furniture.com/cdn/shop/files/gold-side-table-furniture-vitrine-furniture-302134_400x.jpg?v=1749044120"
  },
  {
    name: "كرسي ارجوحه",
    price: 1800,
    description: "كرسي خشب حركي للحديقه او البلكونه",
    offer: { isActive: true, discountPercent: 15, discountedPrice: 1530 },
    category: "outdoor",
    image: "https://vitrine-furniture.com/cdn/shop/files/beige-hanging-swing-chair-outdoor-products-vitrine-furniture-715739_400x.jpg?v=1749043827"
  },
  {
    name: "انتريه جلد",
    price: 3200,
    description: "كرسي جلدي مريح وبتصميم كلاسيكي.",
    offer: { isActive: true, discountPercent: 10, discountedPrice: 2880 },
    category: "outdoor",
    image: "https://vitrine-furniture.com/cdn/shop/files/double-sofa-hammock-with-sunshade-umbrella-outdoor-products-vitrine-furniture-732684_5000x.jpg?v=1749043825"
  },
  {
    name: "غرفة نوم اطفال مودرن",
    price: 15000,
    description: "غرفة نوم اطفال ومعها مكتب هديه",
    offer: { isActive: true, discountPercent: 20, discountedPrice: 12000 },
    category: "bedroom",
    image: "https://vitrine-furniture.com/cdn/shop/files/a-complete-youth-bedroom-in-brown-color-with-2-nightstands-bed-sets-vitrine-furniture-629087_400x.jpg?v=1749044322"
  },
  {
    name: "غرفة نوم مودرن",
    price: 11000,
    description: "غرفه مودرن خشب زان ",
    offer: { isActive: true, discountPercent: 25, discountedPrice: 8250 },
    category: "bedroom",
    image: "https://vitrine-furniture.com/cdn/shop/files/youth-bedroom-with-plush-upholstery-bed-sets-vitrine-furniture-373794_400x.jpg?v=1749044326"
  },
  {
    name: "مصباح حائط عصري",
    price: 1700,
    description: "مصباح حائط عصري فريد ",
    offer: { isActive: true, discountPercent: 15, discountedPrice: 1445 },
    category: "lighting",
    image: "https://vitrine-furniture.com/cdn/shop/files/a-modern-wall-lamp-with-two-distinct-parts-lighting-vitrine-furniture-492180_400x.jpg?v=1749042683"
  },
  {
    name: "لوحات للديكور",
    price: 2500,
    description: "مجموعه مميزه من التابلوهات لغرف المعيشه",
    offer: { isActive: true, discountPercent: 10, discountedPrice: 2250 },
    category: "single-pieces",
    image: "https://vitrine-furniture.com/cdn/shop/files/flamingo-bird-painting-decor-vitrine-furniture-510268_400x.jpg?v=1749043517"
  },
  {
    name: "مصباح طاولة صغير",
    price: 500,
    description: "مصباح طاولة أنيق للقراءة والإضاءة الخافتة.",
    offer: { isActive: true, discountPercent: 20, discountedPrice: 400 },
    category: "lighting",
    image: "https://vitrine-furniture.com/cdn/shop/files/lampshade-with-cylindrical-glass-cover-table-lamps-vitrine-furniture-433954_400x.jpg?v=1749044262"
  },
  {
    name: "طاوله تليفزيون مودرن",
    price: 4900,
    description: "طاوله عمليه بارفف مميزه",
    offer: { isActive: true, discountPercent: 25, discountedPrice: 3675 },
    category: "living-room",
    image: "https://vitrine-furniture.com/cdn/shop/files/set-of-tv-table-with-hollow-sides-and-coffee-table-tv-table-cabinet-vitrine-furniture-533654_400x.jpg?v=1749044317"
  },
  {
    name: "طاولة تلفزيون خشب",
    price: 2800,
    description: "طاولة تلفزيون عملية بتصميم عصري.",
    offer: { isActive: true, discountPercent: 15, discountedPrice: 2380 },
    category: "living-room",
    image: "https://vitrine-furniture.com/cdn/shop/files/tv-unit-sleek-design-with-ample-storage-furniture-vitrine-furniture-317600_400x.jpg?v=1749043940"
  }
];

// دالة لإنشاء الاتصال بقاعدة البيانات
// async function connectToDatabase() {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/furniture_store', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
//   } catch (error) {
//     console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error);
//     process.exit(1);
//   }
// }

// دالة لحذف البيانات الموجودة
// async function clearDatabase() {
//   try {
//     await Product.deleteMany({});
//     await Category.deleteMany({});
//     console.log('🗑️ تم حذف جميع البيانات الموجودة');
//   } catch (error) {
//     console.error('❌ خطأ في حذف البيانات:', error);
//   }
// }

// دالة لإضافة الفئات
async function seedCategories() {
  try {
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ تم إضافة ${insertedCategories.length} فئة بنجاح`);
    return insertedCategories;
  } catch (error) {
    console.error('❌ خطأ في إضافة الفئات:', error);
    throw error;
  }
}

// دالة لإضافة المنتجات
async function seedProducts(categoriesMap) {
  try {
    const products = productsData.map(product => ({
      name: product.name,
      price: product.price,
      offer: product.offer,
      image: product.image,
      categoryId: categoriesMap[product.category]
    }));

    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ تم إضافة ${insertedProducts.length} منتج بنجاح`);
    return insertedProducts;
  } catch (error) {
    console.error('❌ خطأ في إضافة المنتجات:', error);
    throw error;
  }
}

// الدالة الرئيسية لتشغيل عملية البذر
export async function seedDatabase() {
//   await connectToDatabase();

  try {
    // حذف البيانات الموجودة
    // await clearDatabase();

    // إضافة الفئات
    const insertedCategories = await seedCategories();

    // إنشاء خريطة للفئات لربطها بالمنتجات
    const categoriesMap = {};
    insertedCategories.forEach(category => {
      categoriesMap[category.slug] = category._id;
    });

    // إضافة المنتجات
    await seedProducts(categoriesMap);

    console.log('🎉 تم إكمال عملية إضافة البيانات بنجاح!');
    
    // طباعة إحصائيات
    const categoriesCount = await Category.countDocuments();
    const productsCount = await Product.countDocuments();
    
    console.log('\n📊 إحصائيات قاعدة البيانات:');
    console.log(`- عدد الفئات: ${categoriesCount}`);
    console.log(`- عدد المنتجات: ${productsCount}`);

  } catch (error) {
    console.error('❌ خطأ في عملية إضافة البيانات:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 تم إغلاق اتصال قاعدة البيانات');
  }
}

// تشغيل عملية البذر