import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthAminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log('----------------------------------');
    console.log(request['user']);
    console.log('----------------------------------');

    if (request['user']?.role === 'admin') return true;

    // return true -> seguir o fluxo
    // return false -> barrar a requisição
    return false;
  }
}
