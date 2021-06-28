import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';

@Module({
  imports: [QuestionnaireModule],
  exports: [AppService],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
