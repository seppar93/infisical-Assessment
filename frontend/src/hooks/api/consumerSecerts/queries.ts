import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { TConsumerSecret } from "./types";

export const consumerSecretsKeys = {
  allConsumerSecrets: () => ["consumerSecrets"] as const,
  specificConsumerSecrets: ({ offset, limit }: { offset: number; limit: number }) =>
    [...consumerSecretsKeys.allConsumerSecrets(), { offset, limit }] as const,
  getSecretById: (arg: { id: string; hashedHex: string | null; password?: string }) => [
    "consumer-secrets",
    arg
  ]
};

export const useGetConsumerSecrets = ({
  offset = 0,
  limit = 25
}: {
  offset: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: consumerSecretsKeys.specificConsumerSecrets({ offset, limit }),
    queryFn: async () => {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit)
      });

      const { data } = await apiRequest.get<{ secrets: TConsumerSecret[]; totalCount: number }>(
        "/api/v1/consumer-secrets/",
        {
          params
        }
      );
      console.log("data =>", data);
        
      return data;
    }
  });
};
