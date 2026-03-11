import { Test, TestingModule } from '@nestjs/testing';
import { RuleTemplatesService } from './rule-templates.service';

describe('RuleTemplatesService', () => {
  let service: RuleTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RuleTemplatesService],
    }).compile();

    service = module.get<RuleTemplatesService>(RuleTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
