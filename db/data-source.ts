import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { config } from "dotenv";
import { SeederOptions } from "typeorm-extension";

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: configService.getOrThrow<string>('POSTGRES_HOST'),
    port: configService.getOrThrow<number>('POSTGRES_PORT'),
    username: configService.getOrThrow<string>('POSTGRES_USER'),
    password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
    database: configService.getOrThrow<string>('POSTGRES_DB'),
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    synchronize: configService.getOrThrow<string>('ENV') !== 'production',
    logging: configService.getOrThrow<boolean>('DB_LOG'),
    seeds: ['dist/db/seeds/*{.ts,.js}']
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;