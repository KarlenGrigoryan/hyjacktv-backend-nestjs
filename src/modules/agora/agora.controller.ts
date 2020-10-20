import { Body, Controller, Post } from "@nestjs/common";

import { AcquireDto } from "./dto/acquire.dto";
import { AgoraService } from "./agora.service";

@Controller("agora")
export class AgoraController {
  constructor(private readonly agoraService: AgoraService) {
  }

  @Post("start")
  async startRecord(@Body() acquire: AcquireDto) {
    const { resourceId } = await this.agoraService.acquire(acquire).toPromise();

    return this.agoraService.startRecord(resourceId, acquire);
  }

  @Post("stop")
  stop(@Body() body: any) {
    return this.agoraService.stop(body);
  }

  @Post("status")
  getStatus(@Body() info: any) {
    return this.agoraService.getStatus(info)
  }

  @Post("get-token")
  getToken(@Body() clientInfo: any) {
    return this.agoraService.generateToken(clientInfo);
  }
}
