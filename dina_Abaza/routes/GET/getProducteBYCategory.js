import express from 'express';
import productsModel from '../../shema/Productes.js';
import CategoryModel from '../../shema/Category.js';
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

    console.log(Category);
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




// Route to get all products
router.get('/products', async (req, res) => {
  try {
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
