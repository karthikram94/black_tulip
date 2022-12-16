import {
    IsNotEmpty,
    IsInt,
    Min,
    Max,
    Length
} from 'class-validator';
import { Transform } from 'class-transformer';
  
export class UpdateuserDTO {
    @IsNotEmpty() 
    @Length(1,40) 
    NAME:string;

    @Transform(value => Number.isNaN(+value) ? 0 : +value)
    @IsInt()
    @Min(20)
    @Max(80)
    AGE:number;

    @IsNotEmpty()
    GENDER:string;

}
  