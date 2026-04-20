import { Injectable } from "@nestjs/common";
import { WorkoutRoutineEntity } from "../entities/workout-routine.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class WorkoutRoutineRepository extends Repository<WorkoutRoutineEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutRoutineEntity, datasource.createEntityManager());
    }

    findByIdWithExercisesAndSets(id: number): Promise<WorkoutRoutineEntity | null> {
        return this.createQueryBuilder('routine')
            .leftJoinAndSelect('routine.exercises', 'exercise')
            .leftJoinAndSelect('exercise.setDetails', 'setDetail')
            .where('routine.id = :id', { id })
            .orderBy('exercise.orderInRoutine', 'ASC')
            .addOrderBy('setDetail.set', 'ASC')
            .getOne();
    }
}