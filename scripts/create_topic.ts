
// Usage: npx tsx scripts/create_topic.ts
import { Client, TopicCreateTransaction, AccountId, PrivateKey } from "@hashgraph/sdk";
import dotenv from "dotenv";
import path from "path";

// Load .env.local manually since we are outside Next.js context
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function main() {
  const operatorId = process.env.HEDERA_OPERATOR_ID;
  const operatorKey = process.env.HEDERA_OPERATOR_KEY; // Hex encoded or DER

  if (!operatorId || !operatorKey) {
    throw new Error("❌ HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY must be in .env.local");
  }

  console.log("🔗 Connecting to Hedera Testnet...");
  console.log(`👤 Operator: ${operatorId}`);

  // Auto-detect key format (Der or Hex)
  const client = Client.forTestnet();
  client.setOperator(
    AccountId.fromString(operatorId),
    PrivateKey.fromString(operatorKey)
  );

  console.log("🚀 Creating new HCS Topic for Veritas Terminal...");
  
  const transaction = await new TopicCreateTransaction()
    .setTopicMemo("VERITAS-TERMINAL-LOGS-V1")
    .execute(client);

  const receipt = await transaction.getReceipt(client);
  const topicId = receipt.topicId;

  console.log(`
✅ SUCCESS! HCS Topic Created.
------------------------------------------------
TOPIC ID: ${topicId}
------------------------------------------------

👇 ADD THIS TO YOUR .env.local:
HEDERA_TOPIC_ID=${topicId}
  `);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
