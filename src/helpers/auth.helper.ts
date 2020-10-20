import { ConfigService } from "@nestjs/config";

import { IAgoraEnvVariables } from "../interfaces/environment-variables.interface";

export const generateBase64EncodedCredential = (configService: ConfigService) => {
  const { key, secret } = configService.get<IAgoraEnvVariables>("agora");

  return "Basic " + new Buffer(`${key}:${secret}`).toString("base64");
};
