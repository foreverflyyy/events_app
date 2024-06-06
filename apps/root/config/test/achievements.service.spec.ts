import {Test} from "@nestjs/testing";
import {AchievementsService} from "../services/achievements.service";
import {Achievement, AchievementDocument} from "../../../../../libs/common/src/database/schemas";
import mongoose, {FilterQuery, Model} from "mongoose";
import {achievementStub} from "./achievement.stub";
import {getModelToken} from "@nestjs/mongoose";

describe("AchievementsService", () => {
  // let achievementRepository: AchievementRepository;
  let achievementModel: Model<AchievementDocument>;
  let achievementService: AchievementsService;
  let userFilterQuery: FilterQuery<Achievement>;

  const mockAchievementRepository = {
    find: jest.fn().mockImplementation(() => [achievementStub()]),
    getById: jest.fn().mockImplementation((id) => {
      const {_id, ...other} = achievementStub()
      return {
        _id: new mongoose.Types.ObjectId(id),
        ...other
      };
    }),
    create: jest.fn().mockImplementation(dto => ({
      _id: achievementStub()._id,
      ...dto
    })),
    updateAchievement: jest.fn().mockImplementation((id, dto) => {
      const {_id, ...other} = achievementStub();
      return {
        _id: new mongoose.Types.ObjectId(id),
        ...other,
        ...dto
      }
    }),
    deleteAchievement: jest.fn().mockImplementation((id) => {})
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(Achievement.name), useValue: Model },
        AchievementsService,
        // AchievementRepository,
        // {provide: getRepositoryToken(Achievement), useValue: mockAchievementRepository}
      ]
    }).compile();

    achievementService = module.get<AchievementsService>(AchievementsService);
    achievementModel = module.get<Model<AchievementDocument>>(getModelToken(Achievement.name));
    // achievementRepository = module.get<AchievementRepository>(AchievementRepository);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(achievementModel).toBeDefined();
    expect(achievementService).toBeDefined();
  });

  it("get achievement by id", async () => {
    const achievement = new Achievement();
    const id = "660718e9979c5b9475d21e22";

    const spy = jest
      .spyOn(achievementModel, "findById")
      .mockResolvedValue(achievement as AchievementDocument);

    await achievementService.getAchievementById(id);
    expect(spy).toBeCalled();
  });

  it("get achievements", async () => {
    const achievement = new Achievement();

    const spy = jest
      .spyOn(achievementModel, "find")
      .mockResolvedValue([achievement as AchievementDocument]);

    await achievementService.getAchievements();
    expect(spy).toBeCalled();
  })

  /*describe("create new achievement", () => {
    let user: Achievement;
    let saveSpy: jest.SpyInstance;
    let constructorSpy: jest.SpyInstance;

    beforeEach(async () => {
      saveSpy = jest.spyOn(AchievementModel.prototype, 'save');
      constructorSpy = jest.spyOn(AchievementModel.prototype, 'constructorSpy');
      user = await achievementModel.create(achievementStub());
    })

    test('then it should call the userModel', () => {
      expect(saveSpy).toHaveBeenCalled();
      expect(constructorSpy).toHaveBeenCalledWith(achievementStub())
    })

    test('then it should return a user', () => {
      expect(user).toEqual(achievementStub());
    })
  });*/
})