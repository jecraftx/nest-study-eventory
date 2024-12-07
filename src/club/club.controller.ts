import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ClubService } from './club.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ClubDto, ClubListDto } from './dto/club.dto';
import { CreateClubPayload } from './payload/create-club.payload';
import { CurrentUser } from 'src/auth /decorator /user.decorator';
import { UserBaseInfo } from 'src/auth /type/user-base-info-type';

@Controller('club')
@ApiTags('Club API')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  @ApiOperation({ summary: 'Club Create' })
  @ApiCreatedResponse({ type: ClubDto })
  async createClub(
    @Body() payload: CreateClubPayload,
    @CurrentUser() user: UserBaseInfo,
  ): Promise<ClubDto> {
    return this.clubService.createClub(payload, user);
  }
}
