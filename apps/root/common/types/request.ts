/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

const protobufPackage = "request";

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

export interface GetEventRequestsByUserDto {
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

export interface EventDate {
  dateStart: string;
  dateEnd: string;
}

export const REQUEST_PACKAGE_NAME = "request";

export interface EventRequestServiceClient {
  sendEventRequest(request: CreateEventRequestDto): Observable<EventRequestResponse>;

  updateEventRequest(request: UpdateEventRequestDto): Observable<EventRequestResponse>;

  getEventRequestsByUser(request: GetEventRequestsByUserDto): Observable<EventRequestsResponse>;
}

export interface EventRequestServiceController {
  sendEventRequest(
      request: CreateEventRequestDto,
  ): Promise<EventRequestResponse> | Observable<EventRequestResponse> | EventRequestResponse;

  updateEventRequest(
      request: UpdateEventRequestDto,
  ): Promise<EventRequestResponse> | Observable<EventRequestResponse> | EventRequestResponse;

  getEventRequestsByUser(
      request: GetEventRequestsByUserDto,
  ): Promise<EventRequestsResponse> | Observable<EventRequestsResponse> | EventRequestsResponse;
}

export function EventRequestServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["sendEventRequest", "updateEventRequest", "getEventRequestsByUser"];
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
