import { IsOptional, IsString } from "class-validator";
import { QueryFilterDTO } from "src/common/global-dtos/query.dto";

export class BrandQueryDto extends QueryFilterDTO {
    @IsString()
    @IsOptional()
    name?: string;
}

