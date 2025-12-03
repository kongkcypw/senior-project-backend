import { MigrationInterface, QueryRunner } from "typeorm";

const EXERCISE_TEMPLATE_TABLE = 'workout_exercise_template';

export class InsertWorkoutExerciseTemplate1764783513524 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // Data derived directly from your MockWorkoutExerciseTemplates seed file
        const templateData = [
            // routine_template_id: 1 (Push)
            { id: 1, routine_template_id: 1, name: 'Barbell Bench Press', rest_time_second: 120, image_url: 'https://www.shutterstock.com/shutterstock/videos/1017371524/thumb/1.jpg?ip=x480', order_in_routine: 1 },
            { id: 2, routine_template_id: 1, name: 'Incline Dumbbell Press', rest_time_second: 90, image_url: 'https://static.strengthlevel.com/images/exercises/incline-dumbbell-bench-press/incline-dumbbell-bench-press-800.jpg', order_in_routine: 2 },
            { id: 3, routine_template_id: 1, name: 'Dumbbell Lateral Raise', rest_time_second: 60, image_url: 'https://cdn.shopify.com/s/files/1/0754/7279/8002/files/Blog-dumbbells_3.webp?v=1739252606', order_in_routine: 3 },

            // routine_template_id: 2 (Pull)
            { id: 4, routine_template_id: 2, name: 'Lat Pulldowns', rest_time_second: 120, image_url: 'https://s3assets.skimble.com/assets/2900765/image_iphone.jpg', order_in_routine: 1 },
            { id: 5, routine_template_id: 2, name: 'T-Bar/Barbell Row', rest_time_second: 90, image_url: 'http://example.com/images/t_bar_row.jpg', order_in_routine: 2 },
            { id: 6, routine_template_id: 2, name: 'Face Pulls', rest_time_second: 60, image_url: 'https://s3assets.skimble.com/assets/2591179/image_full.jpg', order_in_routine: 3 },

            // routine_template_id: 3 (Legs)
            { id: 7, routine_template_id: 3, name: 'Barbell Back Squat', rest_time_second: 180, image_url: 'https://cdn.shopify.com/s/files/1/1497/9682/files/2_cfb27f9d-2dea-40d7-9229-5899794c8f31.jpg?v=1653566234', order_in_routine: 1 },
            { id: 8, routine_template_id: 3, name: 'Romanian Deadlift (RDL)', rest_time_second: 90, image_url: 'https://cdn.shopify.com/s/files/1/1497/9682/files/2_cfb27f9d-2dea-40d7-9229-5899794c8f31.jpg?v=1653566234', order_in_routine: 2 },
            // Standalone Exercises (Library)
            { id: 9, routine_template_id: null, name: 'Hack Squat', rest_time_second: 90, image_url: 'https://s3assets.skimble.com/assets/2759493/image_full.jpg', order_in_routine: null },
            { id: 10, routine_template_id: null, name: 'Seated Leg Curl', rest_time_second: 60, image_url: 'https://static.strengthlevel.com/images/illustrations/seated-leg-curl-1000x1000.jpg', order_in_routine: null },
            { id: 11, routine_template_id: null, name: 'Cable Crunch (Abs)', rest_time_second: 60, image_url: 'https://www.hevyapp.com/wp-content/uploads/01751201-Cable-Kneeling-Crunch_Waist.jpg', order_in_routine: null },
            { id: 12, routine_template_id: null, name: 'Standing Dumbbell Bicep Curl', rest_time_second: 75, image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTipsfkQAHv_b6_gdgfSsVKuiTAH-RQgWdc2A&s', order_in_routine: null },
            { id: 13, routine_template_id: null, name: 'Overhead Dumbbell Tricep Extension', rest_time_second: 75, image_url: 'https://training.fit/wp-content/uploads/2020/03/trizepsdruecken-beidarmig-kurzhantel-800x448.png', order_in_routine: null },
            { id: 14, routine_template_id: null, name: 'Standing Calf Raise', rest_time_second: 60, image_url: 'https://i.pinimg.com/736x/bb/27/c8/bb27c80098a7f8e8928a6e8ca39e8338.jpg', order_in_routine: null },
            { id: 15, routine_template_id: null, name: 'Dumbbell Pullover', rest_time_second: 90, image_url: 'https://static.strengthlevel.com/images/exercises/dumbbell-pullover/dumbbell-pullover-800.jpg', order_in_routine: null },
        ];

        // Execute dynamic INSERT queries
        for (const data of templateData) {
            await queryRunner.query(
                `INSERT INTO ${EXERCISE_TEMPLATE_TABLE} (id, routine_template_id, name, rest_time_second, image_url, order_in_routine) 
                 VALUES ($1, $2, $3, $4, $5, $6) 
                 ON CONFLICT (id) DO NOTHING;`,
                [
                    data.id,
                    data.routine_template_id,
                    data.name,
                    data.rest_time_second,
                    data.image_url,
                    data.order_in_routine
                ]
            );
        }

        // Reset the sequence to ensure auto-increment starts after the seeded IDs
        await queryRunner.query(
            `SELECT setval('${EXERCISE_TEMPLATE_TABLE}_id_seq', (SELECT MAX(id) FROM ${EXERCISE_TEMPLATE_TABLE}), TRUE);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Delete all records inserted by this migration
        await queryRunner.query(`DELETE FROM ${EXERCISE_TEMPLATE_TABLE} WHERE id BETWEEN 1 AND 15;`);
    }
}