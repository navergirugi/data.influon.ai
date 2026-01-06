import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchCampaignDto } from './dto/search-campaign.dto';
import { CreateApplicationDto } from './dto/create-application.dto';

@ApiTags('Campaigns')
@Controller({
  path: 'campaigns',
  version: '1',
})
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('main-list')
  @ApiOperation({ summary: 'Get main campaign list (Today Open, Nearby)' })
  async getMainList() {
    return this.campaignsService.getMainList();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search campaigns' })
  async search(@Query() query: SearchCampaignDto) {
    return this.campaignsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign detail' })
  async getDetail(@Param('id') id: string) {
    return this.campaignsService.getDetail(+id);
  }

  @Post('apply')
  @ApiOperation({ summary: 'Apply for a campaign' })
  async apply(@Body() body: CreateApplicationDto) {
    return this.campaignsService.apply(body);
  }
}
