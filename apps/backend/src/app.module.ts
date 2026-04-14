import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { ProductsModule } from './features/products/products.module';
import { ReviewsModule } from './features/reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Single source of truth: root .env
      envFilePath: ['../../.env'],
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    ReviewsModule,
  ],
})
export class AppModule {}
