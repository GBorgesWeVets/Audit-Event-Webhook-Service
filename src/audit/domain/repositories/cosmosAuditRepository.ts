import { Container } from "@azure/cosmos";
import { v4 as uuid } from "uuid";
import { AuditEventPayload } from "../entities/AuditEventPayload";
import { AuditEvent } from "../entities/AuditEvents";

export class CosmosAuditRepository {
  constructor(private container: Container) {}

  async save(payload: AuditEventPayload): Promise<AuditEvent> {
    const event: AuditEvent = {
      _id: uuid(), // interno
      id: uuid(),  // Cosmos precisa de "id"
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

    await this.container.items.create(event);
    return event;
  }

  async find(filters?: {
    trigger?: string;
    status?: string;
    channel?: string;
  }): Promise<AuditEvent[]> {
    let query = "SELECT * FROM c WHERE 1=1";
    const parameters: any[] = [];

    if (filters?.trigger) {
      query += " AND c.trigger = @trigger";
      parameters.push({ name: "@trigger", value: filters.trigger });
    }

    if (filters?.status) {
      query += " AND c.delivery.status = @status";
      parameters.push({ name: "@status", value: filters.status });
    }

    if (filters?.channel) {
      query += " AND c.channel = @channel";
      parameters.push({ name: "@channel", value: filters.channel });
    }

    const { resources } = await this.container.items
      .query({ query, parameters })
      .fetchAll();

    return resources as AuditEvent[];
  }
}