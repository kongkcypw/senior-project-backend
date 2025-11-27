import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { config } from "dotenv";
import { SeederOptions } from "typeorm-extension";

config();

const configService = new ConfigService();

const isProduction = configService.get('NODE_ENV') === 'production';

export const baseOptions: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: configService.getOrThrow<string>('POSTGRES_HOST'),
    port: configService.getOrThrow<number>('POSTGRES_PORT'),
    username: configService.getOrThrow<string>('POSTGRES_USER'),
    password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
    database: configService.getOrThrow<string>('POSTGRES_DB'),
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    synchronize: false,
    logging: configService.getOrThrow<boolean>('DB_LOG'),
    seeds: ['dist/db/seeds/*{.ts,.js}']
}

const productionSslConfig = isProduction 
    ? {
        ssl: {
            // Aiven requires the CA certificate for verification
            ca: configService.getOrThrow<string>('AIVEN_CA_CERT'),
            rejectUnauthorized: true, // Crucial for security
        }
    } 
    : {}; // No SSL config in development

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
    ...baseOptions,
    ...productionSslConfig,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;