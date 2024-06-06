/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

const protobufPackage = "event";

export interface Empty {
}

export interface EventRequestResponse {
  message: MessageEventRequestResponse | undefined;
  statusCode: number;
  error: string;
}

export interface EventRequestsResponse {
  message: MessageEventRequestsResponse | undefined;
  statusCode: number;
  error: string;
}

export interface MessageEventRequestResponse {
  code: number;
  message?: string | undefined;
  data?: EventRequest | undefined;
  error?: string | undefined;
}

export interface MessageEventRequestsResponse {
  code: number;
  message?: string | undefined;
  data?: EventRequests | undefined;
  error?: string | undefined;
}

export interface EventRequests {
  records: EventRequest[];
}

export interface GetEventRequestsByAuthorDto {
  author: string;
}

export interface CreateEventRequestDto {
  eventId: string;
  author: string;
  name: string;
  description: string;
  date: EventDate[];
  city: string;
  place: string;
  address: string;
  mainImage: File | undefined;
  images: File[];
  ageLimit: string;
  price: number;
  currency: string;
  tags: string[];
  categories: string[];
  organizers: string[];
  status: string;
}

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Uint8Array;
  size: number;
}

export interface UpdateEventRequestDto {
  id: string;
  eventId: string;
  author: string;
  name: string;
  description: string;
  date: EventDate[];
  city: string;
  place: string;
  address: string;
  mainImage: string;
  images: string[];
  ageLimit: string;
  price: number;
  currency: string;
  tags: string[];
  categories: string[];
  organizers: string[];
  status: string;
}

export interface EventRequest {
  id: string;
  eventId: string;
  author: string;
  name: string;
  description: string;
  date: EventDate[];
  city: string;
  place: string;
  address: string;
  mainImage: string;
  images: string[];
  ageLimit: string;
  price: number;
  currency: string;
  tags: string[];
  categories: string[];
  organizers: string[];
  status: string;
}

export interface EventRequestIdDto {
  id: string;
}

export interface EventDate {
  dateStart: string;
  dateEnd: string;
}

export const EVENT_PACKAGE_NAME = "event";

export interface EventRequestServiceClient {
  getEventRequests(request: Empty): Observable<EventRequestsResponse>;

  getEventRequestsByAuthor(request: GetEventRequestsByAuthorDto): Observable<EventRequestsResponse>;

  getEventRequestById(request: EventRequestIdDto): Observable<EventRequestResponse>;

  sendEventRequest(request: CreateEventRequestDto): Observable<EventRequestResponse>;

  updateEventRequest(request: UpdateEventRequestDto): Observable<EventRequestResponse>;

  confirmEventRequestsByUser(request: EventRequestIdDto): Observable<EventRequestsResponse>;

  rejectRequestsByUser(request: EventRequestIdDto): Observable<EventRequestsResponse>;
}

export interface EventRequestServiceController {
  getEventRequests(
      request: Empty,
  ): Promise<EventRequestsResponse> | Observable<EventRequestsResponse> | EventRequestsResponse;

  getEventRequestsByAuthor(
      request: GetEventRequestsByAuthorDto,
  ): Promise<EventRequestsResponse> | Observable<EventRequestsResponse> | EventRequestsResponse;

  getEventRequestById(
      request: EventRequestIdDto,
  ): Promise<EventRequestResponse> | Observable<EventRequestResponse> | EventRequestResponse;

  sendEventRequest(
      request: CreateEventRequestDto,
  ): Promise<EventRequestResponse> | Observable<EventRequestResponse> | EventRequestResponse;

  updateEventRequest(
      request: UpdateEventRequestDto,
  ): Promise<EventRequestResponse> | Observable<EventRequestResponse> | EventRequestResponse;

  confirmEventRequestsByUser(
      request: EventRequestIdDto,
  ): Promise<EventRequestsResponse> | Observable<EventRequestsResponse> | EventRequestsResponse;

  rejectRequestsByUser(
      request: EventRequestIdDto,
  ): Promise<EventRequestsResponse> | Observable<EventRequestsResponse> | EventRequestsResponse;
}

export function EventRequestServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getEventRequests",
      "getEventRequestsByAuthor",
      "getEventRequestById",
      "sendEventRequest",
      "updateEventRequest",
      "confirmEventRequestsByUser",
      "rejectRequestsByUser",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("EventRequestService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("EventRequestService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const EVENT_REQUEST_SERVICE_NAME = "EventRequestService";
