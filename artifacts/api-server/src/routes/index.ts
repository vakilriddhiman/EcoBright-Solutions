import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import reviewsRouter from "./reviews";
import contactRouter from "./contact";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(reviewsRouter);
router.use(contactRouter);
router.use(adminRouter);

export default router;
