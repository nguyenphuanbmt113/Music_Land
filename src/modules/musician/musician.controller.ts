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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ArtistType } from 'src/common/enum/artist.enum';
import { GENDER } from 'src/common/enum/gender.enum';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { AdminAuthGuard } from '../auth/guards/adminGuard.guard';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { MusicianService } from './musician.service';

@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './files/musician/sourse',
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
@Controller('musician')
export class MusicianController {
  constructor(private musicianService: MusicianService) {}

  @Get()
  getAllMusicians() {
    return this.musicianService.findAll();
  }

  @Get('filtered')
  getFilteredMusicians(
    @Query('limit') limit: number,
    @Query('type') type: ArtistType,
    @Query('nationality') nationality: string,
    @Query('gender') gender: GENDER,
  ) {
    return this.musicianService.getFilterMusicians(
      limit,
      nationality,
      type,
      gender,
    );
  }

  @Get('limited')
  getLimitedMusicians(@Query('limit') limit: number) {
    return this.musicianService.getLimitMusicians(limit);
  }

  //localhost:3000/musicians
  @Post()
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  createNewMusician(
    @Body('name') name: string,
    @Body('info') info: string,
    @Body('gender') gender: GENDER,
    @Body('nationality') nationality: string,
    @Body('type') type: ArtistType,
    @UploadedFile() image: any,
  ) {
    return this.musicianService.createMusician(
      name,
      info,
      gender,
      type,
      nationality,
      image,
    );
  }

  //localhost:3000/musicians/:id
  @Get(':id')
  getMusicianById(@Param('id') id: number) {
    return this.musicianService.findMusicianById(id);
  }

  @Post(':id/new-album')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  createNewAlbum(
    @Param('id') id: number,
    @Body() createAlbumDto: any,
    @UploadedFile() image: any,
  ) {
    return this.musicianService.createAlbum(id, createAlbumDto, image);
  }

  @Put(':id/update-musician')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  updateMusician(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('info') info: string,
    @Body('gender') gender: GENDER,
    @Body('nationality') nationality: string,
    @Body('type') type: ArtistType,
    @UploadedFile() image: any,
  ) {
    return this.musicianService.updateMusician(
      id,
      name,
      info,
      gender,
      nationality,
      type,
      image,
    );
  }

  @Delete(':id/delete-musician')
  @UseGuards(AuthenticationGuard, AdminAuthGuard)
  @Roles([Role.ADMIN])
  deleteMusician(@Param('id') id: number) {
    return this.musicianService.deleteMusician(id);
  }
}
