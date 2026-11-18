import { Router } from 'express';

import { registrarUsuario } from '../controllers/login.controller.js';

const router = Router();

router.post('/', registrarUsuario);

export default router;
