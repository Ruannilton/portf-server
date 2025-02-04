import { Body, Controller, Delete, Get, Param, Put, Res } from '@nestjs/common';
import { GetUserUseCase } from '../../domain/use_cases/user/get_user';
import { Response } from 'express';
import { getError, getValue, isFailure } from 'src/core/result';
import { DeleteUserUseCase } from '../../domain/use_cases/user/delete_user';
import {
  UpateUserMessage,
  UpdateUserUseCase,
} from 'src/modules/user/domain/use_cases/user/update_user';
import { UpdateUserRequest } from './UpdateUserRequest';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/users')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get('/:id')
  async getUser(@Param('id') id: string, @Res() response: Response) {
    const getResult = await this.getUserUseCase.execute(id);

    if (isFailure(getResult)) {
      const err = getError(getResult);
      response.status(400).json(err);
      return;
    }

    const value = getValue(getResult);
    response.status(200).json(value);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserRequest,
    @Res() response: Response,
  ) {
    const message: UpateUserMessage = { id: id, ...body };
    const updateResult = await this.updateUserUseCase.execute(message);

    if (isFailure(updateResult)) {
      const err = getError(updateResult);
      response.status(400).json(err);
      return;
    }

    response.sendStatus(200);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string, @Res() response: Response) {
    const deleteResult = await this.deleteUserUseCase.execute(id);

    if (isFailure(deleteResult)) {
      const err = getError(deleteResult);
      response.status(400).json(err);
      return;
    }

    response.sendStatus(200);
  }
}
