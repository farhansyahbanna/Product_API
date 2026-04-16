const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { createLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Dapatkan semua produk
 *     description: Mendapatkan daftar semua produk (memerlukan autentikasi)
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Nomor halaman untuk pagination
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Jumlah item per halaman
 *     responses:
 *       200:
 *         description: Daftar produk berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token tidak valid atau tidak ada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Hanya user yang dapat mengakses daftar produk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', protect, authorize('user', 'admin'), getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Dapatkan produk berdasarkan ID
 *     description: Mendapatkan detail produk spesifik (memerlukan autentikasi)
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID produk
 *     responses:
 *       200:
 *         description: Produk berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token tidak valid atau tidak ada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Hanya user yang dapat mengakses produk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Produk tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', protect, authorize('user', 'admin'), getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Buat produk baru
 *     description: Membuat produk baru (memerlukan autentikasi admin), Catatan; Kategori hanya berisikan nilai berikut (Elektronik, Baju, Makanan, Buku, Lainnya).
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptop"
 *               description:
 *                 type: string
 *                 example: "Laptop berkinerja tinggi"
 *               price:
 *                 type: number
 *                 example: 15000000
 *               stock:
 *                 type: number
 *                 example: 10
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produk berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token tidak valid atau tidak ada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Hanya admin yang dapat membuat produk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', protect, authorize('admin'), createLimiter, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update produk
 *     description: Update informasi produk (hanya admin yang dapat melakukan ini)
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID produk
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptop Update"
 *               description:
 *                 type: string
 *                 example: "Deskripsi produk yang diupdate"
 *               price:
 *                 type: number
 *                 example: 14000000
 *               stock:
 *                 type: number
 *                 example: 15
 *     responses:
 *       200:
 *         description: Produk berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token tidak valid atau tidak boleh akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Hanya admin yang dapat mengupdate produk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Produk tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', protect, authorize('admin'), updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Hapus produk
 *     description: Menghapus produk (hanya admin yang dapat melakukan ini)
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID produk
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       401:
 *         description: Token tidak valid atau tidak boleh akses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Hanya admin yang dapat menghapus produk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Produk tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;