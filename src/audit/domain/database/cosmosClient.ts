import { CosmosClient } from "@azure/cosmos"
import "dotenv/config";


export const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT!,
  key: process.env.COSMOS_KEY!,
})

export const database = cosmosClient.database("audit-db")
export const container = database.container("audit-events")