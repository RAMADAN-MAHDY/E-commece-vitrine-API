// middleware/adminMiddleware.js
// هذا الميدلوير يسمح فقط للمستخدمين الذين لديهم rols = 'admin' بالوصول للراوت

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.rols !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح لك بالدخول (أدمن فقط)' });
  }
  next();
}

export default adminMiddleware;
