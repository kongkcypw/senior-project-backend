import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { WorkoutExerciseTemplateEntity } from '../entities/workout-exercise-template.entity';

@Injectable()
export class WorkoutExerciseTemplateRepository extends Repository<WorkoutExerciseTemplateEntity> {
    constructor(private dataSource: DataSource) {
        super(WorkoutExerciseTemplateEntity, dataSource.createEntityManager());
    }
}
