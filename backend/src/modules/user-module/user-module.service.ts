import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Users from '../../models/users.model';
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
import { ConfigService } from 'nestjs-dotenv';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserModuleService {
  constructor(
    private readonly configService: ConfigService
  ){}

    async getAllDetails(userid=null){
    try{
        const wherecondition:any = {
          USERROLEId:2
        }
        if(userid){
          wherecondition.id = userid
        }
        const userDetails:any = await Users.findAll({
        where:{
          ...wherecondition
        }
        })
        return {
            data:userDetails,
            status:200
        }
    } catch (error) {
      throw new HttpException(
        { message: error.message || `Something went wrong`, error: error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  async registeremail(body:any){
    try{
        const {EMAIL,PASSWORD} = body;
        const data = {EMAIL,PASSWORD:await bcrypt.hash(PASSWORD,10)}
        console.log({data})
        const builddata = await Users.build(data);
        await builddata.save();
        return {
            status:200,
            message:'success'
        }
    } catch (error) {
      throw new HttpException(
        { message: error.message || `Something went wrong`, error: error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signupuser(body:any){
    try{
      const {EMAIL,PASSWORD} = body;
      const findUser:any = await Users.findOne({
        where:{
          EMAIL
        }
      });
      if(findUser.STATUS !== 'verified' && findUser.USERROLEId === 2){
        throw Error(`User not approved`);           
      }
      if(findUser){
        const pwdcheck = await bcrypt.compare(PASSWORD,findUser.PASSWORD)
        if(!pwdcheck){
          throw Error(`Invalid password`);          
        }
      }else{
        throw Error(`Invalid email id`);
      }
      const {
        id,NAME,AGE,EMAIL:em,GENDER,USERROLEId,STATUS
      } = findUser;
      const tdata = {
        id,NAME,AGE,EMAIL:em,GENDER,USERROLEId,STATUS
      }
      const token:any = await jwt.sign({data:tdata}, this.configService.get('JWT_SECRET_KEY') , {
        expiresIn: '31m',
      });
        return {
            data:findUser,
            token,
            status:200,
            message:'success'
      }
    } catch (error) {
      throw new HttpException(
        { message: error.message || `Something went wrong`, error: error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateuserdetails(body:any,user:any,file:any){
    try{
      const cdata:any = {...body};
      if(file && file.buffer){
        cdata.PROFILE = Buffer.from(file.buffer)
      }
      await Users.update(cdata,{
        where:{
            id:user.id
        }
      })
      return {
            status:200,
            message:'success'
      }
    } catch (error) {
      throw new HttpException(
        { message: error.message || `Something went wrong`, error: error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  async updateuserstatus(body:any,user:any){
    try{
      const {STATUS,id} = body;
      await Users.update({
        STATUS
      },{
        where:{
            id
        }
      })
      return {
        status:200,
        message:'success'
      }
    } catch (error) {
      throw new HttpException(
        { message: error.message || `Something went wrong`, error: error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  async sendpasswordlink(body:any){
    let transporter = nodemailer.createTransport({
      host: this.configService.get('NODEMAILER_HOST'),
      port: this.configService.get('NODEMAILER_PORT'),
      secure: true,
      auth: {
          user: this.configService.get('NODEMAILER_AUTH_USER'),
          pass: this.configService.get('NODEMAILER_AUTH_PASS'),
      },
      tls: {
          rejectUnauthorized: false
      },
    });
    try{
      const {EMAIL} = body;
      const userExists:any = await Users.findOne({
        where:{
          EMAIL
        }
      })

      console.log({
        userExists
      })

      if(!userExists){
        throw Error(`User email not exists`);
      }
      const {
        id,NAME,AGE,EMAIL:em,GENDER,USERROLEId,STATUS
      } = userExists;
      const tdata = {
        id,NAME,AGE,EMAIL:em,GENDER,USERROLEId,STATUS
      }
      console.log({
        em
      })
      const token:any = await jwt.sign({data:tdata}, this.configService.get('JWT_SECRET_KEY'), {
        expiresIn: '31m',
      });
      const url:any = `http://localhost:3000/forgotpassword?token=${token}`;

      let info = await transporter.sendMail({
        from: this.configService.get('NODEMAILER_FROM'),
        to: em,
        subject: 'Reset password' || '',
        text: '' || '',
        html: `<a href=${url} target="_blank" style="text-decoration: none;background: lightblue;padding: 4px 7px;border-radius: 6px;color: black;">Reset Password Link</a>`,
    });
    return info;
    } catch (error) {
      throw new HttpException(
        { message: error.message || `Something went wrong`, error: error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updatepasswordbylink(body){
    try{
      const {id,PASSWORD} = body;
      await Users.update({PASSWORD:await bcrypt.hash(PASSWORD,10)},{
        where:{
            id
        }
      })
      return {
        message:'success',
        status:200
      }
    } catch (error) {
      throw new HttpException(
        { message: error.message || `Something went wrong`, error: error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteuser(){
    try{
      await Users.destroy({
        truncate:true
      })
        return {
            status:200,
            message:'success'
        }
    } catch (error) {
      throw new HttpException(
        { message: error.message || `Something went wrong`, error: error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
