import { Injectable } from "@nestjs/common";
import { IntentDataset } from "../constants/intent-dataset";
import { DialogflowFindTuneService } from "./dialogflow-find-tune.service";

export type FineTuneResult = {
    queryInputText: string;
    expectedIntentName: string;
    actualIntentName: string | null;
    confidence: number | null;
    passed: boolean;
};

export type IntentBreakdown = {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
};

export type FineTuneSummary = {
    threshold: number;
    total: number;
    passed: number;
    failed: number;
    passRate: number;
    /** Pass rate broken down per expectedIntentName — highlights weak intents (especially Default Fallback Intent). */
    byIntent: Record<string, IntentBreakdown>;
    results: FineTuneResult[];
};

export type RawDialogflowResult = {
    queryInputText: string;
    expectedIntentName: string;
    rawIntentName: string | null;
    confidence: number | null;
};

export type ThresholdSweepRow = {
    threshold: number;
    total: number;
    passed: number;
    failed: number;
    passRate: number;
    /** Per-intent pass rate at this threshold. */
    byIntent: Record<string, IntentBreakdown>;
};

export type ThresholdSweepSummary = {
    from: number;
    to: number;
    step: number;
    bestThreshold: number;
    bestPassRate: number;
    sweep: ThresholdSweepRow[];
};

@Injectable()
export class DialogflowFineTuneRunnerService {
    constructor(
        private readonly dialogflowFindTuneService: DialogflowFindTuneService,
    ) { }

    private applyThreshold(raw: RawDialogflowResult[], threshold: number): FineTuneResult[] {
        return raw.map((entry) => {
            // Mirror the same fallback logic as dialogflow-webhook.service.ts:
            // 1. No intent returned at all
            // 2. Dialogflow explicitly matched Default Fallback Intent (confidence: 1)
            // 3. Real intent matched but confidence is below threshold (ambiguous query)
            const effectiveIntentName =
                !entry.rawIntentName ||
                entry.rawIntentName === 'Default Fallback Intent' ||
                (entry.confidence ?? 0) < threshold
                    ? 'Default Fallback Intent'
                    : entry.rawIntentName;

            return {
                queryInputText: entry.queryInputText,
                expectedIntentName: entry.expectedIntentName,
                actualIntentName: effectiveIntentName,
                confidence: entry.confidence,
                passed: effectiveIntentName === entry.expectedIntentName,
            };
        });
    }

    private buildByIntent(results: FineTuneResult[]): Record<string, IntentBreakdown> {
        const map: Record<string, { total: number; passed: number }> = {};

        for (const r of results) {
            if (!map[r.expectedIntentName]) {
                map[r.expectedIntentName] = { total: 0, passed: 0 };
            }
            map[r.expectedIntentName].total++;
            if (r.passed) map[r.expectedIntentName].passed++;
        }

        const byIntent: Record<string, IntentBreakdown> = {};
        for (const [intent, counts] of Object.entries(map)) {
            byIntent[intent] = {
                total: counts.total,
                passed: counts.passed,
                failed: counts.total - counts.passed,
                passRate: parseFloat(((counts.passed / counts.total) * 100).toFixed(2)),
            };
        }

        return byIntent;
    }

    private buildSummary(threshold: number, results: FineTuneResult[]): FineTuneSummary {
        const passed = results.filter((r) => r.passed).length;
        const total = results.length;
        return {
            threshold,
            total,
            passed,
            failed: total - passed,
            passRate: parseFloat(((passed / total) * 100).toFixed(2)),
            byIntent: this.buildByIntent(results),
            results,
        };
    }

    /** Fetch raw Dialogflow results for the full dataset once — reused by sweep. */
    async fetchRawResults(): Promise<RawDialogflowResult[]> {
        const raw: RawDialogflowResult[] = [];

        for (const entry of IntentDataset) {
            const response = await this.dialogflowFindTuneService.getDialogflowIntentAndConfidence(
                entry.queryInputText,
            );
            raw.push({
                queryInputText: entry.queryInputText,
                expectedIntentName: entry.expectedIntentName,
                rawIntentName: response?.intentName ?? null,
                confidence: response?.intentDetectionConfidence ?? null,
            });
        }

        return raw;
    }

    async runAll(threshold: number): Promise<FineTuneSummary> {
        const raw = await this.fetchRawResults();
        const results = this.applyThreshold(raw, threshold);
        return this.buildSummary(threshold, results);
    }

    /**
     * Run the dataset ONCE against Dialogflow, then apply every threshold in
     * [from, to] with the given step to produce a comparison table.
     * This avoids redundant API calls — total calls = dataset size, not dataset × steps.
     */
    async runSweep(from: number, to: number, step: number): Promise<ThresholdSweepSummary> {
        const raw = await this.fetchRawResults();

        // Build threshold list with fixed-point rounding to avoid float drift (0.7000000001 etc.)
        const thresholds: number[] = [];
        for (let t = from; parseFloat(t.toFixed(10)) <= to; t += step) {
            thresholds.push(parseFloat(t.toFixed(4)));
        }

        const sweep: ThresholdSweepRow[] = thresholds.map((threshold) => {
            const results = this.applyThreshold(raw, threshold);
            const passed = results.filter((r) => r.passed).length;
            const total = results.length;
            return {
                threshold,
                total,
                passed,
                failed: total - passed,
                passRate: parseFloat(((passed / total) * 100).toFixed(2)),
                byIntent: this.buildByIntent(results),
            };
        });

        const best = sweep.reduce((a, b) => (b.passRate > a.passRate ? b : a));

        return {
            from,
            to,
            step,
            bestThreshold: best.threshold,
            bestPassRate: best.passRate,
            sweep,
        };
    }

    /**
     * Convert a sweep summary to CSV.
     * Format: one row per (threshold × intent) — flat table easy to filter in Excel / Google Sheets.
     *
     * Columns: threshold | intentName | total | passed | failed | passRate | isOverall
     * The OVERALL row per threshold lets you quickly sort by overall passRate.
     */
    sweepToCsv(summary: ThresholdSweepSummary): string {
        const header = 'threshold,intentName,total,passed,failed,passRate,isOverall';
        const rows: string[] = [];

        for (const row of summary.sweep) {
            // Per-intent rows
            for (const [intent, b] of Object.entries(row.byIntent)) {
                rows.push(`${row.threshold},${intent},${b.total},${b.passed},${b.failed},${b.passRate},false`);
            }
            // Overall row for this threshold
            rows.push(`${row.threshold},OVERALL,${row.total},${row.passed},${row.failed},${row.passRate},true`);
        }

        return [header, ...rows].join('\n');
    }
}
