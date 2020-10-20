import { HttpException, HttpService, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

import { IAgoraEnvVariables } from "../../interfaces/environment-variables.interface";
import { generateBase64EncodedCredential } from "../../helpers/auth.helper";
import { IAcquire, IAcquireReqBody } from "../../interfaces/acquire.interface";
import { AcquireDto } from "./dto/acquire.dto";

@Injectable()
export class AgoraService {
  private readonly api: string;
  private readonly appId: string;
  private headersRequest;

  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    const { api, appId } = this.configService.get<IAgoraEnvVariables>("agora");
    const auth = generateBase64EncodedCredential(this.configService);

    this.api = api;
    this.appId = appId;
    this.headersRequest = {
      'Content-type': "application/json;charset=utf-8",
      "Authorization": auth
    };
  }

  acquire(body: AcquireDto): Observable<IAcquire> {
    const apiUrl = `${this.api}/v1/apps/${this.appId}/cloud_recording/acquire`;
    const { cname } = body;
    const reqBody: IAcquireReqBody = {
      cname,
      uid: "527841",
      clientRequest: {
        resourceExpiredHour: 1
      }
    };

    return this.httpService.post(apiUrl, reqBody, { headers: this.headersRequest })
      .pipe(
        map(({ data }) => data),
        catchError(err => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST)
        })
      );
  }

  startRecord(resourceid: string, body: AcquireDto): Observable<any> {
    const mode = "individual";
    const apiUrl = `${this.api}/v1/apps/${this.appId}/cloud_recording/resourceid/${resourceid}/mode/${mode}/start`;
    const { cname } = body;

    const reqBody = {
      cname,
      uid: "527841",
      clientRequest: {
        recordingConfig: {
          maxIdleTime: 30,
          channelType: 1,
          streamTypes: 0,
          subscribeUidGroup: 0,
          subscribeAudioUids: ["#allstream#"]
        },
        storageConfig: {
          vendor: 1,
          region: 9,
          bucket: "hyjacktv",
          accessKey: "AKIAJ3LFEEBINGFVQVSA",
          secretKey: "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"
        }
      }
    };

    console.log("reqBody: ", reqBody);

    return this.httpService.post(apiUrl, reqBody, { headers: this.headersRequest })
      .pipe(
        map(({ data }) => data),
        catchError(err => {
          throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        })
      );

  }

  stop(body) {
    const mode = "individual";
    const { cname, uid, resourceid, sid } = body;
    const apiUrl = `${this.api}/v1/apps/${this.appId}/cloud_recording/resourceid/${resourceid}/sid/${sid}/mode/${mode}/stop`;

    const reqBody = {
      cname,
      uid,
      clientRequest: {}
    };
    console.log("stop reqBody: ", reqBody);

    return this.httpService.post(apiUrl, reqBody, { headers: this.headersRequest,  })
      .pipe(
        map(({ data }) => data),
        catchError(err => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST)
        })
      );
  }

  getStatus({ resourceId, sid }) {
    const mode = "individual";
    const apiUrl = `${this.api}/v1/apps/${this.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/${mode}/query`;
    console.log("apiUrl: ", apiUrl);

    return this.httpService.get(apiUrl, { headers: this.headersRequest })
      .pipe(
        map(({ data }) => data),
        catchError(err => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST)
        })
      )
  }

  generateToken(userInfo) {
    const { certificate: appCertificate } = this.configService.get<IAgoraEnvVariables>("agora");
    const { channelName, uid } = userInfo;
    const role = RtcRole.PUBLISHER;
    // console.log('role: ', role);
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(this.appId, appCertificate, channelName, uid, role, privilegeExpiredTs);

    return { token }
  }
}
