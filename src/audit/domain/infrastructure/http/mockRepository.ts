import { v4 as uuid } from "uuid";
import { AuditEvent } from "../../entities/AuditEvents";
import { AuditEventPayload } from "../../entities/AuditEventPayload";

let mockDb: AuditEvent[] = [];

export const mockAuditRepo = {
  async save(payload: AuditEventPayload): Promise<AuditEvent> {
    const event: AuditEvent = {
      _id: uuid(), // agora é seguro
      eventId: payload.eventId || `${payload.trigger}-${Date.now()}`,
      trigger: payload.trigger,
      channel: payload?.destination?.type || payload?.channel || "unknown",
      delivery: payload?.delivery || {},
      hmacValid: payload.hmacValid ?? null,
      receivedAt: payload.receivedAt || new Date().toISOString(),
      rawPayload: payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.push(event);
    console.log("Salvando no mock");
    
    return event;
  },

  async find(filters?: { trigger?: string; status?: string; channel?: string }): Promise<AuditEvent[]> {
    return mockDb.filter(e => {
      if (filters?.trigger && e.trigger !== filters.trigger) return false;
      if (filters?.status && e.delivery?.status !== filters.status) return false;
      if (filters?.channel && e.channel !== filters.channel) return false;
      return true;
    });
  }
};