// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { zodBuffer } from "@app/lib/zod";

import { TImmutableDBKeys } from "./models";

export const ConsumerSecretsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  credential_type: z.string(),
  encrypted_secret: zodBuffer.nullable().optional(),
  iv: z.string().nullable().optional(),
  tag: z.string().nullable().optional(),
  metadata: z.unknown(),
  userId: z.string().uuid(),
  orgId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TConsumerSecrets = z.infer<typeof ConsumerSecretsSchema>;
export type TConsumerSecretsInsert = Omit<z.input<typeof ConsumerSecretsSchema>, TImmutableDBKeys>;
export type TConsumerSecretsUpdate = Partial<Omit<z.input<typeof ConsumerSecretsSchema>, TImmutableDBKeys>>;
