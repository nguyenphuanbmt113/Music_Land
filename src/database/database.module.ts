import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import { Playlist } from 'src/entities/playlist.entity';
import { Music } from 'src/entities/music.entity';
import { Profile } from 'src/entities/profile.entity';
import { Track } from 'src/entities/track.entity';
import { Song } from 'src/entities/song.entity';
import { Singer } from 'src/entities/singer.entity';
import { SingerAlbum } from 'src/entities/singer-album.entity';
import { Musician } from 'src/entities/musician.entity';
import { MusicianAlbum } from 'src/entities/musician-album.entity';
import { Favorite } from 'src/entities/favorite.entity';
import { ForgottenPassword } from 'src/entities/password-forgot.entity';
import { EmailVerification } from 'src/entities/email-verify.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [
          User,
          Playlist,
          Music,
          Profile,
          Track,
          Song,
          Singer,
          SingerAlbum,
          Musician,
          MusicianAlbum,
          Favorite,
          EmailVerification,
          ForgottenPassword,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
