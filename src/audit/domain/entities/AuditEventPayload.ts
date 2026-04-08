export interface AuditEventPayload {
  eventId?: string;
  trigger: string;
  channel?: string;
  delivery?: {
    status?: string;
  };
  hmacValid?: boolean | null;
  receivedAt?: string;
  [key: string]: any; // aceita campos extras como rawPayload
}