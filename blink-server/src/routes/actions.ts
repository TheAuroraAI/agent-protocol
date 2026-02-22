import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /actions.json
 * Returns the Solana Actions routing rules that map URL patterns
 * to their API endpoints.
 */
router.get("/actions.json", (_req: Request, res: Response) => {
  res.json({
    rules: [
      {
        pathPattern: "/api/actions/**",
        apiPath: "/api/actions/**",
      },
    ],
  });
});

export default router;
