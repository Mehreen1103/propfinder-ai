import { Router } from 'express';
import { listListings, getListing } from '../controllers/listings.controller.js';

const router = Router();
router.get('/', listListings);
router.get('/:id', getListing);

export default router;
