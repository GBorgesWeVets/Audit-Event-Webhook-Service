import { FastifyRequest, FastifyReply } from "fastify"
import { AuditEventRepository } from "../repositories/AuditEventRepository"
import { SaveAuditEventUseCase } from "../use-cases/SaveAuditEventUseCase"

interface WebhookPayload {
  eventId?: string
  trigger: string
  destination?: {
    type?: string
  }
  delivery?: {
    status?: string
  }
  matchResult?: {
    conversation?: { _id?: string }
    appUser?: { _id?: string }
  }
  [key: string]: any // garante que payload extra seja aceito
}

const repository = new AuditEventRepository()
const useCase = new SaveAuditEventUseCase(repository)

export async function webhookController(
  request: FastifyRequest<{ Body: WebhookPayload }>,
  reply: FastifyReply
) {
  try {
    const payload = request.body

    if (!payload || !payload.trigger) {
      return reply.status(400).send({ error: "Missing trigger in payload" })
    }

    await useCase.execute(payload)

    return reply.status(200).send({ ok: true })
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: "Internal error" })
  }
}

// GET webhook — retorna todos os eventos (mock)
export async function getAllWebhookEvents(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const events = await repository.getAll()
    return reply.status(200).send(events.map(e => e.props))
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: "Internal error" })
  }
}