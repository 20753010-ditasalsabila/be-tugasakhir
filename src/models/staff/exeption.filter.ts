import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { EntityNotFoundError } from "typeorm";

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter  {
    catch(error: EntityNotFoundError, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        response.status(HttpStatus.NOT_FOUND).json({
            status :{
                code: HttpStatus.NOT_FOUND,
                description: 'Not found'
            }
        })
    }
}

