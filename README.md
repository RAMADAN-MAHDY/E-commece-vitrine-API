# 🚀 توثيق REST API لمشروع E-commece-vitrine

**رابط الـ API الرئيسي:**
[https://e-commece-vitrine-api.vercel.app/](https://e-commece-vitrine-api.vercel.app/)

جميع المسارات التالية تعمل على `/api` ما لم يُذكر خلاف ذلك.  

جميع المسارات الخاصه بالادمن تتطلب ارسال الكوكيز مع الطلب 
# ملاحظه 
نستخدم التوكن في الهيدر للمستخدم العادي ولاكن الادمن التوكن يتخزن في ال cookies :
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
      
# وصف نقاط النهاية الخاصة بالأدمن مع أمثلة للفرونت إند
- **مسار التحقق من تسجيل الدخول:**
  - `GET /verify-login` للتحقق من تسجيل الدخول العادي.
  - `GET /verify-login-admin` للتحقق من تسجيل دخول الأدمن (يستخدم `adminMiddleware`).

- **مسار تسجيل الخروج:** `POST /logout` للادمن فقط لاننا نخزن توكن الادمن في الكويكز.
  - يمسح كوكيز التوكن.

## 1. إضافة أدمن وتحديث الدور (createuser.js)

### إضافة أدمن جديد
- **المسار:** `POST /add-admin`
- **الوصف:** يسمح للأدمن الحاليين بإضافة أدمن جديد.
- **التحقق:** يستخدم `middleware` و `adminMiddleware` لحماية المسار.
- **جسم الطلب:**
  ```json
  {
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **الاستجابة:**
  ```json
  {
    "message": "تم إضافة الأدمن بنجاح."
  }
  ```

### تحديث صلاحية مستخدم
- **المسار:** `PUT /update-role/:id`
- **الوصف:** تعديل صلاحية مستخدم بين "admin" و "user".
- **التحقق:** يستخدم `middleware` و `adminMiddleware`.
- **المعلمات:**
  - `id`: معرف المستخدم في الرابط.
- **جسم الطلب:**
  ```json
  {
    "newRole": "admin"  // أو "user"
  }
  ```
- **الاستجابة:**
  ```json
  {
    "message": "تم تغيير صلاحية المستخدم إلى admin بنجاح."
  }
  ```

---
 
### ملاحظات للفرونت إند:
- يجب إرسال الكوكيز التي تحتوي على `accessToken` مع الطلبات المحمية.
مثال:
```js
const res = await fetch('/api/المسار_المطلوب', {
     method: 'GET',
     credentials: 'include' // هذا يعني أنه سيتم إرسال الكوكيز مع الطلب
});
const data = await res.json();

  مثال ب axios :
const response = await axios.get('/api/المسار_المطلوب', {
  withCredentials: true // هذا يعني أنه سيتم إرسال الكوكيز مع الطلب
});
```

- استخدم المسارات المذكورة أعلاه مع البيانات المناسبة.
- تحقق من الاستجابات لمعرفة نجاح أو فشل العمليات.        
---

```
# Logout Endpoint

## نظرة عامة
يتم استخدام **مسار تسجيل الخروج** (`POST /logout`) لمسح الـ **Access Token** المخزن في **الكوكيز (Cookies)**، والذي يتم استخدامه فقط لحسابات **الأدمن (Admin)**.  
أما المستخدم العادي (User)، فإن التوكن الخاص به يتم تخزينه في **Local Storage** أو يتم إرساله مع الـ **Authorization Header**، لذلك مسار تسجيل الخروج هذا مخصص للأدمن فقط.

---

## **المسار**
```

POST /logout

````

---

## **آلية العمل**
- عند تسجيل دخول الأدمن (`/login`)، يتم حفظ **accessToken** في **Cookie** مع إعدادات أمان مثل:
  - `httpOnly: true` (يمنع الوصول للكوكيز من JavaScript في المتصفح).
  - `secure: process.env.NODE_ENV === 'production'` (يعمل فقط مع HTTPS في وضع الإنتاج).
  - `sameSite: 'none'` (للسماح بالكروس دومين).
  - `maxAge: 7 أيام` (عمر التوكن في الكوكي).

- عند استدعاء `/logout`:
  - يتم مسح **accessToken** من الكوكيز باستخدام `res.clearCookie('accessToken', { ... })`.
  - يُرجع السيرفر استجابة بنجاح الخروج:
    ```json
    {
      "message": "تم تسجيل الخروج بنجاح."
    }
    ```

---

## **الفرق بين الأدمن واليوزر**
- **الأدمن:** يعتمد على الكوكيز لتخزين التوكن، لذلك تسجيل الخروج يتم بمسح الكوكيز.
- **اليوزر:** يعتمد على **Local Storage** أو **Authorization Header** (في الـ Frontend)، لذلك عملية تسجيل الخروج يتم تنفيذها من خلال حذف التوكن محليًا في الواجهة الأمامية (Frontend) وليس من خلال السيرفر.

---

## **مثال للطلب (Request Example):**
```http
POST /logout
Host: your-api.com
Cookie: accessToken=<your_admin_access_token>
````

---

## **الاستجابة (Response):**

```json
{
  "message": "تم تسجيل الخروج بنجاح."
}
```

---

## **ملاحظات أمان:**

* يجب التأكد أن **المسار `/logout`** يتم استدعاؤه فقط من الأدمن الذي تم التحقق منه مسبقًا.
* لا يوجد حاجة لمسار Logout للمستخدم العادي، حيث يمكن ببساطة حذف الـ `accessToken` المخزن في `localStorage` أو `sessionStorage` من الواجهة الأمامية.

```
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



          
## 📬 إرسال رسالة "اتصل بنا" (محمي جزئياً)

`POST /api/postCuntactUs`

### الوصف:
هذا الروتر يسمح للمستخدمين المسجلين أو الزوار بإرسال رسالة "اتصل بنا" إلى النظام. يتطلب تسجيل دخول اختياري (يمكن إرسال الرسالة بدون تسجيل دخول).

### الرؤوس (Headers):
- توكن JWT اختياري في الهيدر إذا كان المستخدم مسجلاً.

### جسم الطلب (Body) - JSON:
```json
{
  "name": "اسم المرسل (اختياري للمستخدمين المسجلين)",
  "email": "البريد الإلكتروني (اختياري للمستخدمين المسجلين)",
  "subject": "موضوع الرسالة (اختياري)",
  "message": "نص الرسالة (مطلوب)",
  "phone": "رقم الهاتف (اختياري)"
}
```

- `message` هو الحقل الوحيد الإلزامي.
- إذا كان المستخدم مسجلاً، يتم استخدام اسمه وبريده الإلكتروني من التوكن.
- إذا كان الزائر غير مسجل، يجب إرسال الاسم والبريد الإلكتروني.

### الاستجابات:
- عند النجاح:
```json
{
  "message": "تم إرسال الرسالة بنجاح"
}
```
- عند وجود خطأ في البيانات (مثل عدم وجود نص الرسالة أو الاسم/البريد للزوار):
```json
{
  "message": "نص الرسالة مطلوب" أو "الاسم والبريد مطلوبان للزوار"
}
```
- عند حدوث خطأ في الخادم:
```json
{
  "message": "حدث خطأ أثناء الإرسال",
  "error": "تفاصيل الخطأ"
}
```

---

## 📥 جلب كل رسائل "اتصل بنا" (محمي)

`GET /api/getContactMessage`

### الوصف:
هذا الروتر يسمح للأدمن بجلب كل رسائل "اتصل بنا" مع بيانات المستخدم المرتبطة (الاسم والبريد الإلكتروني).

### الاستجابات:
- عند النجاح:
```json
[
  {
    "_id": "...",
    "userId": { "_id": "...", "name": "...", "email": "..." } أو null,
    "name": "...",
    "email": "...",
    "subject": "...",
    "message": "...",
    "phone": "...",
    "status": "new" أو "read" أو "archived",
    "responded": true أو false,
    "createdAt": "...",
    "updatedAt": "..."
  },
  ...
]
```
- عند حدوث خطأ في الخادم:
```json
{
  "message": "حدث خطأ أثناء جلب الرسائل",
  "error": "تفاصيل الخطأ"
}
```

---

### مثال عملي (Fetch) لإرسال رسالة "اتصل بنا":
```js
const contactData = {
  name: "اسم المستخدم",
  email: "البريد الإلكتروني",
  subject: "موضوع الرسالة",
  message: "نص الرسالة",
  phone: "رقم الهاتف"
};

const res = await fetch('/api/postCuntactUs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer <access_token>' // اختياري لإرسال الرسالة للمستخدم المسجلين
  },
  body: JSON.stringify(contactData)
});

const data = await res.json();
console.log(data);
```

---

### مثال عملي (Fetch) لجلب كل رسائل "اتصل بنا":
```js
const res = await fetch('/api/getContactMessage', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
});
const messages = await res.json();
console.log(messages);
```

--- 

## 🛒 جلب كل الطلبات مع فلترة وترتيب وتقسيم الصفحات (محمي)

`GET /api/admin/orders`

### الوصف:
- هذه المسار يسمح للمسؤول بجلب جميع الطلبات مع إمكانية تطبيق فلترة حسب معرف المستخدم أو حالة الطلب.
- يمكن ترتيب النتائج حسب أي حقل (افتراضيًا حسب تاريخ الإنشاء) وباتجاه تصاعدي أو تنازلي.
- يدعم تقسيم الصفحات لتحديد الصفحة وعدد الطلبات في كل صفحة.

### المعاملات (Query Parameters):
| المعامل   | النوع   | الوصف                                   |
|----------|---------|-----------------------------------------|
| `userId` | نص     | (اختياري) فلترة الطلبات حسب معرف المستخدم |
| `status` | نص     | (اختياري) فلترة الطلبات حسب الحالة (مثلاً "pending", "completed") |
| `sortBy` | نص     | (اختياري) الحقل الذي سيتم الترتيب بناءً عليه (افتراضي: `createdAt`) |
| `order`  | نص     | (اختياري) اتجاه الترتيب: `asc` أو `desc` (افتراضي: `desc`) |
| `page`   | رقم     | (اختياري) رقم الصفحة (افتراضي: 1) |
| `limit`  | رقم     | (اختياري) عدد الطلبات في الصفحة (افتراضي: 10) |

### الاستجابة الناجحة:
```json
{
  "total": 100,          // إجمالي عدد الطلبات المطابقة للفلترة
  "page": 1,             // الصفحة الحالية
  "pages": 10,           // إجمالي عدد الصفحات
  "orders": [            // قائمة الطلبات
    {
      "_id": "...",
      "userId": "...",
      "status": "...",
      "products": [
        {
          "productId": {
            "title": "...",
            "image": "...",
            "price": 100
          },
          "quantity": 2
        }
      ],
      "createdAt": "...",
      "updatedAt": "..."
    },
    ...
  ]
}
```

### الأخطاء المحتملة:
- 500: خطأ في السيرفر عند جلب الطلبات.

---

## 🧑‍💻 جلب طلبات المستخدم الحالي (محمي)

`GET /api/user/orders`

### الوصف:
- هذا المسار يسمح للمستخدم المسجل بجلب طلباته الخاصة.
- يتطلب إرسال توكن JWT في الهيدر.

### الهيدر:
```
Authorization: Bearer <access_token>
```

### الاستجابة الناجحة:
```json
{
  "userEmail": "user@example.com",
  "userName": "User Name",
  "orders": [
    {
      "_id": "...",
      "status": "...",
      "products": [ ... ],
      "createdAt": "..."
    },
    ...
  ]
}
```

### الأخطاء المحتملة:
- 500: خطأ في السيرفر عند جلب الطلبات.

---

## 🧑‍💻 مثال عملي (Fetch) لجلب طلبات المستخدم:

```js
const res = await fetch('/api/user/orders', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <access_token>'
  }
});
const data = await res.json();
console.log(data);
```  
## 🔄 تحديث حالة الطلب (محمي)

`PATCH /api/admin/orders/:orderId/status`

### الوصف:
- هذا المسار يسمح للمسؤول بتحديث حالة طلب معين باستخدام معرف الطلب.
- يجب إرسال توكن JWT في الهيدر للمصادقة.

### الرؤوس (Headers):
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### المعاملات:
- `orderId` في مسار URL: معرف الطلب الذي سيتم تحديث حالته.

### جسم الطلب (Body) - JSON:
```json
{
  "status": "new_status_value"
}
```
- `status` يجب أن يكون واحدًا من القيم التالية:
  - `pending`
  - `confirmed`
  - `processing`
  - `shipped`
  - `delivered`
  - `cancelled`
  - `returned`
  - `failed`

### الاستجابة الناجحة:
```json
{
  "message": "Order status updated successfully",
  "order": "updated_status_value"
}
```

### الأخطاء المحتملة:
- 400: إذا كانت قيمة الحالة غير صالحة.
- 404: إذا لم يتم العثور على الطلب.
- 500: خطأ في السيرفر أثناء تحديث حالة الطلب.

---

### مثال عملي (Fetch) لتحديث حالة الطلب:
```js
const res = await fetch('/api/admin/orders/معرف_الطلب/status', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <access_token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: 'shipped' })
});
const data = await res.json();
console.log(data);
```  
 ---    
### وصف API حذف رسالة (Delete Message) للفرونت إند

- **المسار:** `DELETE /delete_message/:id`
- **الوصف:** يسمح هذا الراوتر للمستخدم بحذف رسالة معينة بناءً على معرف الرسالة (`id`).
- **التحقق:** يتطلب توكن JWT صالح في الهيدر (محمي بواسطة `authMiddleware`).

#### كيفية الاستخدام:
- يجب إرسال طلب `DELETE` إلى المسار مع استبدال `:id` بمعرف الرسالة المراد حذفها.
- يجب إرسال التوكن في الهيدر `Authorization` بصيغة:
  ```
  Authorization: Bearer <access_token>
  ```

#### سلوك الحذف:
- إذا كانت الرسالة موجهة للجميع (`forAll` = true)، يتم فقط تسجيل أن المستخدم حذف الرسالة عنده (لا يتم حذفها من قاعدة البيانات).
- إذا كانت الرسالة خاصة بالمستخدم، يتم حذفها نهائيًا من قاعدة البيانات.

#### الاستجابات:
- عند النجاح:
  ```json
  { "message": "تم حذف الرسالة بنجاح" }
  ```
- إذا لم يتم العثور على الرسالة:
  ```json
  { "message": "الرسالة غير موجودة" }
  ```
- عند حدوث خطأ في الخادم:
  ```json
  { "message": "حدث خطأ أثناء حذف الرسالة" }
  ```

---

### مثال عملي (Fetch) للفرونت إند:
```js
const messageId = 'معرف_الرسالة';
const res = await fetch(`/api/delete_message/${messageId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer <access_token>'
  }
});
const data = await res.json();
console.log(data);
```

- تأكد من استبدال `<access_token>` بالتوكن الصحيح للمستخدم.
- تحقق من الاستجابة لمعرفة نجاح أو فشل عملية الحذف.
   
---

لأي استفسار عن أي Endpoint أو إضافة توثيق لمسارات أخرى، تواصل مع فريق الباكند.
