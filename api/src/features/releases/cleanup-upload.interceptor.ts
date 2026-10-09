import { promises as fs } from 'node:fs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';

/**
 * Borra el archivo temporal de la subida si la petición falla.
 *
 * multer escribe el archivo a disco *antes* de que la ValidationPipe revise el
 * cuerpo, así que un `version` mal formado dejaba el instalable huérfano en
 * `.tmp`. Va después de `FileInterceptor` en `@UseInterceptors`, de modo que
 * envuelve también la validación y el servicio. Si el servicio ya movió el
 * archivo, `rm` con `force` no hace nada.
 */
@Injectable()
export class CleanupUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      file?: { path: string };
    }>();
    return next.handle().pipe(
      catchError((error: unknown) => {
        const path = request.file?.path;
        if (!path) return throwError(() => error);
        return from(fs.rm(path, { force: true })).pipe(
          switchMap(() => throwError(() => error)),
        );
      }),
    );
  }
}
