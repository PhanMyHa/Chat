import express from 'express'
import {authUser} from '../controllers/userController.js'
const router=express.Router();
router.get("/user",authUser)
export default router;