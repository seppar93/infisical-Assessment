import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { consumerSecretsKeys } from "./queries";
import { TConsumerSecret, TCreateConsumerSecretRequest } from "./types";

export const useCreateConsumerSecret = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    
    
    mutationFn: async (inputData: TCreateConsumerSecretRequest) => {
      console.log("inputData =>", inputData)
      const { data } = await apiRequest.post<TConsumerSecret>(
        "/api/v1/consumer-secrets",
        inputData
      );
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(consumerSecretsKeys.allConsumerSecrets())
  });
};
