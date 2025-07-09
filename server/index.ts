import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";


import cors from "cors";
import routes from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);


// app.listen(5001, () => {
//   console.log("Server running on http://localhost:5000);
// });

const PORT = newFunction();

// Setup basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Log API responses and durations
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  let capturedJsonResponse: any = undefined;
  const originalJson = res.json;

  res.json = function (body, ...args) {
    capturedJsonResponse = body;
    return originalJson.call(this, body, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

      if (capturedJsonResponse) {
        const jsonPreview = JSON.stringify(capturedJsonResponse);
        logLine += ` :: ${jsonPreview}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err; // still crash in dev to expose the stack
  });

  // Serve dev or production mode
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server
  server.listen({ port: PORT, host: "0.0.0.0", reusePort: true }, () => {
    log(`Server running on http://localhost:${PORT}`);
  });
})();
function newFunction() {
  // const app = express();
  const PORT = 5001;
  return PORT;
}

