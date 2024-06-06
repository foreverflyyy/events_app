import {AchievementsController} from "../controllers/achievements.controller";
import {Test} from "@nestjs/testing";
import {AchievementsService} from "../services/achievements.service";
import {CreateAchievementDto, UpdateAchievementDto} from "../dto";
import {Achievement} from "../../../../../libs/common/src/database/schemas";
import {achievementStub} from "./achievement.stub";
import mongoose from "mongoose";

jest.mock("../achievements.service");

interface BaseResponse<T> {
  code: number,
  data: T
}

describe("AchievementsController", () => {
  let achievementController: AchievementsController;
  let achievementService: AchievementsService;

  const mockAchievementsService = {
    getAchievements: jest.fn(() => [achievementStub()]),
    getAchievementById: jest.fn((id) => ({
      _id: new mongoose.Types.ObjectId(id),
      name: achievementStub().name,
      code: achievementStub().code,
      mainImage: achievementStub().mainImage
    })),
    createAchievement: jest.fn((dto) => {
      return {...achievementStub(), ...dto};
    }),
    updateAchievement: jest.fn((id, dto) => {
      const {_id, ...other} = achievementStub();
      return {_id: id, ...other, ...dto};
    }),
    deleteAchievement: jest.fn((id) => {}),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [AchievementsController],
      providers: [AchievementsService]
    })
      .overrideProvider(AchievementsService)
      .useValue(mockAchievementsService)
      .compile();

    achievementController = module.get<AchievementsController>(AchievementsController);
    achievementService = module.get<AchievementsService>(AchievementsService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(achievementController).toBeDefined();
    expect(achievementService).toBeDefined();
  })

  describe('getAchievement', () => {
    describe('when getAchievement is called', () => {
      let response: BaseResponse<Achievement>;

      beforeEach(async () => {
        response = (await achievementController
          .getAchievementById(String(achievementStub()._id))) as BaseResponse<Achievement>;
      })

      test('then it should call achievementService', () => {
        expect(achievementService.getAchievementById)
          .toHaveBeenCalledWith(String(achievementStub()._id));
      })

      test('then is should return a achievement', () => {
        expect(response).toEqual({
          code: 1,
          data: {
            _id: expect.any(mongoose.Types.ObjectId),
            // _id: expect.any(String),
            name: expect.any(String),
            code: expect.any(String),
            mainImage: expect.any(String)
          }
        });
      })
    })
  })

  describe('getAchievements', () => {
    describe('when getUsers is called', () => {
      let response: BaseResponse<Achievement[]>;
      const expectedAchievementStructure = {
        _id: expect.any(mongoose.Types.ObjectId),
        name: expect.any(String),
        code: expect.any(String),
        mainImage: expect.any(String)
      }

      beforeEach(async () => {
        response = await achievementController.getAchievements();
      })

      test('then it should call achievementService', () => {
        expect(achievementService.getAchievements).toHaveBeenCalled()
      })

      test('then it should return achievements', () => {
        expect(response).toEqual({code: 1, data: expect.any(Array)});

        response.data.forEach((achievement) => {
          expect(achievement).toEqual(expect.objectContaining(expectedAchievementStructure))
        })
      })
    })
  })

  describe('createAchievement', () => {
    describe('when createAchievement is called', () => {
      let createAchievementDto: CreateAchievementDto;
      let response: BaseResponse<Achievement>;

      beforeEach(async () => {
        createAchievementDto = {
          name: achievementStub().name,
          code: achievementStub().code
        }

        response = await achievementController.createAchievement(createAchievementDto);
      })

      test('then it should call achievementService', () => {
        expect(achievementService.createAchievement)
          .toHaveBeenCalledWith(createAchievementDto);
      })

      const {_id, ...other} = achievementStub();
      test('then it should return a achievement', () => {
        expect(response).toEqual({
          code: 1,
          data: {
            _id: expect.any(mongoose.Types.ObjectId),
            ...other,
            ...createAchievementDto
          }
        })
      })
    })
  })

  describe('updateAchievement', () => {
    describe('when updateUser is called', () => {
      let response: BaseResponse<Achievement>;
      let updateAchievementDto: UpdateAchievementDto;

      beforeEach(async () => {
        updateAchievementDto = {
          name: "Achievement2",
          code: "achievement2"
        }

        response = (await achievementController.updateAchievement(
          String(achievementStub()._id),
          updateAchievementDto
        )) as BaseResponse<Achievement>;
      })

      test('then it should call achievementService', () => {
        expect(achievementService.updateAchievement).toHaveBeenCalledWith(
          String(achievementStub()._id),
          updateAchievementDto
        );
      })

      test('then it should return a achievement', () => {
        const {_id, ...other} = achievementStub()
        expect(response).toEqual({
          code: 1,
          data: {
            _id: String(_id),
            ...other,
            ...updateAchievementDto
          }
        })
      })
    })
  })
})