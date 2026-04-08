import { AuditEvent } from "../entities/AuditEvents"
import { AuditEventRepository } from "../repositories/AuditEventRepository"

export class SaveAuditEventUseCase {
  constructor(private repository: AuditEventRepository) {}

  async execute(payload: any) {
    const event = AuditEvent.create({
      eventId: payload.eventId || payload?.eventId || crypto.randomUUID(),
      trigger: payload.trigger,
      channel: payload?.destination?.type,
      status: payload?.delivery?.status,
      conversationId: payload?.matchResult?.conversation?._id,
      appUserId: payload?.matchResult?.appUser?._id,
      receivedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      rawPayload: payload,
    })

    await this.repository.save(event)
  }
}