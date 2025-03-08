// src/search/dto/search.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsNumber, Matches, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'A-ABA-BB1234', description: 'A string in the format A-XXX-XXXXXX (A-Z, 0-9)', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Z]-[A-Z0-9]{3}-[A-Z0-9]{6}$/, {
    message: 'sessionKey must match format A-XXX-XXXXXX',
  })
  sessionKey: string;

  @ApiProperty({ example: 'RANDOM', description: 'Group (DEFAULT,RANDOM)', required: true })
  @IsString()
  @Transform(({ value }) => value || '')
  group: string;

  @ApiProperty({ example: 10 * 1000, description: 'Time complete task', required: true })
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => {
    return value;
  })
  timeInspect: number;



}
