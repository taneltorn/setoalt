import express, {Request, Response} from "express";
import {verifyToken} from "../utils/verifyToken";
import log4js from "log4js";
import {checkUser} from "../utils/checkUser";
import * as scoreService from '../service/ScoreService';

const logger = log4js.getLogger("ScoreController");
logger.level = 'info';

const router = express.Router();
//
// router.get("/", checkUser, async (req: Request, res: Response): Promise<any> => {
//     logger.info("GET /api/scores");
//
//     // @ts-ignore todo use custom type
//     const user = req.user;
//
//     try {
//         const data = await scoreService.findAllScores(user);
//         res.json(data);
//     } catch (err) {
//         logger.error(err);
//         res.status(500).json({error: err});
//     }
// });
//
// router.get("/:id", async (req: Request, res: Response): Promise<void> => {
//     const id = parseInt(req.params.id);
//     logger.info(`GET /api/scores/${id}`);
//
//     if (isNaN(id)) {
//         res.status(400).json({error: "Invalid ID"});
//         return;
//     }
//
//     try {
//         logger.info(`Querying score with id = ${id} in database`);
//
//         const result = await scoreService.findScoreById(id);
//         if (!result) {
//             logger.info(`Score with id = ${id} not found`);
//
//             res.status(404).json({error: "Score not found"});
//             return;
//         }
//         res.json(result);
//     } catch (err) {
//         logger.error(err);
//         res.status(500).json({error: "Internal Server Error"});
//     }
// });
//
// router.post("/", verifyToken, async (req: Request, res: Response): Promise<void> => {
//     logger.info("POST /scores")
//     logger.info(req.body);
//
//     // @ts-ignore todo use custom type
//     const user = req.user;
//     const score = req.body;
//
//     if (!score || !user) {
//         res.status(400).json({error: "Missing score or user information"});
//         return;
//     }
//
//     try {
//         logger.info(`Inserting new score`);
//         logger.info(user.id);
//
//         const result = scoreService.insertScore(score, user);
//         res.status(200).json(result);
//     } catch (err) {
//         logger.error(err);
//         res.status(500).json({error: "Internal Server Error"});
//     }
// });
//
// router.put("/:id", verifyToken, async (req: Request, res: Response): Promise<void> => {
//     logger.info("PUT /scores/:id");
//     logger.info(req.body);
//
//     const scoreId = req.params.id;
//
//     // @ts-ignore todo use custom type
//     const user = req.user;
//     const updatedScore = req.body;
//
//     if (!updatedScore || !user) {
//         res.status(400).json({error: "Missing updated score data or user information"});
//         return;
//     }
//
//     try {
//         logger.info(`Updating score with id = ${scoreId}`);
//
//         const result = scoreService.updateScore(scoreId, updatedScore, user);
//         if (!result) {
//             res.status(404).json({error: "Score not found or you're not the owner"});
//             return;
//         }
//
//         res.status(200).json(result);
//     } catch (err) {
//         logger.error(err);
//         res.status(500).json({error: "Internal Server Error"});
//     }
// });
//
// router.delete("/:id", verifyToken, async (req: Request, res: Response): Promise<void> => {
//     const scoreId = parseInt(req.params.id);
//     logger.info(`DELETE /api/scores/${scoreId}`);
//
//     if (isNaN(scoreId)) {
//         res.status(400).json({error: "Invalid ID"});
//         return;
//     }
//
//     try {
//         logger.info(`Deleting score with id = ${scoreId}`);
//
//         const result = scoreService.deleteScore(scoreId);
//
//         if (!result) {
//             logger.info(`Score with id = ${scoreId} not found in database`);
//
//             res.status(404).json({error: "Score not found"});
//             return;
//         }
//
//         logger.info(`Score with id = ${scoreId} removed from database`);
//         res.status(200).json({message: "Score deleted successfully", deletedScore: result});
//     } catch (err) {
//         logger.error(err);
//         res.status(500).json({error: "Internal Server Error"});
//     }
// });
//
// export default router;