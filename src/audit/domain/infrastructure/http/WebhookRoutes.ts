import { FastifyInstance, FastifyRequest } from "fastify";

export async function registerWebhookRoutes(app: FastifyInstance, repo: any) {

  app.head("/webhook", async (_req, reply) => reply.status(200).send());

  app.post("/webhook/notifications", async (req, reply) => {
    const payload = req.body as any;

    if (!payload?.trigger) {
      return reply.status(400).send({ error: "Missing trigger" });
    }

    const saved = await repo.save(payload);
        console.log("salvando na Azure");
    return reply.status(200).send(saved);
  });

  app.get("/webhook", async (req, reply) => {
    const { trigger, status, channel } = req.query as any;

    const events = await repo.find({ trigger, status, channel });
    return reply.status(200).send(events);

  });
}