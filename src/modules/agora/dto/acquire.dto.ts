import { IsString,  IsNotEmpty } from "class-validator";

export class AcquireDto {
  @IsNotEmpty()
  @IsString()
  cname: string;

  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsString()
  token: string
}
