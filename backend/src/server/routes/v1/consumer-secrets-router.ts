import { z } from "zod";

import { ConsumerSecretsSchema } from "@app/db/schemas";
import { readLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { AuthMode } from "@app/services/auth/auth-type";

export const registerConsumerSecretsRouter = async (server: FastifyZodProvider) => {

};
