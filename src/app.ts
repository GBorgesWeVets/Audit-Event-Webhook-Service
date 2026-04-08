import Fastify from "fastify";
import { initCosmos } from "./audit/domain/database/cosmosSetup";
import { CosmosAuditRepository } from "./audit/domain/repositories/cosmosAuditRepository";
import { registerWebhookRoutes } from "./audit/domain/infrastructure/http/WebhookRoutes";

export const app = Fastify({ logger: true });

async function buildApp() {
  const container = await initCosmos();

  const cosmosRepo = new CosmosAuditRepository(container);

  // 🔥 injeta o repo nas rotas
  registerWebhookRoutes(app, cosmosRepo);
}

buildApp();