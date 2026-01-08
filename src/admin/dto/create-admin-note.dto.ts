import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminNoteDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
