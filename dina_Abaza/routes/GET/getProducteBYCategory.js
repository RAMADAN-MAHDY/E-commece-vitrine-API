import express from 'express';
import productsModel from '../../shema/Productes.js';
import CategoryModel from '../../shema/Category.js';
import rateLimit from 'express-rate-limit';


// إعداد limiter للبحث التنبؤي
const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 دقيقة
    max: 10, // بحد أقصى 10 ريكويستات لكل IP في الدقيقة
    message: 'طلبت البحث كتير جدًا، حاول تاني بعد شوية.'
  });


const router = express.Router();





// Route to get products by category ID
router.get('/product/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Fetch products by category ID
    const products = await productsModel.find({ categoryId });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'لا توجد منتجات في هذه الفئة' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الفئات' });
  }
});

// Route to get products by category slug
router.get('/productBySlug/:categoryslug', async (req, res) => {
  try {
    const { categoryslug } = req.params;

    // Fetch products by category ID
    const Category = await CategoryModel.find({ slug :categoryslug  });


     if (!Category || Category.length === 0) {
      return res.status(404).json({ message: 'الفئة غير موجودة' });
    }

    // console.log(Category);
        // هات المنتجات اللي بتنتمي للفئة دي
    const products = await productsModel.find({ categoryId: Category[0]._id });


    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'لا توجد منتجات في هذه الفئة' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الفئات' });
  }
});

// Route to get all products
router.get('/products', async (req, res) => {
  try {

    productsModel.collection.getIndexes()
  .then(indexes => console.log(indexes))
  .catch(err => console.error(err));

    // Fetch all products
    const products = await productsModel.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'لا توجد منتجات في هذه الفئة' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الفئات' });
  }
});


// Route to search products by name (يمكنك توسعته ليشمل حقول تانية)
router.get('/search/products', async (req, res) => {
    try {
      const { query } = req.query;
  
      if (!query || query.trim() === "") {
        return res.status(400).json({ message: 'برجاء إدخال كلمة للبحث' });
      }
  
      const products = await productsModel.find({
        $text: { $search: query }
      });
  
      if (!products || products.length === 0) {
        return res.status(404).json({ message: 'لا توجد نتائج مطابقة' });
      }
  
      res.status(200).json(products);
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ error: 'حدث خطأ أثناء البحث' });
    }
  });
  // Route to get autocomplete suggestions
  router.get('/search/suggestions', searchLimiter ,async (req, res) => {
    try {
      const { query } = req.query;
  
      if (!query || query.trim().length < 2) {
        return res.status(400).json({ message: 'اكتب على الأقل حرفين للبحث' });
      }
  
      const results = await productsModel.aggregate([
        {
          $search: {
            index: "default",
            autocomplete: {
              query: query,
              path: "name"
            }
          }
        },
        { $limit: 5 },
        { $project: { name: 1, image: 1 } }
      ]);
  
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      res.status(500).json({ error: 'حدث خطأ أثناء جلب الاقتراحات' });
    }
  });
  
  // Route to get product details by ID
  router.get('/product/details/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
  
      const product = await productsModel.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'المنتج غير موجود' });
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: 'حدث خطأ أثناء جلب تفاصيل المنتج' });
    }
  });
  


export default router;




// import express from 'express';
// import productsModel from '../../shema/Productes.js';
// import CategoryModel from '../../shema/Category.js';

// const router = express.Router();

// // Route to get products by category ID
// router.get('/product/:categoryslug', async (req, res) => {
//   try {
//     const { categoryslug } = req.params;

//     // Fetch products by category ID
//     const Category = await CategoryModel.find({ slug :categoryslug  });


//      if (!Category || Category.length === 0) {
//       return res.status(404).json({ message: 'الفئة غير موجودة' });
//     }

//     console.log(Category);
//         // هات المنتجات اللي بتنتمي للفئة دي
//     const products = await productsModel.find({ categoryId: Category[0]._id });


//     if (!products || products.length === 0) {
//       return res.status(404).json({ message: 'لا توجد منتجات في هذه الفئة' });
//     }

//     res.status(200).json(products);
//   } catch (error) {
//     console.error('Error fetching products by category:', error);
//     res.status(500).json({ error: 'حدث خطأ أثناء جلب الفئات' });
//   }
// });

// // Route to get all products
// router.get('/products', async (req, res) => {
//   try {
//     // Fetch all products
//     const products = await productsModel.find();

//     if (!products || products.length === 0) {
//       return res.status(404).json({ message: 'لا توجد منتجات في هذه الفئة' });
//     }

//     res.status(200).json(products);
//   } catch (error) {
//     console.error('Error fetching all products:', error);
//     res.status(500).json({ error: 'حدث خطأ أثناء جلب الفئات' });
//   }
// });

// export default router;
