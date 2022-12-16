import {
    IsNotEmpty,
    IsEmail,
    Matches
  } from 'class-validator';
  
  export class EmailRegisterDTO {
    @IsNotEmpty() @IsEmail() EMAIL: number;
    @IsNotEmpty() PASSWORD: number;
  }
  