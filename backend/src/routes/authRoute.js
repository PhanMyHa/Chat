import express from 'express'
import { signIn, signOut, signUp } from "../controllers/authController.js";

 const router = express.Router();
 router.post("/signup", signUp);
  router.post("/signin", signIn);
   router.post("/singout", signOut);
 export default router;