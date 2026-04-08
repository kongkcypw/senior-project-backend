import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /** Lightweight ping — keeps the Render free-tier instance awake. */
  @Get('health')
  @HttpCode(200)
  health(): { status: string } {
    return { status: 'ok' };
  }

  /** DB ping — verifies the PostgreSQL connection is alive. */
  @Get('health/db')
  @HttpCode(200)
  async healthDb(): Promise<{ status: string; latencyMs: number }> {
    const start = Date.now();
    await this.dataSource.query('SELECT 1');
    return { status: 'ok', latencyMs: Date.now() - start };
  }
}
