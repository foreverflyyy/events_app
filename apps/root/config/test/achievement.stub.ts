import {Achievement} from "../../database/schemas";
import mongoose from "mongoose";

export const achievementStub = (): Achievement => {
  return {
    _id: new mongoose.Types.ObjectId(),
    // _id: new mongoose.Types.ObjectId("660717b51cc6e71f95ae3a5a"),
    name: "Achievement",
    code: "achievement",
    mainImage:  ""
  }
}