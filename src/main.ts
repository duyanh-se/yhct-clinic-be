import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API Phòng khám YHCT')
    .setDescription(
      'Tài liệu API cho hệ thống quản lý phòng khám Y học Cổ truyền',
    )
    .setVersion('1.0')
    .addBearerAuth() // Thêm dòng này để xuất hiện nút "Authorize" nhập token JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
