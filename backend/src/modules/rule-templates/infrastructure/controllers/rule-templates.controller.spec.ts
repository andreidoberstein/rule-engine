import { Test, TestingModule } from '@nestjs/testing';
import { RuleTemplatesController } from './rule-templates.controller';

describe('RuleTemplatesController', () => {
  let controller: RuleTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuleTemplatesController],
    }).compile();

    controller = module.get<RuleTemplatesController>(RuleTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
