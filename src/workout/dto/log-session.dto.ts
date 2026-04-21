export class LogSetDto {
    exerciseId!: number;
    setNumber!: number;
    reps!: number;
    weightKg!: number | null;
    notes?: string;
}

export class LogSessionDto {
    sessionId!: number;
    finishedAt!: string;
    sets!: LogSetDto[];
}
