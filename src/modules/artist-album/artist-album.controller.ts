import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/common/enum/role.enum';
import { SongLanguage } from 'src/common/enum/song-lang';
import { SongType } from 'src/common/enum/song-type';
import { Roles } from '../auth/decorator/role.decorator';
import { AdminAuthGuard } from '../auth/guards/adminGuard.guard';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { ArtistAlbumService } from './artist-album.service';
@Controller('artist-album')
export class ArtistAlbumController {
  constructor(private singerAlbumService: ArtistAlbumService) {}

  @Get()
  getAllSingerAlbums() {
    return this.singerAlbumService.findAll();
  }

  @Get(':id')
  getSingerAlbum(@Param('id', ParseIntPipe) id: number) {
    return this.singerAlbumService.getSignerAlbumById(id);
  }

  @Post(':id/new-song')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  // @UseInterceptors(FileInterceptor('source'))
  createNewSong(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('artist') artist: string,
    @Body('type') type: SongType,
    @Body('language') language: SongLanguage,
    // @UploadedFile() source: any,
  ) {
    return this.singerAlbumService.createNewSong(
      id,
      name,
      description,
      artist,
      type,
      language,
      // source,
    );
  }

  @Put(':id/update-album')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  updateAlbum(
    @Param('id', ParseIntPipe) id: number,
    @Body() createAlbumDto: any,
  ) {
    return this.singerAlbumService.updateSingerAlbum(id, createAlbumDto);
  }
}
