import { Module, forwardRef } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireController } from './questionnaire.controller';

@Module({
  imports: [forwardRef(() => AppModule)],
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService],
})
export class QuestionnaireModule {}
