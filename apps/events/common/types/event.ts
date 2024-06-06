/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "event";

export enum EventActionType {
  ADD = 0,
  DELETE = 1,
  UNRECOGNIZED = -1,
}

export interface EventIdDto {
  id: string;
}

export interface EventAuthorDto {
  author: string;
}

export interface UpdateEventDto {
  id: string;
  data: UpdateEvent | undefined;
}

export interface EventPeopleDto {
  id: string;
  action: EventActionType;
  people: string[];
}

export interface EventResponse {
  message: MessageEventResponse | undefined;
  statusCode: number;
  error: string;
}

export interface EventsResponse {
  message: MessageEventsResponse | undefined;
  statusCode: number;
  error: string;
}

export interface MessageEventResponse {
  code: number;
  message?: string | undefined;
  data?: Event | undefined;
  error?: string | undefined;
}

export interface MessageEventsResponse {
  code: number;
  message?: string | undefined;
  data?: Events | undefined;
  error?: string | undefined;
}

export interface Events {
  records: Event[];
}

export interface Event {
  id: string;
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
  participants: string;
  status: string;
  news: string;
}

export interface UpdateEvent {
  author: string;
  name: string;
  description: string;
  date: EventDate[];
  city: string;
  place: string;
  address: string;
  ageLimit: string;
  price: number;
  currency: string;
  tags: string[];
  categories: string[];
  status: string;
  news: string;
}

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

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Uint8Array;
  size: number;
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

export interface EventServiceClient {
  getEvents(request: Empty): Observable<EventsResponse>;

  getEventById(request: EventIdDto): Observable<EventResponse>;

  getEventsByAuthor(request: EventAuthorDto): Observable<EventsResponse>;

  updateEvent(request: UpdateEventDto): Observable<EventResponse>;

  deleteEvent(request: EventIdDto): Observable<EventResponse>;

  changeMarkedField(request: EventPeopleDto): Observable<EventResponse>;

  changeParticipantsField(request: EventPeopleDto): Observable<EventResponse>;

  changeOrganizersField(request: EventPeopleDto): Observable<EventResponse>;
}

export interface EventServiceController {
  getEvents(request: Empty): Promise<EventsResponse> | Observable<EventsResponse> | EventsResponse;

  getEventById(request: EventIdDto): Promise<EventResponse> | Observable<EventResponse> | EventResponse;

  getEventsByAuthor(request: EventAuthorDto): Promise<EventsResponse> | Observable<EventsResponse> | EventsResponse;

  updateEvent(request: UpdateEventDto): Promise<EventResponse> | Observable<EventResponse> | EventResponse;

  deleteEvent(request: EventIdDto): Promise<EventResponse> | Observable<EventResponse> | EventResponse;

  changeMarkedField(request: EventPeopleDto): Promise<EventResponse> | Observable<EventResponse> | EventResponse;

  changeParticipantsField(request: EventPeopleDto): Promise<EventResponse> | Observable<EventResponse> | EventResponse;

  changeOrganizersField(request: EventPeopleDto): Promise<EventResponse> | Observable<EventResponse> | EventResponse;
}

export function EventServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getEvents",
      "getEventById",
      "getEventsByAuthor",
      "updateEvent",
      "deleteEvent",
      "changeMarkedField",
      "changeParticipantsField",
      "changeOrganizersField",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("EventService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("EventService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const EVENT_SERVICE_NAME = "EventService";

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
