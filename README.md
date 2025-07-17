# 🚀 توثيق REST API لمشروع E-commece-vitrine

**رابط الـ API الرئيسي:**
[https://e-commece-vitrine-api.vercel.app/](https://e-commece-vitrine-api.vercel.app/)

جميع المسارات التالية تعمل على `/api` ما لم يُذكر خلاف ذلك.  
جميع المسارات الحساسة (إضافة منتج، إنشاء طلب، الدفع...) تتطلب إرسال توكن JWT في الهيدر:

```
Authorization: Bearer <access_token>
```

---

## 👤 تسجيل مستخدم جديد

`POST /register`

**Body:**
```json
{
  "name": "اسم المستخدم",
  "email": "البريد الإلكتروني",
  "password": "كلمة المرور"
}
```
**Response:**  
بيانات المستخدم + accessToken

---

## 🔑 تسجيل الدخول

`POST /login`

**Body:**
```json
{
  "email": "البريد الإلكتروني",
  "password": "كلمة المرور"
}
```
**Response:**  
بيانات المستخدم + accessToken

---

## 🏷️ جلب كل التصنيفات

`GET /categories`

**Response:**
```json
[
  { "_id": "...", "name": "...", "slug": "..." }, ...
]
```

---

## 🛍️ جلب المنتجات حسب التصنيف

`GET /product/:categoryId`

**Response:**  
قائمة المنتجات في التصنيف

---

## 🛍️ جلب المنتجات حسب السلاج

`GET /productBySlug/:categoryslug`

**Response:**  
قائمة المنتجات في التصنيف

---

## 🛍️ جلب كل المنتجات

`GET /products`

**Response:**  
قائمة كل المنتجات

---

## 🎁 جلب العروض

`GET /offers?categorySlug=slug&maxPrice=15000&hasOffer=true&limit=10&page=1`

**Response:**
```json
{
  "total": 100,
  "page": 1,
  "pages": 10,
  "products": [ ... ]
}
```

---

## 💳 إنشاء جلسة دفع Stripe (محمي)

`POST /stripe/create-checkout-session`

**Headers:**
```
Authorization: Bearer <access_token>
```
**Body:**
```json
{
  "cartItems": [
    { "productId": "...", "quantity": 2 },
    { "productId": "...", "quantity": 1 }
  ]
}
```
**Response:**
```json
{ "url": "رابط الدفع من Stripe" }
```

---

## 💳 جلب بيانات جلسة Stripe

`GET /stripe/session/:sessionId`

**Response:**
```json
{
  "amountPaid": 2000,
  "currency": "usd",
  "paymentStatus": "paid",
  "customerName": "اسم العميل",
  "customerEmail": "البريد الإلكتروني",
  "orderId": "..."
}
```

---

## 💵 إنشاء طلب دفع عند الاستلام (محمي)

`POST /cash-on-delivery`

**Headers:**
```
Authorization: Bearer <access_token>
```
**Body:**
```json
{
  "cartItems": [
    { "productId": "...", "quantity": 2 },
    { "productId": "...", "quantity": 1 }
  ]
}
```
**Response:**
```json
{
  "message": "تم تسجيل الطلب بنجاح. سيتم الدفع عند الاستلام.",
  "orderId": "...",
  "amount": 1234,
  "products": [ ... ]
}
```

---

## ➕ إضافة منتج جديد (محمي)

`POST /addproduct`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Body (form-data):**
| الحقل      | النوع | الحالة  | الوصف                        |
|------------|-------|---------|------------------------------|
| `name`     | نص    | مطلوب   | اسم المنتج                   |
| `price`    | رقم   | مطلوب   | السعر الأصلي للمنتج          |
| `discountedPrice`    | رقم   | اختياري   | السعر  بعد الخصم          |
| `categoryId`| نص   | مطلوب   | معرف التصنيف الخاص بالمنتج   |
| `image`    | ملف   | مطلوب   | صورة المنتج (File)           |

**ملاحظات مهمة:**
- لا ترسل أي بيانات خصم من الفرونت (لا discountedPrice ولا discountPercent).
- الخصم يُحسب تلقائيًا في الباك فقط إذا كان هناك سياسة خصم (مثلاً لو فيه خصم موسمي أو حسب سياسة المتجر).
- إذا احتاجت الإدارة تفعيل خصم، يتم ذلك من الباك أو لوحة التحكم فقط.

**Response:**
```json
{
  "_id": "...",
  "name": "...",
  "price": ...,
  "image": "رابط الصورة",
  "categoryId": "...",
  "offer": {
    "isActive": true,
    "discountPercent": 10,
    "discountedPrice": 90
  },
  ...
}
```

---

## ⚠️ ملاحظات هامة
- جميع الأسعار والخصومات تُحسب في الباكند فقط.
- يجب إرسال التوكن في الهيدر للمسارات المحمية.
- لا ترسل userId من الفرونت، يتم استخلاصه من التوكن تلقائيًا.
- تحقق من الردود لمعالجة الأخطاء.

---

## 🧑‍💻 مثال عملي (Fetch)

```js
const formData = new FormData();
formData.append('name', 'اسم المنتج');
formData.append('price', 100);
formData.append('categoryId', 'معرف التصنيف');
formData.append('image', fileInput.files[0]); // صورة المنتج

const res = await fetch('/api/addproduct', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <access_token>'
    // لا تضع Content-Type مع FormData
  },
  body: formData
});
const data = await res.json();
console.log(data);
```

---





## 🔍 البحث عن المنتجات

`GET /api/search/products?query=your_search_term`

**الوصف:** البحث عن المنتجات باستخدام كلمة البحث في الحقول المفهرسة.

**Response:**
```json
[
  { "_id": "...", "name": "...", "price": ..., "categoryId": "..." },
  ...
]
```

## 💡 اقتراحات البحث التلقائية

`GET /api/search/suggestions?query=your_search_term`

**الوصف:** جلب اقتراحات تلقائية لاسم المنتج بناءً على البحث التنبؤي.

**Response:**
```json
[
  { "name": "...", "image": "..." },
  ...
]
```

## 📝 تفاصيل المنتج

`GET /api/product/details/:productId`

**الوصف:** جلب تفاصيل منتج معين بواسطة معرف المنتج.

**Response:**
```json
{
  "_id": "...",
  "name": "...",
  "price": ...,
  "categoryId": "...",
  ...
}
```
     


          
تم شرح وتوثيق روتر تعديل المنتج في ملف README.md للفرونت اند. إليك القسم الجديد الذي يمكنك إضافته لتوضيح كيفية إرسال طلب التعديل:

---

## ✏️ تعديل منتج (محمي)

`PATCH api/editproduct/:id`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Body (form-data):**
| الحقل              | النوع   | الحالة    | الوصف                                 |
|--------------------|---------|-----------|---------------------------------------|
| `name`             | نص      | اختياري   | اسم المنتج الجديد                     |
| `price`            | رقم     | اختياري   | السعر الجديد                          |
| `discountedPrice`  | رقم     | اختياري   | السعر بعد الخصم                       |
| `categoryId`       | نص      | اختياري   | معرف التصنيف الجديد                   |
| `image`            | ملف     | اختياري   | صورة جديدة للمنتج (File)              |

**ملاحظات:**
- يمكنك إرسال أي حقل تريد تعديله فقط، وليس من الضروري إرسال جميع الحقول.
- إذا أرسلت صورة جديدة، سيتم استبدال صورة المنتج القديمة.
- إذا أرسلت discountedPrice أقل من السعر، سيتم تفعيل الخصم تلقائيًا.

**Response:**
```json
{
  "msg": "تم تعديل المنتج بنجاح",
  "product": {
    "_id": "...",
    "name": "...",
    "price": ...,
    "image": "رابط الصورة",
    "categoryId": "...",
    "offer": {
      "isActive": true,
      "discountPercent": 10,
      "discountedPrice": 90
    }
  }
}
```

**مثال عملي (Fetch):**
```js
const formData = new FormData();
formData.append('name', 'اسم جديد');
formData.append('price', 120);
formData.append('discountedPrice', 100);
formData.append('categoryId', 'معرف_تصنيف_جديد');
formData.append('image', fileInput.files[0]); // صورة جديدة

const res = await fetch('/api/editproduct/معرف_المنتج', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <access_token>'
    // لا تضع Content-Type مع FormData
  },
  body: formData
});
const data = await res.json();
console.log(data);
```

---
  
## 🗑️ حذف منتج (محمي)

`DELETE /api/deleteproduct/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**الوصف:**
يحذف هذا الراوتر منتجًا من قاعدة البيانات بناءً على معرف المنتج (`id`). إذا كان للمنتج صورة مخزنة على ImgBB، سيتم حذفها أيضًا تلقائيًا.

**الرد الناجح:**
```json
{
  "msg": "تم حذف المنتج بنجاح"
}
```

**في حال عدم وجود المنتج:**
```json
{
  "msg": "المنتج غير موجود"
}
```

**مثال عملي (Fetch):**
```js
const res = await fetch('/api/deleteproduct/معرف_المنتج', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer <access_token>'
  }
});
const data = await res.json();
console.log(data);
```         
# 📨 إرسال رسالة جديدة (من الأدمن)

`POST /api/messages`

### الوصف:
هذا الروتر يسمح للأدمن بإرسال رسالة جديدة إلى مستخدم معين أو لجميع المستخدمين.

### الرؤوس (Headers):
- لا يتطلب توكن في هذا المثال، لكن يمكن إضافة حماية حسب الحاجة.

### جسم الطلب (Body) - JSON:
```json
{
  "title": "عنوان الرسالة",
  "content": "محتوى الرسالة",
  "forUser": "معرف المستخدم المستهدف (اختياري)",
  "forAll": true أو false
}
```

- `title` و `content` هما حقول إلزامية.
- `forUser` هو معرف المستخدم الذي سترسل له الرسالة، ويكون null إذا كانت الرسالة موجهة للجميع.
- `forAll` إذا كانت true، يتم إرسال الرسالة لجميع المستخدمين.

### الاستجابات:
- عند النجاح:
```json
{
  "message": "تم إرسال الرسالة بنجاح"
}
```
- عند وجود خطأ في البيانات (مثل عدم وجود العنوان أو المحتوى):
```json
{
  "message": "العنوان والمحتوى مطلوبين"
}
```
- عند حدوث خطأ في الخادم:
```json
{
  "message": "حدث خطأ أثناء إرسال الرسالة",
  "error": "تفاصيل الخطأ"
}
```

### مثال عملي (Fetch) للفرونت إند:
```js
const messageData = {
  title: "تنبيه مهم",
  content: "يرجى تحديث بياناتك الشخصية.",
  forUser: "معرف_المستخدم_إن_كان_مخصصًا",
  forAll: false
};

const res = await fetch('/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(messageData)
});

const data = await res.json();
console.log(data);
```
---      
                      
## 👥 جلب كل المستخدمين

`GET /api/Users`

### الوصف:
هذا الروتر يقوم بجلب قائمة بكل المستخدمين المسجلين في النظام.

### الاستجابات:
- عند النجاح:
```json
{
  "ALL_Users": [
    { "_id": "...", "name": "...", "email": "..." },
    ...
  ]
}
```
- إذا لم يكن هناك مستخدمين:
```json
{
  "message": "لا يوجد مستخدمين"
}
```
- عند حدوث خطأ في الخادم:
```json
{
  "message": "حدث خطأ أثناء جلب البيانات"
}
```

---

## 📨 جلب الرسائل (محمي جزئياً)

`GET /api/Get_messages`

### الوصف:
هذا الروتر يقوم بجلب الرسائل التي تم إرسالها للمستخدم. إذا تم إرسال توكن JWT صالح في الهيدر، سيتم جلب الرسائل الموجهة للمستخدم بالإضافة إلى الرسائل العامة. إذا لم يتم إرسال توكن أو كان غير صالح، سيتم جلب الرسائل العامة فقط.

### الرؤوس (Headers):
```
Authorization: Bearer <access_token>  (اختياري)
```

### الاستجابات:
- عند النجاح:
```json
{
  "messages": [
    {
      "_id": "...",
      "title": "...",
      "content": "...",
      "forUser": "..." أو null,
      "forAll": true أو false,
      "createdAt": "..."
    },
    ...
  ]
}
```
- عند حدوث خطأ في الخادم:
```json
{
  "message": "حدث خطأ أثناء جلب الرسائل"
}
```

---

### مثال عملي (Fetch) لجلب الرسائل:
```js
const res = await fetch('/api/Get_messages', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <access_token>' // يمكن حذف هذا الهيدر لجلب الرسائل العامة فقط
  }
});
const data = await res.json();
console.log(data.messages);
```        
---

لأي استفسار عن أي Endpoint أو إضافة توثيق لمسارات أخرى، تواصل مع فريق الباكند.