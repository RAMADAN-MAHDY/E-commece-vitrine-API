import axios from 'axios';

export default async function deleteFromImgBB(deleteUrl) {
  try {
    const response = await axios.get(deleteUrl);
    return response.data;
  } catch (error) {
    console.error('فشل حذف الصورة من ImgBB:', error.message);
    // مش لازم توقف التنفيذ، لأن الحذف من ImgBB مش شرط أساسي
  }
}
