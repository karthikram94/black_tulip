import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Query,
    Delete,
    Req,
    UseInterceptors,
    Body,
    UseGuards,
} from '@nestjs/common';
import {
  UploadedFile,
} from '@nestjs/common/decorators/http/route-params.decorator';

import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../../auth/authenticate.guard';
import { EmailRegisterDTO } from '../../dto/users/emailregister.dto';
import { UpdateuserDTO } from '../../dto/users/register.dto';
import {UserModuleService} from './user-module.service';

@Controller('user-module')
export class UserModuleController {
    constructor(
        private userService:UserModuleService
    ){}

    @Get('/')
    async getAllUserDetails(
        @Query() queryparam: any,
        @Req() req,    
    ){
        try {
            return await this.userService.getAllDetails();
          } catch (error) {
            throw new HttpException(
              { message: error.message || `Something went wrong`, error: error },
              HttpStatus.BAD_REQUEST,
            );
          }
    }

    @Get('/getuser/:userid')
    async getParticularUserDetail(
      @Param('userid') userid:any
    ){
      try {
        return await this.userService.getAllDetails(userid);
      } catch (error) {
        throw new HttpException(
          { message: error.message || `Something went wrong`, error: error },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    @Post('/registeremail')
    async registeremail(
        @Body() body:EmailRegisterDTO
    ){
        try {
            return await this.userService.registeremail(body);
          } catch (error) {
            throw new HttpException(
              { message: error.message || `Something went wrong`, error: error },
              HttpStatus.BAD_REQUEST,
            );
          }
    }


    @Post('/signupuser')
    async signupuser(
      @Body() body:any
    ){
        try {
            return await this.userService.signupuser(body);
          } catch (error) {
            throw new HttpException(
              { message: error.message || `Something went wrong`, error: error },
              HttpStatus.BAD_REQUEST,
            );
          }
    }


    @Post('/updateuserdetails')
    @UseGuards(new AuthGuard())
    @UseInterceptors(FileInterceptor('profile'))
    async updateuserdetails(
      @Req() req,
      @Body() body: UpdateuserDTO,
      @UploadedFile() file,
    ){
      const user:any = req.user.data;
      try {
        return await this.userService.updateuserdetails(body,user,file);
      } catch (error) {
        throw new HttpException(
          { message: error.message || `Something went wrong`, error: error },
          HttpStatus.BAD_REQUEST,
        );
      }
    }


    @Post('/updateuserstatus')
    @UseGuards(new AuthGuard())
    async updateuserstatus(
      @Req() req,
      @Body() body: any,
    ){
      const user:any = req.user.data;
      try {
        return await this.userService.updateuserstatus(body,user);
      } catch (error) {
        throw new HttpException(
          { message: error.message || `Something went wrong`, error: error },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    @Post('/sendpasswordlink')
    async sendpasswordlink(
      @Body() body: any,
    ){
      try {
        return await this.userService.sendpasswordlink(body);
      } catch (error) {
        throw new HttpException(
          { message: error.message || `Something went wrong`, error: error },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    @Post('/updatepasswordbylink')
    async updatepasswordbylink(
      @Body() body: any,
    ){
      try {
        return await this.userService.updatepasswordbylink(body);
      } catch (error) {
        throw new HttpException(
          { message: error.message || `Something went wrong`, error: error },
          HttpStatus.BAD_REQUEST,
        );
      }
    }


    @Delete('/delete')
    async deleteuser(){
      try {
        return await this.userService.deleteuser();
      } catch (error) {
        throw new HttpException(
          { message: error.message || `Something went wrong`, error: error },
          HttpStatus.BAD_REQUEST,
        );
      }

    }


}
