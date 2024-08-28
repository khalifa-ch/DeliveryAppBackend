import { Test, TestingModule } from '@nestjs/testing';
import { EntrepotService } from './entrepot.service';

describe('EntrepotService', () => {
  let service: EntrepotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntrepotService],
    }).compile();

    service = module.get<EntrepotService>(EntrepotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
