import { Controller } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MusicianAlbumService } from './musician-album.service';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { AdminAuthGuard } from '../auth/guards/adminGuard.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { MusicType } from 'src/common/enum/music-type';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@UseInterceptors(
  FileInterceptor('sourse', {
    storage: diskStorage({
      destination: './files/sourse',
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
@Controller('musician-album')
export class MusicianAlbumController {
  constructor(private musicianAlbumService: MusicianAlbumService) {}
  @Get()
  getAllMusicianAlbums() {
    return this.musicianAlbumService.getAllMusicianAlbums();
  }

  @Get(':id')
  getMusicianAlbum(@Param('id', ParseIntPipe) id: number) {
    return this.musicianAlbumService.getMusicianAlbumById(id);
  }

  @Post(':id/new-music')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  createNewMusic(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('artist') artist: string,
    @Body('type') type: MusicType,
    @UploadedFile() source: any,
  ) {
    return this.musicianAlbumService.createNewMusic(
      id,
      name,
      description,
      artist,
      type,
      source,
    );
  }

  @Put(':id/update-album')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  updateAlbum(
    @Param('id', ParseIntPipe) id: number,
    @Body() createAlbumDto: any,
  ) {
    return this.musicianAlbumService.updateMusicianAlbum(id, createAlbumDto);
  }

  @Delete(':id/delete-album')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  deleteAlbum(@Param('id') id: number) {
    return this.musicianAlbumService.deleteMusicianAlbum(id);
  }

  @Delete(':id/clear-album')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  clearMussicInAlbum(@Param('id') id: number) {
    return this.musicianAlbumService.deleteMusicianAlbum(id);
  }
}
