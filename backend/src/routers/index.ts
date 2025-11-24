import { Router } from 'express'
import express from "express";

// middlewares
import accessLogger from '../middleware/security/access-logger.js'
import tokenVerifier from '../middleware/auth/tokenVerifier-middleware.js'
import apilimiter from "../middleware/security/apilimiter.js";

// routers
import authRouter from './auth-router.js'
import clientRouter from './client-router.js'
// import adminRouter from './admin-router.js'
// import publicRouter from './public-router.js'

const router: express.Router = Router()



// Public router: /v1/public
// router.use("/v1/public", publicRouter)

// Auth router: /v1/auth
router.use("/v1/auth", accessLogger, apilimiter, authRouter)

// // Client router: /v1/client
router.use("/v1/client", accessLogger, tokenVerifier, clientRouter)

// // Admin router: /v1/admin
// router.use("/v1/admin", accessLogger, tokenVerifier, adminRouter)

// health check route
router.get('/v1/health', (_, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running smoothly',
  })
})

export default router
