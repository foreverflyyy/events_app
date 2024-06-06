import {Response} from 'express';
import {RpcException} from '@nestjs/microservices';
import {ArgumentsHost, Catch, ExceptionFilter} from '@nestjs/common';
import {HTTP_CODE_FROM_GRPC, parseJson} from "../utils";
import {status as Status} from "@grpc/grpc-js";

export interface GrpcErrorPayload {
    code: number,
    details: string | object
}

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const error = exception.getError() as GrpcErrorPayload;
        const {code = Status.INTERNAL, details: mainError} = error;

        let objectError = mainError;
        if (typeof mainError === "string") {
            const parsedError = parseJson(mainError);
            if (!parsedError || !parsedError?.error) {
                objectError = {code: 0, data: "Ошибка при обращении по rpc.", err: mainError ?? ""};
            } else {
                objectError = parsedError?.error;
            }
        }

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        response.status(HTTP_CODE_FROM_GRPC[code]).json(objectError);
    }
}