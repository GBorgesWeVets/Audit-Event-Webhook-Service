import { AuditEvent } from "../entities/AuditEvents"

export class AuditEventRepository {
  private events: AuditEvent[] = []

  async save(event: AuditEvent) {
    this.events.push(event)
    console.log("Mock saved event:", event.props.eventId)
  }

  async getAll() {
    return this.events
  }
}