import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Too many requests. Please try again after 15 minutes.",
      code: "RATE_LIMIT_EXCEEDED",
    });
  },
});


export const logoutLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 30,

      handler: (req, res) => {
        return res.status(429).json({
          success: false,
          error: "Too many requests. Please try again after 15 minutes.",
          code: "RATE_LIMIT_EXCEEDED",
        });
      },
});
  
export const apiLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 50,
      handler: (req, res) => {
        return res.status(429).json({
          success: false,
          error: "Too many requests. Please try again after 15 minutes.",
          code: "RATE_LIMIT_EXCEEDED",
        });
      },
});

export const aiLimiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      limit: 20,
      handler: (req, res) => {
        return res.status(429).json({
          success: false,
          error: "Too many requests. Please try again after 15 minutes.",
          code: "RATE_LIMIT_EXCEEDED",
        });
      },
    });

