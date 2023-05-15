import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { UserAuthGuard } from '../auth/guards/userGuard.guard';
import { FavoriteService } from './favorite.service';
@UseGuards(AuthenticationGuard, UserAuthGuard)
@Roles([Role.USER])
@Controller('favorite')
export class FavoriteController {
  constructor(private favoriteListService: FavoriteService) {}

  @Get(':id')
  getUserFavoriteList(@Param('id') id: number) {
    return this.favoriteListService.getUserFavoriteList(id);
  }

  @Delete(':id/clear-favorite-list')
  clearFavoriteList(@Param('id') id: number) {
    return this.favoriteListService.clearFavoriteListContent(id);
  }

  @Delete(':favoriteId/remove-track-from-favorite-list/:trackId')
  removeTrackFromFavoriteList(
    @Param('favoriteId') favoriteId: number,
    @Param('trackId') trackId: number,
  ) {
    return this.favoriteListService.removeTrackFromFavouriteList(
      favoriteId,
      trackId,
    );
  }
}
