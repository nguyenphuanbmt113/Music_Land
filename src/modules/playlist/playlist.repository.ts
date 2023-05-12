import { Injectable } from '@nestjs/common';
import { Playlist } from 'src/entities/playlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlaylistRepository extends Repository<Playlist> {
  async getUserPlaylists(userId: number): Promise<Playlist[]> {
    const query = this.createQueryBuilder('playlist').select();
    if (userId) {
      query.where('playlist.userId = :userId', { userId });
      const playlists = await query
        .leftJoinAndSelect('playlist.tracks', 'track')
        .getMany();
      return playlists;
    } else {
      return [];
    }
  }
}
