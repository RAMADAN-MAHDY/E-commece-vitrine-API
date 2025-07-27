import express from 'express';
import productsModel from '../shema/Productes.js';
import upload from '../middleware/multerSetup.js';
import uploadToImgBB from '../utils/uploadToImgBB.js';
import middleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js';
import CategoryModel from '../shema/Category.js';
import rateLimit from 'express-rate-limit';

// إعداد limiter للبحث التنبؤي
const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 دقيقة
    max: 10, // بحد أقصى 10 ريكويستات لكل IP في الدقيقة
    message: 'طلبت البحث كتير جدًا، حاول تاني بعد شوية.'
});

const router = express.Router();

router.post('/addproduct', middleware, adminMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, price, discountedPrice, categoryId } = req.body;

        // تحقق من الحقول الأساسية
        if (!name || !price || !categoryId) {
            return res.status(400).json({ msg: 'الاسم، السعر، والتصنيف مطلوبين' });
        }

        // تحقق إن السعر أرقام
        const priceNum = parseFloat(price);
        const discountedPriceNum = parseFloat(discountedPrice);

        if (isNaN(priceNum) || priceNum <= 0) {
            return res.status(400).json({ msg: 'السعر غير صالح' });
        }

        // تحقق إن الـ Category موجود
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ msg: 'التصنيف غير موجود' });
        }

        // رفع الصورة
        if (!req.file) {
            return res.status(400).json({ msg: 'الصورة مطلوبة' });
        }

        const { url: imageUrl, deleteUrl } = await uploadToImgBB(req.file.buffer);


        // منطق الخصم
        let isActive = false;
        let finalDiscountedPrice = priceNum;
        let discountPercent = 0;

        if (discountedPriceNum && discountedPriceNum < priceNum) {
            isActive = true;
            finalDiscountedPrice = discountedPriceNum;
            discountPercent = ((priceNum - discountedPriceNum) / priceNum) * 100;
        }

        // إنشاء المنتج
        const newProduct = await productsModel.create({
            name,
            price: priceNum,
            image: imageUrl,
            imageDeleteUrl: deleteUrl,
            categoryId,
            offer: {
                isActive,
                discountPercent,
                discountedPrice: finalDiscountedPrice
            }
        });

        res.status(201).json({
            msg: 'تم إضافة المنتج بنجاح',
            product: {
                _id: newProduct._id,
                name: newProduct.name,
                price: newProduct.price,
                image: newProduct.image,
                categoryId: newProduct.categoryId,
                offer: newProduct.offer
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'حصل خطأ أثناء إضافة المنتج', error: err.message });
    }
});

// حذف منتج
router.delete('/deleteproduct/:id', middleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productsModel.findById(id);
        if (!product) {
            return res.status(404).json({ msg: 'المنتج غير موجود' });
        }

        // حذف الصورة من ImgBB لو فيه رابط حذف
        if (product.imageDeleteUrl) {
            await deleteFromImgBB(product.imageDeleteUrl);
        }

        await productsModel.findByIdAndDelete(id);

        res.status(200).json({ msg: 'تم حذف المنتج بنجاح' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'حصل خطأ أثناء حذف المنتج',
            error: err.message,
        });
    }
});

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
        const Category = await CategoryModel.find({ slug: categoryslug });


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
router.get('/search/suggestions', searchLimiter, async (req, res) => {
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

// Route to edit a product
router.patch('/editproduct/:id', middleware, adminMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, discountedPrice, categoryId } = req.body;

        const product = await productsModel.findById(id);
        if (!product) return res.status(404).json({ msg: 'المنتج غير موجود' });

        // تحديث الاسم
        if ('name' in req.body) {
            product.name = name;
        }

        // تحديث التصنيف
        if ('categoryId' in req.body) {
            const category = await CategoryModel.findById(categoryId);
            if (!category) return res.status(404).json({ msg: 'التصنيف غير موجود' });
            product.categoryId = categoryId;
        }

        // تحديث السعر والخصم
        let updatedPrice = product.price;
        let updatedDiscount = product.offer.discountedPrice;

        if ('price' in req.body) {
            const parsedPrice = parseFloat(price);
            if (isNaN(parsedPrice) || parsedPrice <= 0) {
                return res.status(400).json({ msg: 'السعر غير صالح' });
            }
            product.price = parsedPrice;
            updatedPrice = parsedPrice;
        }

        if ('discountedPrice' in req.body) {
            const parsedDiscounted = parseFloat(discountedPrice);
            if (
                !isNaN(parsedDiscounted) &&
                parsedDiscounted > 0 &&
                parsedDiscounted < updatedPrice
            ) {
                product.offer.isActive = true;
                product.offer.discountedPrice = parsedDiscounted;
                product.offer.discountPercent =
                    ((updatedPrice - parsedDiscounted) / updatedPrice) * 100;
            } else {
                product.offer.isActive = false;
                product.offer.discountedPrice = updatedPrice;
                product.offer.discountPercent = 0;
            }
        }

        // تحديث الصورة لو اتبعتت صورة جديدة
        if (req.file) {
            // رفع الصورة الجديدة إلى ImgBB
            const { url: imageUrl, deleteUrl } = await uploadToImgBB(req.file.buffer);
            product.image = imageUrl;
            product.imageDeleteUrl = deleteUrl;
        }

        await product.save();

        res.status(200).json({
            msg: 'تم تعديل المنتج بنجاح',
            product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                categoryId: product.categoryId,
                offer: product.offer,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'حصل خطأ أثناء تعديل المنتج',
            error: err.message,
        });
    }
});

// Route to get all category 
router.get('/categories', async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء جلب الفئات' });
    }
});

// GET /api/offers?categorySlug=sofa-l&maxPrice=15000&hasOffer=true&limit=10&page=1
router.get('/offers', async (req, res) => {
    try {
        const { categorySlug, maxPrice, hasOffer, limit, page } = req.query;

        const filter = {};

        // لو محدد فئة
        if (categorySlug) {
            const category = await CategoryModel.findOne({ slug: categorySlug });
            if (!category) {
                return res.status(404).json({ message: 'الفئة غير موجودة' });
            }
            filter.categoryId = category._id;
        }

        // فلترة بالسعر بعد الخصم لو فيه maxPrice
        if (maxPrice) {
            const cleanedPrice = maxPrice.replace(/\s+/g, '').replace(/,/g, '');
            const price = Number(cleanedPrice);

            if (isNaN(price)) {
                return res.status(400).json({ message: 'قيمة السعر غير صالحة' });
            }

            filter['offer.discountedPrice'] = { $lte: price };
        }

        // فلترة المنتجات اللي عليها عروض فقط
        if (hasOffer === 'true') {
            filter['offer.isActive'] = true;
        }

        // إعدادات الـ pagination
        const limitNum = parseInt(limit) || 20;
        const pageNum = parseInt(page) || 1;
        const skip = (pageNum - 1) * limitNum;

        const products = await productsModel.find(filter)
            .populate('categoryId', 'name slug')
            .skip(skip)
            .limit(limitNum);

        const totalCount = await productsModel.countDocuments(filter);

        res.json({
            total: totalCount,
            page: pageNum,
            pages: Math.ceil(totalCount / limitNum),
            products,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب البيانات' });
    }
});

export default router;
