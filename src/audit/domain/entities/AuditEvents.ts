export interface AuditEventProps {
  _id: string,
  eventId: string
  trigger: string
  channel?: string
  status?: string
  conversationId?: string
  appUserId?: string
  receivedAt: string
  createdAt: string
  rawPayload: any
}

export class AuditEvent {
  constructor(public props: AuditEventProps) {}

  static create(props: AuditEventProps) {
    if (!props.eventId) throw new Error("eventId is required")
    if (!props.trigger) throw new Error("trigger is required")
    if (!props.receivedAt) props.receivedAt = new Date().toISOString()
    if (!props.createdAt) props.createdAt = new Date().toISOString()

    return new AuditEvent(props)
  }
}