import { Test, TestingModule } from '@nestjs/testing';
import { EntrepotController } from './entrepot.controller';

describe('EntrepotController', () => {
  let controller: EntrepotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntrepotController],
    }).compile();

    controller = module.get<EntrepotController>(EntrepotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
