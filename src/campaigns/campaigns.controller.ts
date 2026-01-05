import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Campaigns')
@Controller('v1/campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('main-list')
  @ApiOperation({ summary: 'Get main campaign list (Today Open, Nearby)' })
  async getMainList() {
    return this.campaignsService.getMainList();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search campaigns' })
  async search(@Query() query: any) {
    return this.campaignsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign detail' })
  async getDetail(@Param('id') id: string) {
    return this.campaignsService.getDetail(+id);
  }

  @Post('apply')
  @ApiOperation({ summary: 'Apply for a campaign' })
  async apply(@Body() body: any) {
    return this.campaignsService.apply(body);
  }
}
