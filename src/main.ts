import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'
import { appPort } from './core/consts'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  await app.listen(appPort)
}
bootstrap()
