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
| `discountedPrice`    | رقم   | اختياري   | السعر الأصلي للمنتج          |
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

لأي استفسار عن أي Endpoint أو إضافة توثيق لمسارات أخرى، تواصل مع فريق الباكند.