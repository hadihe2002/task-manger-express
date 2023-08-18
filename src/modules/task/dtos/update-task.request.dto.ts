import { IsOptional, IsString, IsBoolean } from "class-validator";

export class UpdateTaskRequestDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
