import { Router, Request, Response } from 'express';
import { globalErrorHandler } from './utils/express';
import PlanningSessionWorker from './utils/PlanningSessionWorker';

const router = Router();

const sessionsWorker = PlanningSessionWorker.getInstance();

router.post('/session', (req: Request, res: Response) => {
    if (req.body.map === undefined || typeof req.body.map !== 'string') {
        res.status(400).json({
            error: 'You have to include a map in the request body.'
        });

        return;
    }

    const id = sessionsWorker.newSession(req.body.map);
    res.status(201).json({ id });
});

router.use(globalErrorHandler);

export default router;
