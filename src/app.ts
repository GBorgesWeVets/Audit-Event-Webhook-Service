import Fastify from "fastify"
import { getAllWebhookEvents, webhookController } from "./audit/domain/controllers/WebhookController"
import { registerWebhookRoutes } from "./audit/domain/infrastructure/http/WebhookRoutes";

export const app = Fastify({
  logger: true,
})

registerWebhookRoutes(app);

