export class LogSetDto {
    exerciseId!: number;
    setNumber!: number;
    rep!: number;
    weightKg!: number | null;
    notes?: string;
}

export class LogSessionDto {
    sessionId!: number;
    finishedAt!: string;
    sets!: LogSetDto[];
}
