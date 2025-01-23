import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { GetUserUseCase } from '../../domain/use_cases/user/get_user';
import { Response } from 'express';
import { getError, getValue, isFailure } from 'src/core/result';
import { DeleteUserUseCase } from '../../domain/use_cases/user/delete_user';
import {
  CreateUserMessage,
  CreateUserUseCase,
} from 'src/modules/user/domain/use_cases/user/create_user';
import { CreateUserRequest } from './CreateUserRequest';
import { CreateUseReponse } from './CreateUseReponse';
import {
  UpateUserMessage,
  UpdateUserUseCase,
} from 'src/modules/user/domain/use_cases/user/update_user';
import { UpdateUserRequest } from './UpdateUserRequest';

@Controller('/users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
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
    }

    const value = getValue(getResult);
    response.status(200).json(value);
  }

  @Post()
  async addUser(@Body() body: CreateUserRequest, @Res() response: Response) {
    const createUserMessage: CreateUserMessage = { ...body };
    const addResult = await this.createUserUseCase.execute(createUserMessage);

    if (isFailure(addResult)) {
      const err = getError(addResult);
      response.status(400).json(err);
    }

    const user = getValue(addResult);
    const userResponse = new CreateUseReponse(user!);

    response.status(201).json(userResponse);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserRequest,
    @Res() response: Response,
  ) {
    console.log('body:', body);
    const message: UpateUserMessage = { id: id, ...body };
    const updateResult = await this.updateUserUseCase.execute(message);

    if (isFailure(updateResult)) {
      const err = getError(updateResult);
      response.status(400).json(err);
    }

    response.sendStatus(200);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string, @Res() response: Response) {
    const deleteResult = await this.deleteUserUseCase.execute(id);

    if (isFailure(deleteResult)) {
      const err = getError(deleteResult);
      response.status(400).json(err);
    }

    response.sendStatus(200);
  }
}
