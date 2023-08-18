import {
  IsEmail,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class UpdateUserRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  age?: number;
}
