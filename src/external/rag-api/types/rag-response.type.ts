export type RagResponse = {
    status: string;
    agent_workflow: string;
    gemini_call_count: number;
    data_retrieved: any[];
    generated_sql: string;
    response: string;
}