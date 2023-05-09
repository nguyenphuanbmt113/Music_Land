import { AbstractArtist } from 'src/common/class/abstract-artist';
import { Entity, OneToMany, Unique } from 'typeorm';
import { SingerAlbum } from './singer-album.entity';

@Entity('singers')
@Unique(['name'])
export class Singer extends AbstractArtist {
  @OneToMany(() => SingerAlbum, (singerAlbum) => singerAlbum.singer, {
    eager: false,
  })
  singerAlbums: SingerAlbum[];
}
