import { z } from "zod";

import { ConsumerSecretsSchema } from "@app/db/schemas";
import { readLimit, writeLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { AuthMode } from "@app/services/auth/auth-type";

export const registerConsumerSecretRouter = async (server: FastifyZodProvider) => {
  server.route({
    method: "GET",
    url: "/",
    config: {
      rateLimit: readLimit
    },
    schema: {
      querystring: z.object({
        offset: z.coerce.number().min(0).max(100).default(0),
        limit: z.coerce.number().min(1).max(100).default(25)
      }),
      response: {
        200: z.object({
          secrets: z.array(ConsumerSecretsSchema),
          totalCount: z.number()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { secrets, totalCount } = await req.server.services.consumerSecrets.getConsumerSecrets({
        actor: req.permission.type,
        actorId: req.permission.id,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        ...req.query
      });

      return {
        secrets,
        totalCount
      };
    }
  });

  server.route({
    method: "POST",
    url: "/",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      body: z.object({
        name: z.string().max(50),
        credential_type: z.enum(["WEB_LOGIN", "CREDIT_CARD", "SECURE_NOTE"]),
        encrypted_secret: z.string().trim(),
        iv: z.string().trim()
      }),
      response: {
        200: z.object({ id: z.string() })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const consumerSecret = await req.server.services.consumerSecrets.createConsumerSecret({
        actor: req.permission.type,
        actorId: req.permission.id,
        orgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        name: req.body.name,
        encrypted_secret: req.body.encrypted_secret,
        credential_type: req.body.credential_type,
        iv: req.body.iv
      });

      return { id: consumerSecret.id };
    }
  });
};
