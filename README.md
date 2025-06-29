# 🚀 توثيق REST API لمشروع dina_Abaza

جميع المسارات التالية تعمل على `/api` ما لم يُذكر خلاف ذلك. جميع مسارات الطلبات الحساسة (إنشاء طلب، الدفع، ...إلخ) تتطلب إرسال توكن JWT في الهيدر:

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
- بيانات المستخدم + accessToken

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
- بيانات المستخدم + accessToken

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
- قائمة المنتجات في التصنيف

---

## 🛍️ جلب المنتجات حسب السلاج

`GET /productBySlug/:categoryslug`

**Response:**
- قائمة المنتجات في التصنيف

---

## 🛍️ جلب كل المنتجات

`GET /products`

**Response:**
- قائمة كل المنتجات

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

## ⚠️ ملاحظات هامة
- جميع الأسعار تُحسب في الباكند فقط.
- يجب إرسال التوكن في الهيدر للمسارات المحمية.
- لا ترسل userId من الفرونت، يتم استخلاصه من التوكن.
- تحقق من الردود لمعالجة الأخطاء.

---

## 🧑‍💻 مثال عملي (Fetch)

```js
const res = await fetch('/api/stripe/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <access_token>'
  },
  body: JSON.stringify({
    cartItems: [
      { productId: '...', quantity: 2 },
      { productId: '...', quantity: 1 }
    ]
  })
});
const data = await res.json();
window.location.href = data.url;
```

---

لأي استفسار عن أي Endpoint أو إضافة توثيق لمسارات أخرى، تواصل مع فريق الباكند.