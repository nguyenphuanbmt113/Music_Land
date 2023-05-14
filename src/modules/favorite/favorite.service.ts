import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/entities/favorite.entity';
import { Music } from 'src/entities/music.entity';
import { Profile } from 'src/entities/profile.entity';
import { Song } from 'src/entities/song.entity';
import { Repository } from 'typeorm';
import { StrackService } from '../strack/strack.service';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    private trackService: StrackService,
  ) {}

  async getUserFavoriteList(id: number, profile?: Profile): Promise<Favorite> {
    let favoriteList = null;
    if (id) {
      favoriteList = await this.favoriteRepository.findOne({
        where: {
          id,
        },
      });
    } else if (profile) {
      favoriteList = await this.favoriteRepository.findOne({
        where: { profileId: profile.id },
      });
    } else {
      throw new NotFoundException('Favorite list does not found');
    }
    return favoriteList;
  }

  async createFavoriteTrack(song: Song, music: Music, favoriteListId: number) {
    const favorite = await this.getUserFavoriteList(favoriteListId);
    const track = this.trackService.pushToFavoriteList(song, music, favorite);
    return track;
  }

  async clearFavoriteListContent(id: number): Promise<Favorite> {
    const favorite = await this.getUserFavoriteList(id);
    for (let i = 0; i < favorite.tracks.length; i++) {
      const favoItem = favorite.tracks[i];
      await this.trackService.deleteTrack(favoItem.id);
    }
    favorite.tracks = [];
    return await favorite.save();
  }
}

/*
(Favorite-List Controller):
- localhost:3000/favorite-lists --> Root Route (GET Method - Main-Endpoint - Controller Name)
- localhost:3000/favorite-lists/:id -->  (GET Method)
- localhost:3000/favorite-lists/:id/clear-favorite-list -->  (DELETE Method)
- localhost:3000/favorite-lists/:favoriteId/remove-track-from-favorite-list/:trackId -->  (DELETE Method)
*/
