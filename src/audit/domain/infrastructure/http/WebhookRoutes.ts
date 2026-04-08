import { FastifyInstance, FastifyRequest } from "fastify";
import { mockAuditRepo } from "./mockRepository";
import { AuditEventPayload } from "../../entities/AuditEventPayload";

export async function registerWebhookRoutes(app: FastifyInstance) {

  // HEAD /webhook → handshake / health check
  app.head("/webhook", async (_req, reply) => reply.status(200).send());

  // POST /webhook → receber eventos reais
app.post("/webhook", async (req: FastifyRequest<{ Body: AuditEventPayload }>, reply) => {
  const payload = req.body;

  if (!payload || !payload.trigger) {
    return reply.status(400).send({ error: "Missing trigger" });
  }

  const savedEvent = await mockAuditRepo.save(payload);
  return reply.status(200).send(savedEvent);
});

  // POST /webhook/notifications → compatibilidade Smooch antigo
  app.post("/webhook/notifications", async (req, reply) => {
    const payload = req.body as any;
    if (!payload || !payload.trigger) return reply.status(400).send({ error: "Missing trigger" });
    const savedEvent = await mockAuditRepo.save(payload);
    return reply.status(200).send(savedEvent);
  });

  // GET /webhook → consultar eventos com filtros analíticos
  app.get("/webhook", async (req, reply) => {
    const { trigger, status, channel } = req.query as any;
    const events = await mockAuditRepo.find({ trigger, status, channel });
    return reply.status(200).send(events);
  });
}