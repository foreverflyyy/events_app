/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

const protobufPackage = "auth";

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

interface User {
  id: string;
  name: string;
  login: string;
  mainImage: string;
}

export interface Response {
  code: number;
  data: string;
}

interface UserResponse {
  code: number;
  data: User | undefined;
}

export interface TokensData {
  accessToken: string;
  refreshToken: string;
}

export interface TokensResponse {
  code: number;
  data: TokensData | undefined;
}

interface Empty {
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthRootServiceClient {
  addUser(request: User): Observable<Response>;

  deleteUser(request: User): Observable<Response>;

  checkTokenAndGetUser(request: TokensData): Observable<UserResponse>;

  signIn(request: SignInDto): Observable<TokensResponse>;

  logout(request: AccessDto): Observable<Response>;

  refresh(request: RefreshDto): Observable<TokensResponse>;
}

export interface AuthRootServiceController {
  addUser(request: User): Promise<Response> | Observable<Response> | Response;

  deleteUser(request: User): Promise<Response> | Observable<Response> | Response;

  checkTokenAndGetUser(request: TokensData): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  signIn(request: SignInDto): Promise<TokensResponse> | Observable<TokensResponse> | TokensResponse;

  logout(request: AccessDto): Promise<Response> | Observable<Response> | Response;

  refresh(request: RefreshDto): Promise<TokensResponse> | Observable<TokensResponse> | TokensResponse;
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
  addUser(request: User): Observable<Response>;

  deleteUser(request: User): Observable<Response>;

  checkTokenAndGetUser(request: TokensData): Observable<UserResponse>;

  signIn(request: SignInDto): Observable<TokensResponse>;

  logout(request: AccessDto): Observable<Response>;

  refresh(request: RefreshDto): Observable<TokensResponse>;
}

export interface AuthCmsServiceController {
  addUser(request: User): Promise<Response> | Observable<Response> | Response;

  deleteUser(request: User): Promise<Response> | Observable<Response> | Response;

  checkTokenAndGetUser(request: TokensData): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  signIn(request: SignInDto): Promise<TokensResponse> | Observable<TokensResponse> | TokensResponse;

  logout(request: AccessDto): Promise<Response> | Observable<Response> | Response;

  refresh(request: RefreshDto): Promise<TokensResponse> | Observable<TokensResponse> | TokensResponse;
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
