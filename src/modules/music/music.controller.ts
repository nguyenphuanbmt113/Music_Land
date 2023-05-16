import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { UserAuthGuard } from '../auth/guards/userGuard.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { AdminAuthGuard } from '../auth/guards/adminGuard.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MusicType } from 'src/common/enum/music-type';
import { MusicService } from './music.service';
import { diskStorage } from 'multer';
import { editFile, fileFilter } from 'src/common/helpers/handling-files.helper';

@Controller('music')
export class MusicController {
  constructor(private musicService: MusicService) {}

  @Get()
  getAllMusics() {
    return this.musicService.getAllMusics();
  }

  @Get('limited')
  getLimitedMusics(@Query('limit') limit: number) {
    return this.musicService.getLimitedMusics(limit);
  }

  @Get('filtered')
  getFilteredMusics(
    @Query('limit') limit: number,
    @Query('type') type: MusicType,
    @Query('rate') rate: number,
  ) {
    return this.musicService.getFilteredMusics(limit, type, rate);
  }

  @Get(':id')
  getMusicById(@Param('id') id: number) {
    return this.musicService.getMusicById(id);
  }

  @Put(':id/update-music')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  @UseInterceptors(
    FileInterceptor('sourse', {
      storage: diskStorage({
        destination: './files/sourse',
        filename: editFile,
      }),
      fileFilter,
    }),
  )
  updateMusic(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('artist') artist: string,
    @Body('type') type: MusicType,
    @UploadedFile() source: any,
  ) {
    return this.musicService.updateMusic(
      id,
      name,
      description,
      artist,
      type,
      source,
    );
  }

  @Delete(':id/delete-music')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  delete(@Param('id') id: number) {
    return this.musicService.deleteMusic(id);
  }

  @Post(':musicId/add-to-playlist/:playlistId')
  @UseGuards(AuthenticationGuard, UserAuthGuard)
  @Roles([Role.USER])
  addToPlaylist(
    @Param('musicId') musicId: number,
    @Param('playlistId') playlistId: number,
  ) {
    return this.musicService.pushToPlaylist(musicId, playlistId);
  }

  @Post(':musicId/save-to-favorite-list/:favoriteId')
  @UseGuards(AuthenticationGuard, UserAuthGuard)
  @Roles([Role.USER])
  saveToFavoriteList(
    @Param('musicId') musicId: number,
    @Param('favoriteId') favoriteId: number,
  ) {
    return this.musicService.pushToFavoriteList(musicId, favoriteId);
  }
}
