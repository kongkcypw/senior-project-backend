import { ConfigService as NestConfigService } from "@nestjs/config";

export class BaseConfigService<T extends string> {
    constructor(private nestConfigService: NestConfigService){}

    private getConfig(key: T): string {
        const value = this.nestConfigService.get<string>(key);

        if (value !== undefined && value !== ''){
            return value
        }

        throw new Error(`Config key ${key} is not defined or empty`);
    }

    protected getAsString(key: T): string {
        return this.getConfig(key);
    }

    protected getAsNumber(key: T): number {
        const value = this.getConfig(key);
        const parsedValue = Number(value);
        if (isNaN(parsedValue)) {
            throw new Error(`Config key ${key} cannot be parsed as number`);
        }
        return parsedValue;
    }
}