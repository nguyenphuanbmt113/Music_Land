import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Role } from 'src/common/enum/role.enum';
import { SongLanguage } from 'src/common/enum/song-lang';
import { SongType } from 'src/common/enum/song-type';
import { fileFilter } from 'src/common/helpers/handling-files.helper';
import { Roles } from '../auth/decorator/role.decorator';
import { AdminAuthGuard } from '../auth/guards/adminGuard.guard';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { ArtistAlbumService } from './artist-album.service';
import { CreateAlbumDto } from './dto/createAlbumDto.dto';
@Controller('artist-album')
export class ArtistAlbumController {
  constructor(private singerAlbumService: ArtistAlbumService) {}

  @Get()
  getAllSingerAlbums() {
    return this.singerAlbumService.findAll();
  }

  @Get(':id')
  getSingerAlbum(@Param('id') id: number) {
    return this.singerAlbumService.getSignerAlbumById(id);
  }

  @Post(':id/new-song')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
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
      fileFilter: fileFilter,
    }),
  )
  createNewSong(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('artist') artist: string,
    @Body('type') type: SongType,
    @Body('language') language: SongLanguage,
    @UploadedFile() source: any,
  ) {
    return this.singerAlbumService.createNewSong(
      id,
      name,
      description,
      artist,
      type,
      language,
      source,
    );
  }

  @Put(':id/update-album')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  updateAlbum(@Param('id') id: number, @Body() createAlbumDto: CreateAlbumDto) {
    return this.singerAlbumService.updateSingerAlbum(id, createAlbumDto);
  }
}
