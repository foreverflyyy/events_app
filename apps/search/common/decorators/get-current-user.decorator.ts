import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {TokenPayload} from "../types";

export const GetCurrentUser = createParamDecorator(
    (data: keyof TokenPayload | undefined, context: ExecutionContext) => {
        let needUser: any = {};
        switch (context.getType()) {
            case 'http':
                needUser = context.switchToHttp().getRequest().user;
                break;
            case 'rpc':
                needUser = context.switchToRpc().getData().user;
        }

        if (data) {
            return needUser[data];
        }

        return needUser;
    }
);