// import express, {Request, Response} from "express";
// import {verifyToken} from "../utils/verifyToken";
// import log4js from "log4js";
// import * as userService from '../service/userService';
// import bcrypt from "bcrypt";
//
// const saltRounds = 10
//
// const logger = log4js.getLogger("UserController");
// logger.level = 'info';
//
// const router = express.Router();
//
//
//
// router.get("/", verifyToken, async (req: Request, res: Response): Promise<any> => {
//     // @ts-ignore todo use custom type
//     const user = req.user;
//
//     logger.info(`GET /api/users as user ${user.username}`);
//     if (user?.role !== 'ADMIN') {
//         logger.info(`${user.username} not authorized`);
//         res.status(403).json({error: "Not authorized"});
//         return;
//     }
//
//     try {
//         const result = await userService.findAllUsers();
//         if (!result.success) {
//             res.status(result.code).json({error: result.error});
//             return;
//         }
//         res.json(result.data);
//     } catch (err) {
//         logger.error(err);
//         res.status(500).json({error: err});
//     }
// });
//
// router.post("/", verifyToken, async (req: Request, res: Response): Promise<void> => {
//     // @ts-ignore todo use custom type
//     const user = req.user;
//
//     logger.info(`POST /api/users as user ${user.username}`);
//     const data = req.body;
//
//     if (user?.role !== 'ADMIN') {
//         logger.info(`${user.username} not authorized`);
//         res.status(403).json({error: "Not authorized"});
//         return;
//     }
//
//     if (!data) {
//         logger.info(`Request body is null`);
//         res.status(400).json({error: "Missing user information"});
//         return;
//     }
//
//     try {
//         data.password = await bcrypt
//             .genSalt(saltRounds)
//             .then(salt => {
//                 return bcrypt.hash(data.password, salt);
//             })
//             .catch(err => console.error(err.message));
//
//         const result = await userService.insertUser(data, user);
//         if (!result.success) {
//             res.status(result.code).json({error: result.error});
//             return;
//         }
//         logger.info(`User ${data.username} inserted to database`);
//         res.status(200).json(result);
//     } catch (err) {
//         logger.error(err);
//         res.status(500).json({error: "Internal Server Error"});
//     }
// });
//
// router.delete("/:id", verifyToken, async (req: Request, res: Response): Promise<void> => {
//     const userId = parseInt(req.params.id);
//     logger.info(`DELETE /api/users/${userId}`);
//
//     // @ts-ignore todo use custom type
//     const user = req.user;
//     if (user?.role !== 'ADMIN') {
//         logger.info(`${user.username} not authorized`);
//         res.status(403).json({error: "Not authorized"});
//         return;
//     }
//
//     if (isNaN(userId)) {
//         logger.info(`Invalid ID: ${userId}`);
//         res.status(400).json({error: "Invalid ID"});
//         return;
//     }
//
//     try {
//         const result = await userService.deleteUser(userId);
//         if (!result.success) {
//             res.status(result.code).json({error: result.error});
//             return;
//         }
//         logger.info(`User deleted from database`);
//         res.status(200).json({message: "User deleted successfully", deletedUser: result});
//     } catch (err) {
//         logger.error(err);
//         res.status(500).json({error: "Internal Server Error"});
//     }
// });
//
// export default router;