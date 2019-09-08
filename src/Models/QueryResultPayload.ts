import { Query, Result } from "@/Models/NSearch";

export class QueryResultPayload
{
    public Query : Query;
    public Result : Result;

    public constructor(query : Query, result : Result)
    {
        this.Query = query;
        this.Result = result;
    }
}
