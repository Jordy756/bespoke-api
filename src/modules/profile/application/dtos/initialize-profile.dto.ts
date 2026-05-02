import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';

class ProfileBasicsDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  summary!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;
}

class ProfileExperienceDto {
  @IsString()
  @IsNotEmpty()
  company!: string;

  @IsString()
  @IsNotEmpty()
  position!: string;

  @IsString()
  @IsNotEmpty()
  startDate!: string;

  @IsString()
  @IsNotEmpty()
  endDate!: string;

  @IsArray()
  @IsString({ each: true })
  achievements!: string[];
}

class ProfileEducationDto {
  @IsString()
  @IsNotEmpty()
  institution!: string;

  @IsString()
  @IsNotEmpty()
  area!: string;

  @IsString()
  @IsNotEmpty()
  startDate!: string;

  @IsString()
  @IsNotEmpty()
  endDate!: string;
}

class ProfileCertificateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsNotEmpty()
  issuer!: string;

  @IsArray()
  @IsString({ each: true })
  outcomes!: string[];
}

class ProfileSkillsDto {
  @IsArray()
  @IsString({ each: true })
  frontend!: string[];

  @IsArray()
  @IsString({ each: true })
  backend!: string[];

  @IsArray()
  @IsString({ each: true })
  mobile!: string[];

  @IsArray()
  @IsString({ each: true })
  architecture!: string[];

  @IsArray()
  @IsString({ each: true })
  devops!: string[];

  @IsArray()
  @IsString({ each: true })
  methodologies!: string[];

  @IsArray()
  @IsString({ each: true })
  ia!: string[];

  @IsArray()
  @IsString({ each: true })
  languages!: string[];
}

class ProfileProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @IsString({ each: true })
  technologies!: string[];
}

class ProfileDataDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ProfileBasicsDto)
  basics!: ProfileBasicsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfileExperienceDto)
  experience!: ProfileExperienceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfileEducationDto)
  education!: ProfileEducationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfileCertificateDto)
  certificates!: ProfileCertificateDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => ProfileSkillsDto)
  skills!: ProfileSkillsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfileProjectDto)
  projects!: ProfileProjectDto[];
}

export class InitializeProfileDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ProfileDataDto)
  data!: ProfileDataDto;
}
