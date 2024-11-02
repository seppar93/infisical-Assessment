import { TConsumerSecretDALFactory } from "./consumer-secret-dal";
import {
  TCreateConsumerSecretDTO,
  TGetConsumerSecretsDTO,
  TUpdateConsumerSecretDTO,
  TDeleteConsumerSecretDTO
} from "./consumer-secret-types";

export const consumerSecretServiceFactory = ({
  consumerSecretDAL
}: {
  consumerSecretDAL: TConsumerSecretDALFactory;
}) => {
  return {
    getConsumerSecrets,
    updateConsumerSecret,
    createConsumerSecret,
    deleteConsumerSecretById
  };
};
