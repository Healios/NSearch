import { ScanFileStatus } from "@/Models/NSearch";

export class ScanFile
{
    public Status : ScanFileStatus;
    public Path : string;
    public Name : string;

    public constructor(status : ScanFileStatus, path : string, name : string)
    {
        this.Status = status;
        this.Path = path;
        this.Name = name;
    }
}
