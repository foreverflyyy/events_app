import { Test } from "@nestjs/testing"
import mongoose, { Connection } from 'mongoose';
import request from 'supertest';

import { AppModule } from "../../app.module"
import { CreateAchievementDto } from "../dto";
import { achievementStub } from "./achievement.stub";
import { DatabaseService } from "../../../../../libs/common/src/database/database.service";
import {Achievement} from "../../../../../libs/common/src/database/schemas";

describe('Achievement', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
  })

  afterAll(async () => {
    await app.close();
  })

  beforeEach(async () => {
    await dbConnection.collection("achievements").deleteMany({});
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
    expect(dbConnection).toBeDefined();
  });

  describe('getAchievements', () => {
    it('should return an array of achievements', async () => {
      await dbConnection.collection("/achievements").insertOne(achievementStub())
      const response = await request(httpServer).get("/achievements");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({code: 1, data: expect.any(Array)});

      const expectedAchievementStructure = {
        _id: expect.any(mongoose.Types.ObjectId),
        name: expect.any(String),
        code: expect.any(String),
        mainImage: expect.any(String)
      }
      response.body.data.forEach((achievement: Achievement) => {
        expect(achievement).toEqual(expect.objectContaining(expectedAchievementStructure))
      })
    })
  })

  describe('createAchievement', () => {
    it('should create a achievement', async () => {
      const createAchievementDto: CreateAchievementDto = {
        name: achievementStub().name,
        code: achievementStub().code
      }
      const response = await request(httpServer).post("/achievements").send(createAchievementDto)

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({code: 1, data: createAchievementDto});

      const achievement = await dbConnection
        .collection("achievements")
        .findOne({ code: createAchievementDto.code });
      expect(achievement).toMatchObject(createAchievementDto);
    })
  })
})