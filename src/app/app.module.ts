import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configModule } from './modules/config.module';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { RegionModule } from '../region/region.module';
import { CommonModule } from '../common/common.module';
import { ReviewModule } from '../review/review.module';
import { CategoryModule } from 'src/category/category.module';
import { EventModule } from 'src/event/event.module';
import { ClubModule } from 'src/club/club.module';

@Module({
  imports: [
    configModule,
    RegionModule,
    CommonModule,
    CategoryModule,
    ReviewModule,
    EventModule,
    ClubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
