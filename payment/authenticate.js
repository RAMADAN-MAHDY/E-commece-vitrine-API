import axios from 'axios';
export async function authenticate() {
  const res = await axios.post('https://accept.paymob.com/api/auth/tokens', {
    api_key: process.env.PAYMOB_API_KEY,
  });
  return res.data.token;
}
