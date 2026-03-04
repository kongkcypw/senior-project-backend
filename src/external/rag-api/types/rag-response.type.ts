export type RagResponse = {
    status: string;
    agent_workflow: string;
    data_retrieved: any[];
    generated_sql: string;
    response: string;
}