/**
    В методичке сказано "создайте отдельный роутер для публичных маррутов" и 
    "для защищенныз маршрутов (в роутере routes/index) примените ...", что выглядит нелогичным.

    До этого в проекте не создавался "routes/index". По первой методичке единственный index - 
    это index.js в корне папки backend, который запускает сервер. В примере со скриншота вообще
    остались только "/auth" и "/events", а "/users" удалили. 
    
    Поэтому я создал authRoutes.js для  маршрутов авторизации, а защищенные маршруты (events и users) оставил в своих роутерах.
    Также создал отдельный контроллер authController.js. Так выглядит логичнее...
*/
import express from "express";
import { register, login } from "../controllers/authController.js";


const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/login", login);

export default router;