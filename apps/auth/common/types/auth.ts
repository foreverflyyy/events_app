/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface TokensData {
  accessToken: string;
  refreshToken: string;
}

export interface MessageResponse {
  code: number;
  message?: string | undefined;
  data?: TokensData | undefined;
  error?: string | undefined;
}

export interface Response {
  message: MessageResponse | undefined;
  statusCode: number;
  error: string;
}

export interface UserResponse {
  message: MessageUserResponse | undefined;
  statusCode: number;
  error: string;
}

export interface MessageUserResponse {
  code: number;
  message?: string | undefined;
  data?: ShortUserData | undefined;
  error?: string | undefined;
}

export interface SignInDto {
  login: string;
  password: string;
}

export interface AccessDto {
  accessToken: string;
}

export interface RefreshDto {
  refreshToken: string;
}

export interface FullUserData {
  id: string;
  userId: string;
  name: string;
  login: string;
  role: string;
  mainImage: string;
}

export interface ShortUserData {
  userId: string;
  name: string;
  login: string;
  role: string;
}

export interface UserForCreate {
  userId: string;
  password: string;
  name: string;
  login: string;
  role: string;
}

export interface DeleteUserDto {
  userId: string;
  login: string;
}

export interface Empty {
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthRootServiceClient {
  addUser(request: ShortUserData): Observable<Response>;

  deleteUser(request: ShortUserData): Observable<Response>;

  checkTokenAndGetUser(request: TokensData): Observable<Response>;

  signIn(request: SignInDto): Observable<Response>;

  logout(request: AccessDto): Observable<Response>;

  refresh(request: RefreshDto): Observable<Response>;
}

export interface AuthRootServiceController {
  addUser(request: ShortUserData): Promise<Response> | Observable<Response> | Response;

  deleteUser(request: ShortUserData): Promise<Response> | Observable<Response> | Response;

  checkTokenAndGetUser(request: TokensData): Promise<Response> | Observable<Response> | Response;

  signIn(request: SignInDto): Promise<Response> | Observable<Response> | Response;

  logout(request: AccessDto): Promise<Response> | Observable<Response> | Response;

  refresh(request: RefreshDto): Promise<Response> | Observable<Response> | Response;
}

export function AuthRootServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["addUser", "deleteUser", "checkTokenAndGetUser", "signIn", "logout", "refresh"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthRootService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthRootService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_ROOT_SERVICE_NAME = "AuthRootService";

export interface AuthCmsServiceClient {
  addUser(request: UserForCreate): Observable<Response>;

  deleteUser(request: DeleteUserDto): Observable<Response>;

  checkTokenAndGetUser(request: TokensData): Observable<UserResponse>;

  signIn(request: SignInDto): Observable<Response>;

  logout(request: AccessDto): Observable<Response>;

  refresh(request: RefreshDto): Observable<Response>;
}

export interface AuthCmsServiceController {
  addUser(request: UserForCreate): Promise<Response> | Observable<Response> | Response;

  deleteUser(request: DeleteUserDto): Promise<Response> | Observable<Response> | Response;

  checkTokenAndGetUser(request: TokensData): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  signIn(request: SignInDto): Promise<Response> | Observable<Response> | Response;

  logout(request: AccessDto): Promise<Response> | Observable<Response> | Response;

  refresh(request: RefreshDto): Promise<Response> | Observable<Response> | Response;
}

export function AuthCmsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["addUser", "deleteUser", "checkTokenAndGetUser", "signIn", "logout", "refresh"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthCmsService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthCmsService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_CMS_SERVICE_NAME = "AuthCmsService";
