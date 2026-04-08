import { cosmosClient } from "./cosmosClient";

const DATABASE_NAME = "audit-db";
const CONTAINER_NAME = "events";

export async function initCosmos() {
  const { database } = await cosmosClient.databases.createIfNotExists({
    id: DATABASE_NAME,
  });

  const { container } = await database.containers.createIfNotExists({
    id: CONTAINER_NAME,
    partitionKey: {
      paths: ["/trigger"], 
    },
  });

  return container;
}