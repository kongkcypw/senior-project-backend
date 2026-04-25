import { Controller, Get, Query, Res } from "@nestjs/common";
import type { Response } from "express";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { ConfidenceFallbackThreshold } from "../constants/intent-detect-confidence";
import { DialogflowFineTuneRunnerService } from "../services/dialogflow-fine-tune-runner.service";
import { DialogflowFindTuneService } from "../services/dialogflow-find-tune.service";

@Controller('dialogflow/fine-tune')
export class DialogflowFineTuneController {
    constructor(
        private readonly dialogflowFindTuneService: DialogflowFindTuneService,
        private readonly dialogflowFineTuneRunnerService: DialogflowFineTuneRunnerService,
    ) { }

    @Get('test')
    async test(@Query('message') message: string){
        const result = this.dialogflowFindTuneService.getDialogflowIntentAndConfidence(message);

        return result;
    }

    /**
     * Run the full dataset at a single threshold.
     *
     * GET /dialogflow/fine-tune/run
     * GET /dialogflow/fine-tune/run?threshold=0.7
     */
    @Get('run')
    async run(@Query('threshold') threshold?: string) {
        const parsedThreshold = threshold
            ? parseFloat(threshold)
            : ConfidenceFallbackThreshold;

        return this.dialogflowFineTuneRunnerService.runAll(parsedThreshold);
    }

    /**
     * Run the dataset ONCE against Dialogflow, then sweep across a threshold range.
     * Returns a JSON comparison table — useful for picking the best threshold for a report.
     *
     * GET /dialogflow/fine-tune/sweep?from=0.55&to=0.85&step=0.05
     *
     * Query params:
     *   from  (optional) default 0.50
     *   to    (optional) default 0.90
     *   step  (optional) default 0.05
     */
    @Get('sweep')
    async sweep(
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('step') step?: string,
    ) {
        return this.dialogflowFineTuneRunnerService.runSweep(
            from ? parseFloat(from) : 0.50,
            to   ? parseFloat(to)   : 0.90,
            step ? parseFloat(step) : 0.05,
        );
    }

    /**
     * Same as /sweep but downloads the result as a CSV file.
     * Convenient for pasting directly into Excel / Google Sheets for a report.
     *
     * GET /dialogflow/fine-tune/sweep/csv?from=0.55&to=0.85&step=0.05
     */
    @Get('sweep/csv')
    async sweepCsv(
        @Res() res: Response,
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('step') step?: string,
    ) {
        const summary = await this.dialogflowFineTuneRunnerService.runSweep(
            from ? parseFloat(from) : 0.50,
            to   ? parseFloat(to)   : 0.90,
            step ? parseFloat(step) : 0.05,
        );

        const csv = this.dialogflowFineTuneRunnerService.sweepToCsv(summary);
        const filename = `threshold-sweep_${summary.from}-${summary.to}_step${summary.step}.csv`;

        // Save to backend/reports/ so results persist for the report
        const reportsDir = join(process.cwd(), 'reports');
        await mkdir(reportsDir, { recursive: true });
        await writeFile(join(reportsDir, filename), csv, 'utf-8');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    }
}
