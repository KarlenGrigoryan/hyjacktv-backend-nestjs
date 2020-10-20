export interface IAgoraEnvVariables {
  api: string,
  appId: string,
  certificate: string,
  key: string,
  secret: string
}

export interface IEnvironmentVariables {
  port: number,
  agora: IAgoraEnvVariables
}
