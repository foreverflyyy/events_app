import {
    CanActivate,
    ExecutionContext,
    Inject, Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, tap } from 'rxjs';
import {AUTH_SERVICE} from "../common";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const authorization = this.getAuthorization(context);
        return this.authClient
          .send('validate_user', {Authorization: authorization})
          .pipe(
            tap((res) => {this.addUser(res, context);}),
            catchError(() => {
                throw new UnauthorizedException({
                    code: 0,
                    data: "Не удалось отправить запрос на авторизацию."
                });
            }),
          );
    }

    private getAuthorization(context: ExecutionContext) {
        let authorization = "";
        if (context.getType() === 'rpc')
            authorization = context.switchToRpc().getData().authorization;
        else if (context.getType() === 'http')
            authorization = context.switchToHttp().getRequest().headers.authorization;

        if (!authorization)
            throw new UnauthorizedException({
                code: 0,
                data: "Не было передано значение для авторизации."
            });

        return authorization;
    }

    private addUser(response: any, context: ExecutionContext) {
        const {user} = response;
        if (!user)
            throw new UnauthorizedException({
                code: 0,
                data: "Не пройдена авторизация."
            });

        if (context.getType() === 'rpc') {
            context.switchToRpc().getData().user = user;
        } else if (context.getType() === 'http') {
            context.switchToHttp().getRequest().user = user;
        }
    }
}