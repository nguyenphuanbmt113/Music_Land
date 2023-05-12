import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArtistType } from 'src/common/enum/artist.enum';
import { GENDER } from 'src/common/enum/gender.enum';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { AdminAuthGuard } from '../auth/guards/adminGuard.guard';
import { MusicianService } from './musician.service';

@Controller('musician')
export class MusicianController {
  constructor(private musicianService: MusicianService) {}
  //localhost:3000/singers
  @Get()
  getAllSingers() {
    return this.musicianService.findAll();
  }

  @Get('filtered')
  getFilteredSingers(
    @Query('limit') limit: number,
    @Query('type') type: ArtistType,
    @Query('nationality') nationality: string,
    @Query('gender') gender: GENDER,
  ) {
    return this.musicianService.getFilterSingers(
      limit,
      nationality,
      type,
      gender,
    );
  }

  @Get('limited')
  getLimitedSingers(@Query('limit') limit: number) {
    return this.musicianService.getLimitSingers(limit);
  }

  //localhost:3000/singers
  @Post()
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  createNewSinger(@Body() data: any) {
    return this.musicianService.createSinger(data);
  }

  //localhost:3000/singers/:id
  @Get(':id')
  getSingerById(@Param('id') id: number) {
    return this.musicianService.findSingerById(id);
  }

  @Post(':id/new-album')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  createNewAlbum(@Param('id') id: number, @Body() createAlbumDto: any) {
    return this.musicianService.createAlbum(id, createAlbumDto);
  }

  @Put(':id/update-singer')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  // @UseInterceptors(FileInterceptor('image'))
  updateSinger(@Param('id') id: number, @Body() data: any) {
    return this.musicianService.updateSinger(id, data);
  }

  @Delete(':id/delete-singer')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  deleteSinger(@Param('id') id: number) {
    return this.musicianService.deleteSinger(id);
  }
}
