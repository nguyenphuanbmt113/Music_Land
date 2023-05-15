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
import { Role } from 'src/common/enum/role.enum';
import { SongLanguage } from 'src/common/enum/song-lang';
import { SongType } from 'src/common/enum/song-type';
import { Roles } from '../auth/decorator/role.decorator';
import { AdminAuthGuard } from '../auth/guards/adminGuard.guard';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { SongService } from './song.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserAuthGuard } from '../auth/guards/userGuard.guard';
@Controller('song')
export class SongController {
  constructor(private songService: SongService) {}

  @Get()
  getAllSongs() {
    return this.songService.getAllSongs();
  }

  @Get('limited')
  getLimitedSongs(@Query('limit') limit: number) {
    return this.songService.getLimitedSongs(limit);
  }

  @Get('filtered')
  getFilteredSongs(
    @Query('limit') limit: number,
    @Query('type') type: SongType,
    @Query('language') language: SongLanguage,
    @Query('rate') rate: number,
  ) {
    return this.songService.getFilteredSong(limit, type, language, rate);
  }

  @Get(':id')
  getSongById(@Param('id') id: number) {
    return this.songService.getSongById(id);
  }

  @Put(':id/update-song')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  @UseInterceptors(
    FileInterceptor('sourse', {
      storage: diskStorage({
        destination: './mp4/sourse',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const nameExtension = file.originalname.split('.')[1];
          const newName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + nameExtension;
          cb(null, newName);
        },
      }),
    }),
  )
  updateSong(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('artist') artist: string,
    @Body('type') type: SongType,
    @Body('language') language: SongLanguage,
    @UploadedFile() source: any,
  ) {
    return this.songService.updateSong(
      id,
      name,
      description,
      artist,
      type,
      language,
      source,
    );
  }

  @Delete(':id/delete-song')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  delete(@Param('id') id: number) {
    return this.songService.deleteSong(id);
  }

  @Post(':songId/add-to-playlist/:playlistId')
  @UseGuards(AuthenticationGuard, UserAuthGuard)
  @Roles([Role.USER])
  addToPlaylist(
    @Param('songId') songId: number,
    @Param('playlistId') playlistId: number,
  ) {
    return this.songService.addSongToPlaylist(songId, playlistId);
  }

  @Post(':songId/save-to-favorite-list/:favoriteId')
  @UseGuards(AuthenticationGuard, UserAuthGuard)
  @Roles([Role.USER])
  saveToFavoriteList(
    @Param('songId') songId: number,
    @Param('favoriteId') favoriteId: number,
  ) {
    return this.songService.addSongToFavorite(songId, favoriteId);
  }
}
