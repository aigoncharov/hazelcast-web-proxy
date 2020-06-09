import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'
import { appPort } from './core/consts'
import { ErrorsInterceptor } from './core/error.interceptor'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.useGlobalInterceptors(new ErrorsInterceptor())

  await app.listen(appPort)
}
bootstrap()
