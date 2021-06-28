import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from 'src/app.service';
import { QuestionnaireService } from './questionnaire.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(
    private readonly questionnaireService: QuestionnaireService,
    private readonly appService: AppService,
  ) {}

  @Get('report/:id')
  public async report(@Req() req, @Param('id') id: string) {
    const user = await this.appService.validAauthentication(req.headers);
    const questionnaireResult = await this.appService.getQuestionnaire(id);

    if (
      user._id !== questionnaireResult.assignee &&
      user._id !== questionnaireResult.assigner
    ) {
      throw new HttpException(
        `您沒有權限查看此問卷結果`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const [assignee, assigner] = await this.appService.getUsersRelation([
      questionnaireResult.assignee,
      questionnaireResult.assigner,
    ]);

    questionnaireResult.assignee = assignee;
    questionnaireResult.assigner = assigner;

    const result = {
      questionnaireResult,
      total: questionnaireResult.questionnaire.questions.length,
      totalChecked: questionnaireResult.answers.length,
      Theorist: 0,
      Pragmatist: 0,
      Activist: 0,
      Reflector: 0,
    };
    const performance = {
      Theorist: '',
      Pragmatist: '',
      Activist: '',
      Reflector: '',
    };

    const checkedTypes = questionnaireResult.answers.map(
      answer => questionnaireResult.questionnaire.questions[answer].type,
    );

    result['Activist'] = checkedTypes.filter(
      type => type === 'Activist',
    ).length;
    result['Reflector'] = checkedTypes.filter(
      type => type === 'Reflector',
    ).length;
    result['Theorist'] = checkedTypes.filter(
      type => type === 'Theorist',
    ).length;
    result['Pragmatist'] = checkedTypes.filter(
      type => type === 'Pragmatist',
    ).length;

    if (result['Activist'] > 12) {
      performance.Activist = 'Very strong';
    } else if (result['Activist'] > 10) {
      performance.Activist = 'Strong';
    } else if (result['Activist'] > 6) {
      performance.Activist = 'Moderate';
    } else if (result['Activist'] > 3) {
      performance.Activist = 'Low';
    } else {
      performance.Activist = 'Very low';
    }

    if (result['Reflector'] > 17) {
      performance.Reflector = 'Very strong';
    } else if (result['Reflector'] > 14) {
      performance.Reflector = 'Strong';
    } else if (result['Reflector'] > 11) {
      performance.Reflector = 'Moderate';
    } else if (result['Reflector'] > 8) {
      performance.Reflector = 'Low';
    } else {
      performance.Reflector = 'Very low';
    }

    if (result['Theorist'] > 15) {
      performance.Theorist = 'Very strong';
    } else if (result['Theorist'] > 13) {
      performance.Theorist = 'Strong';
    } else if (result['Theorist'] > 10) {
      performance.Theorist = 'Moderate';
    } else if (result['Theorist'] > 7) {
      performance.Theorist = 'Low';
    } else {
      performance.Theorist = 'Very low';
    }

    if (result['Pragmatist'] > 16) {
      performance.Pragmatist = 'Very strong';
    } else if (result['Pragmatist'] > 14) {
      performance.Pragmatist = 'Strong';
    } else if (result['Pragmatist'] > 11) {
      performance.Pragmatist = 'Moderate';
    } else if (result['Pragmatist'] > 8) {
      performance.Pragmatist = 'Low';
    } else {
      performance.Pragmatist = 'Very low';
    }

    // Dataset
    const verticalBarDataset = {
      labels: ['是', '否'],
      datasets: [
        {
          label: '作答比率',
          data: [result.totalChecked, result.total - result.totalChecked],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1,
        },
      ],
    };

    const pieDataset = {
      labels: ['Activist', 'Reflector', 'Theorist', 'Pragmatist'],
      datasets: [
        {
          label: '題',
          data: [
            result['Activist'],
            result['Reflector'],
            result['Theorist'],
            result['Pragmatist'],
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return {
      questionnaireResult,
      performance,
      verticalBarDataset,
      pieDataset,
    };
  }

  // @Post()
  // create(@Body() createQuestionnaireDto: CreateQuestionnaireDto) {
  //   return this.questionnaireService.create(createQuestionnaireDto);
  // }

  // @Get()
  // findAll() {
  //   return this.questionnaireService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.questionnaireService.findOne(+id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateQuestionnaireDto: UpdateQuestionnaireDto) {
  //   return this.questionnaireService.update(+id, updateQuestionnaireDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.questionnaireService.remove(+id);
  // }
}
