import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from '@nestjs/microservices';
import { AuthenticationDto } from './authentication.dto';
import { UserDto } from './user.dto';

@Injectable()
export class AppService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: 'redis://localhost:6379',
        retryAttempts: 10,
        retryDelay: 3000, // in miliseconds
      },
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  public async validAauthentication(headers: any) {
    const authenticationDto = {
      token: headers.token,
      user: headers.user,
    };

    const user = await this.client
      .send<any, AuthenticationDto>('AUTH_valid_user', authenticationDto)
      .toPromise();

    if (!user) {
      throw new HttpException(`您沒有此操作權限!`, HttpStatus.UNAUTHORIZED);
    }

    return UserDto.from(user);
  }

  public async getUsersRelation(users: string[]) {
    const usersData = await this.client
      .send<any, string[]>('AUTH_get_user_relation', users)
      .toPromise();

    return usersData;
  }

  public async getClassroomsRelation(classrooms: string[]) {
    const classroomsData = await this.client
      .send<any, string[]>('CONTENT_get_classroom_relation', classrooms)
      .toPromise();

    return classroomsData;
  }

  public async getQuestionnaire(questionnaire: string) {
    const questionnairesResult = await this.client
      .send<any, string>(
        'QUESTIONNAIRE_get_questionnaire_result',
        questionnaire,
      )
      .toPromise();

    return questionnairesResult;
  }
}
