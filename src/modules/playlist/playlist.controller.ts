import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserDecorator } from '../auth/decorator/user.decorator';
import { PlaylistService } from './playlist.service';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { UserAuthGuard } from '../auth/guards/userGuard.guard';

@UseGuards(AuthenticationGuard, UserAuthGuard)
@Roles([Role.USER])
@Controller('playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}
  @Get('user-playlists')
  getAllUserPlaylists(@UserDecorator() user: User) {
    return this.playlistService.getUserPlaylist(user);
  }

  @Get(':id')
  getPlaylist(@Param('id') id: number) {
    return this.playlistService.getPlaylistById(id);
  }

  @Post('new-playlist')
  newPlaylist(@UserDecorator() user: User, @Body() playlistDto: any) {
    console.log('user:', user);
    return this.playlistService.createUserPlaylist(user, playlistDto);
  }

  @Put(':id/update-playlist')
  updatePlaylist(
    @Param('id', ParseIntPipe) id: number,
    @Body() playlistDto: any,
  ) {
    return this.playlistService.editPlaylist(id, playlistDto);
  }

  @Delete(':id/delete-playlist')
  deletePlaylist(@Param('id') id: number) {
    return this.playlistService.deletePlaylist(id);
  }

  @Delete(':id/clear-playlist')
  clearPlaylistContent(@Param('id') id: number) {
    return this.playlistService.clearPlaylistContent(id);
  }

  @Delete(':playlistId/remove-track-from-playlist/:trackId')
  removeTrackFromFavoriteList(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('trackId', ParseIntPipe) trackId: number,
  ) {
    return this.playlistService.removeTrackFromPlaylist(playlistId, trackId);
  }
}
