# Deployment Guide - Vercel

## Persiapan Sebelum Deploy

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```

### 3. Konfigurasi Environment Variables
Pastikan environment variables berikut sudah disiapkan di Vercel:

**Di Dashboard Vercel:**
- Pergi ke Project Settings > Environment Variables
- Tambahkan variables berikut:

```
MONGODB_URI=your_production_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.vercel.app
SERVER_URL=https://your-api-project.vercel.app
NODE_ENV=production
```

## Langkah Deployment

### 1. Deploy ke Vercel
```bash
vercel --prod
```

### 2. Atau gunakan Vercel Dashboard
- Upload project ke GitHub/GitLab
- Connect repository ke Vercel
- Vercel akan auto-deploy saat ada push

## Konfigurasi Tambahan

### Environment Variables di Vercel
1. Buka project di Vercel Dashboard
2. Settings > Environment Variables
3. Tambahkan semua variables dari .env.example

### Domain Custom (Opsional)
1. Settings > Domains
2. Add your custom domain
3. Update DNS records sesuai instruksi

## Testing Setelah Deploy

### 1. Cek Health Check
```bash
curl https://your-api-project.vercel.app/
```

### 2. Test API Endpoints
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Get Products: `GET /api/products` (butuh token)
- Swagger Docs: `GET /api-docs`

### 3. Environment Variables
Pastikan semua env vars sudah benar:
- MONGODB_URI mengarah ke production DB
- CORS_ORIGIN sesuai dengan frontend domain
- JWT_SECRET kuat dan aman

## Troubleshooting

### Common Issues:
1. **MongoDB Connection Error**: Pastikan MONGODB_URI benar dan whitelist IP Vercel
2. **CORS Error**: Update CORS_ORIGIN dengan domain frontend yang benar
3. **JWT Token Invalid**: Pastikan JWT_SECRET sama di semua environment
4. **Rate Limiting**: Vercel serverless functions mungkin perlu penyesuaian rate limit

### Logs Vercel:
```bash
vercel logs
```

## File Konfigurasi Yang Sudah Ada:
- ✅ `vercel.json` - Routing configuration
- ✅ `package.json` - Dependencies dan scripts
- ✅ `.env.example` - Template environment variables
- ✅ Server.js - Express app dengan trust proxy

## Security Notes:
- Jangan commit `.env` ke repository
- Gunakan JWT_SECRET yang kuat (minimal 32 karakter)
- Pastikan MongoDB Atlas whitelist IP Vercel (0.0.0.0/0)
- Enable 2FA di Vercel account
