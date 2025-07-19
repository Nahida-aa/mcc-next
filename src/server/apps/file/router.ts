import { createSubApp } from "@/server/createApp";
import { authMiddleware } from "../auth/middleware";

const app = createSubApp();
app.use(authMiddleware)