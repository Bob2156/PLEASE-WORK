// api/discord.js
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { verifyKey } from 'discord-interactions';

export default async function handler(req, res) {
  // Verify the request came from Discord
  const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY; // Add your public key to environment variables
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const rawBody = await getRawBody(req);

  const isVerified = verifyKey(rawBody, signature, timestamp, PUBLIC_KEY);
  if (!isVerified) {
    return res.status(401).send('Invalid request signature');
  }

  // Handle Discord interactions
  const interaction = JSON.parse(rawBody);

  if (interaction.type === InteractionType.PING) {
    return res.json({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    if (interaction.data.name === 'check') {
      return res.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Working!',
        },
      });
    }
  }

  res.status(400).send('Unhandled interaction type');
}

// Helper function to get raw body
async function getRawBody(req) {
  let chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8
