import express from "express"
const router = express.Router()
import * as UserController from '../controllers/userController'
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { version } from "../../package.json";



/**
 * @swagger
 * /signup:
 *  post:
 *      summary: Sign up user
 *      description: Signs up a new user
 *      requestBody:true
 *      content:
 *          application/json:
 *          schema:
 *              type:object
 *              properties:
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses:
 *          200:
 *          description: Success
 *          400:
 *           description: Bad request
*/
router.post('/signup', UserController.signUp)
router.post('/login', UserController.login)

const swaggerOptions = {
    definition: {
      openapi: version,
      info: {
        title: `API ${version}`,
        version
    },
      servers: [
        {
          url: 'http://localhost:5000',
        },
      ],
    },
    apis: ['./src/routes/userRoutes.ts'], 
  };

const swaggerSpec = swaggerJsdoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerSpec));
export default router