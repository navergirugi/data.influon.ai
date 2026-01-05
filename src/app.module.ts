import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // PrismaModule, // To be implemented
    // AuthModule,   // To be implemented
    // UsersModule,  // To be implemented
    // CampaignsModule, // To be implemented
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
