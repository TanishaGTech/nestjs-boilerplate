import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CheckAuthentication } from './utils/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: 'mongodb://0.0.0.0:27017/',
      }),
    }),
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: '3h' },
    }),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore,
        url: 'redis://localhost:6379',
      }),
    }),
    HttpModule.register({ timeout: 5000 }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    // {     this is global declaration of caching -if data needs to be cache for all the apis
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckAuthentication)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST }, // Exclude the login route
        { path: 'auth/signup', method: RequestMethod.POST }, // Exclude the sign route
        // Add more routes to exclude as needed
      )
      .forRoutes('*');
  }
}
