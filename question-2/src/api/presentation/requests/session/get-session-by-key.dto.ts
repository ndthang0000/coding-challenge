// src/search/dto/search.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class GetSessionByKeyDto {

  @ApiProperty({ example: 'A-ABA-BB1234', description: 'Format A-XXX-XXXXXX (A-Z, 0-9)', required: true })
  @IsString()
  @Transform(({ value }) => value || '')
  sessionKey: string;


}
