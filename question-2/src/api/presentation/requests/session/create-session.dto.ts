// src/search/dto/search.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsNumber, Matches } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ example: 'A-ABA-BB1234', description: 'A string in the format A-XXX-XXXXXX (A-Z, 0-9)', required: true })
  @IsString()
  @Matches(/^[A-Z]-[A-Z0-9]{3}-[A-Z0-9]{6}$/, {
    message: 'sessionKey must match format A-XXX-XXXXXX',
  })
  sessionKey: string;

  @ApiProperty({ example: 'RANDOM', description: 'Group (DEFAULT,RANDOM)', required: true })
  @IsString()
  @Transform(({ value }) => value || '')
  group: string;

  @ApiProperty({ example: 60 * 5 * 1000, description: 'Time Inspect', required: true })
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => {
    return value;
  })
  timeInspect: number;



}
