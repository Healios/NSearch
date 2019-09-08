import { Query, ScanFile } from "@/Models/NSearch";

export class QueryFilePayload
{
    public Query : Query;
    public File : ScanFile;

    public constructor(query : Query, file : ScanFile)
    {
        this.Query = query;
        this.File = file;
    }
}
