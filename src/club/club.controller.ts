import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ClubDto, ClubListDto } from './dto/club.dto';
import { ClubDetailData } from './type/club-detail-data.type';
import { JwtAuthGuard } from 'src/auth /guard/jwt-auth.guard';
import { ClubDetailDto } from './dto/club-detail.dto';
import { ClubQuery } from './query/club.query';
import { CreateClubPayload } from './payload/create-club.payload';
import { CurrentUser } from 'src/auth /decorator /user.decorator';
import { UserBaseInfo } from 'src/auth /type/user-base-info-type';
import { ClubService } from './club.service';
import { PutUpdateClubPayload } from './payload/put-update-club.payload';
import { PatchUpdateClubPayload } from './payload/patch-update-club';

@Controller('club')
@ApiTags('Club API')
export class ClubController {
    constructor(private readonly clubService: ClubService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Club Create' })
    @ApiCreatedResponse({ type: ClubDto })
    async createClub(
      @Body() payload: CreateClubPayload,
      @CurrentUser() user: UserBaseInfo,
    ): Promise<ClubDto> {
        return this.clubService.createClub(payload, user);
    }

    @Get()
    @ApiOperation({ summary: 'Club get all' })
    @ApiOkResponse({ type: ClubListDto })
    async getClubs(@Query() query: ClubQuery): Promise<ClubListDto> {
        return this.clubService.getClubs(query);
    }

    @Get(':clubId')
    @ApiOperation({ summary: 'Club get by Id' })
    @ApiOkResponse({ type: ClubDetailDto })
    async getClubById(
        @Param('clubId', ParseIntPipe) clubId: number,
    ): Promise<ClubDetailDto> {
        return this.clubService.getClubById(clubId);
    }

    @Put(':clubId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Club PUT Update' })
    @ApiOkResponse({ type: ClubDto })
    async putUpdateClub(
        @Param('clubId', ParseIntPipe) clubId: number,
        @Body() payload: PutUpdateClubPayload,
        @CurrentUser() user: UserBaseInfo,
    ): Promise<ClubDto> {
        return this.clubService.putUpdateClub(clubId, payload, user);
    }

    @Patch(':clubId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Club PATCH Update' })
    @ApiOkResponse({ type: ClubDto })
    async patchUpdateClub(
        @Param('clubId', ParseIntPipe) clubId: number,
        @Body() payload: PatchUpdateClubPayload,
        @CurrentUser() user: UserBaseInfo,
    ): Promise<ClubDto> {
        return this.clubService.patchUpdateClub(clubId, payload, user);
    }
}
