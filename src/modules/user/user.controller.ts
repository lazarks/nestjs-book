import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { readdirSync } from 'fs';
import { CheckLoggedInUserGuard } from 'src/shared/guards/check-loggedIn-user.guards';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  @UseGuards(CheckLoggedInUserGuard)
  public async index(@Res() res) {
    let users = await this.userService.findAll();
    return res.status(HttpStatus.OK).json(users);
  }

  @Post('users')
  public async create(@Body() body: any, @Res() res) {
    if (!body && body && Object.keys(body).length === 0) {
      throw new Error('Missing some information.');
    }
    await this.userService.create(body);
    return res.status(HttpStatus.CREATED).send();
  }

  @Get('users/:id')
  @UseGuards(CheckLoggedInUserGuard)
  public async show(@Param() id: number, @Res() res) {
    if (!id) throw new Error('Missing id.');

    let user = await this.userService.findById(id);
    return res.status(HttpStatus.OK).json(user);
  }

  @Put('users/:id')
  @UseGuards(CheckLoggedInGuard)
  public async update(@Param() id: number, @Body() body: any, @Res() res) {
    if (!id) throw new Error('Midding id.');

    await this.userService.update(id, body);
    return res.status(HttpStatus.OK).send();
  }

  @Delete('users/:id')
  @UseGuards(CheckLoggedInUserGuard)
  public async delete(@URLSearchParams() id: number, @Res() res) {
    if (!id) throw new Error('MIssing id.');

    await this.userService.delete(id);
    return res.status(HttpStatus.OK).send();
  }
}
