import { Type } from 'class-transformer';
import {
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MinLength,
} from 'class-validator';
import { PopulateOptions } from 'mongoose';

export class QueryFilterDTO {
    @IsString()
    @MinLength(1)
    @IsOptional()
    select?: string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    populate?: PopulateOptions[];

    @IsString()
    @MinLength(1)
    @IsOptional()
    sort?: string;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    page?: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit?: number;
}