/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export enum UserActionType {
  ADD = 0,
  DELETE = 1,
  UNRECOGNIZED = -1,
}

export enum SexType {
  MALE = 0,
  FEMALE = 1,
  UNKNOWN = 2,
  UNRECOGNIZED = -1,
}

export enum RoleType {
  USER = 0,
  ADMIN = 1,
  ORGANIZER = 2,
  UNRECOGNIZED = -1,
}

export interface UsersIdDto {
  id: string;
}

export interface UsersPeopleDto {
  id: string;
  action: UserActionType;
  people: string[];
}

export interface UserResponse {
  message: MessageUserResponse | undefined;
  statusCode: number;
  error: string;
}

export interface UsersResponse {
  message: MessageUsersResponse | undefined;
  statusCode: number;
  error: string;
}

export interface MessageUserResponse {
  code: number;
  message?: string | undefined;
  data?: User | undefined;
  error?: string | undefined;
}

export interface MessageUsersResponse {
  code: number;
  message?: string | undefined;
  data?: Users | undefined;
  error?: string | undefined;
}

export interface Users {
  records: User[];
}

export interface User {
  id: string;
  login: string;
  email: string;
  phone: string;
  name: string;
  role: RoleType;
  mainImage: string;
  city: string;
  sex: SexType;
  birthday: string;
  description: string;
  tags: string[];
  categories: string[];
  achievements: string[];
  favourites: string[];
  events: string[];
  ownEvents: string[];
  active: boolean;
  registerAt: string;
  lastSeen: string;
}

export interface Empty {
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  getUserById(request: UsersIdDto): Observable<UserResponse>;

  changeEventsField(request: UsersPeopleDto): Observable<UserResponse>;

  changeOwnEventsField(request: UsersPeopleDto): Observable<UserResponse>;
}

export interface UserServiceController {
  getUserById(request: UsersIdDto): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  changeEventsField(request: UsersPeopleDto): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  changeOwnEventsField(request: UsersPeopleDto): Promise<UserResponse> | Observable<UserResponse> | UserResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getUserById", "changeEventsField", "changeOwnEventsField"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
