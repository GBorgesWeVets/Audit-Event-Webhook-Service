import Fastify from "fastify"
import { getAllWebhookEvents, webhookController } from "./audit/domain/controllers/WebhookController"

export const app = Fastify({
  logger: true,
})

app.post("/webhook", webhookController)

app.get("/webhook", getAllWebhookEvents)