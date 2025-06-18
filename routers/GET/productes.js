import express from 'express';
import Mix from '../../schema/categorysOfProdcuct/all.js';
import Cosmetic from '../../schema/categorysOfProdcuct/Cosmetics.js';
// import Ratans from '../../schema/categorysOfProdcuct/ratan.js';
import Households from '../../schema/categorysOfProdcuct/Household.js';
import Clothess from '../../schema/categorysOfProdcuct/clothes.js';
// import SparePartss from '../../schema/categorysOfProdcuct/spareParts.js';
const GetProdects = () => {
    const app = express();
    app.use(express.json());

    // GET لكل فئة بمفردها باستخدام الـ params
    app.get('/products/:category', async (req, res) => {
        try {
            const { category } = req.params;
            let products;

            switch (category) {
                case "1": //Furniture
                    products = await Cosmetic.find();
                    break;
                case "2": // Lighting
                    products = await Clothess.find();
                    break;
                case "3": // Decor
                    products = await Households.find();
                    break;
                // case "4": // Ratans
                //     products = await Ratans.find();
                //     break;
                // case "5": // SparePartss
                //     products = await SparePartss.find();
                //     break;
                default:
                    products = await Mix.find();
                    break;
            }

            if (products.length === 0) {
                return res.status(204).json( false );
            }

            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // GET لجميع الفئات معًا
    app.get('/productsAll', async (req, res) => {
        try {
            // const cosmetics = await Cosmetic.find();
            // const clothess = await Clothess.find();
            // const households = await Households.find();
            // const ratans = await Ratans.find();
            const alls = await Mix.find();

            // console.log('Cosmetics:', cosmetics);
            // console.log('Clothess:', clothess);
            // console.log('Households:', households);
            // console.log('Ratans:', ratans);
            // console.log('Alls:', alls);

            // const allProducts = {
            //   "متسحضرات تجميل" : cosmetics,
            //   "ملابس" : clothess,
            //    " ادوات منزليه" : households,
            //    " منتجات اوت دور (حدائق)" : ratans,
            //   " منوعات" : alls
            // };

            res.status(200).json(alls);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return app;
}

export default GetProdects;
