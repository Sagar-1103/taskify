import Router from "express";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controllers/tasks.controller";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJwt);
router.post("/",createTask);
router.get("/",getTasks);

router.get("/:id",getTask)
router.put("/:id",updateTask)
router.delete("/:id",deleteTask)


export default router;