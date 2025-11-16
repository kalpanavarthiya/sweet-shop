const express = require('express');
const { body, validationResult } = require('express-validator');
const Sweet = require('../models/Sweet');
const { authenticate, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

// Create sweet (admin)
router.post('/', authenticate, requireAdmin, [
  body('name').notEmpty(),
  body('category').notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('quantity').isInt({ min: 0 })
], async (req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const sweet = new Sweet(req.body);
    await sweet.save();
    res.status(201).json(sweet);
  } catch(err){
    if (err.code === 11000) return res.status(409).json({ message: 'Sweet with same name exists' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List sweets
router.get('/', async (req,res)=>{
  const sweets = await Sweet.find().sort({ createdAt: -1 });
  res.json(sweets);
});

// Search sweets
router.get('/search', async (req,res)=>{
  const { q, category, minPrice, maxPrice } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  if (minPrice) filter.price = { ...(filter.price||{}), $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...(filter.price||{}), $lte: Number(maxPrice) };
  const sweets = await Sweet.find(filter);
  res.json(sweets);
});

// Update sweet (admin)
router.put('/:id', authenticate, requireAdmin, async (req,res)=>{
  try {
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    res.json(sweet);
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete sweet (admin)
router.delete('/:id', authenticate, requireAdmin, async (req,res)=>{
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Purchase sweet (decrease quantity)
router.post('/:id/purchase', authenticate, [
  body('qty').isInt({ min: 1 })
], async (req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const qty = Number(req.body.qty);
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    if (sweet.quantity < qty) return res.status(400).json({ message: 'Insufficient stock' });
    sweet.quantity -= qty;
    await sweet.save();
    res.json({ message: 'Purchased', sweet });
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Restock (admin)
router.post('/:id/restock', authenticate, requireAdmin, [
  body('qty').isInt({ min: 1 })
], async (req,res)=>{
  const qty = Number(req.body.qty);
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    sweet.quantity += qty;
    await sweet.save();
    res.json({ message: 'Restocked', sweet });
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
