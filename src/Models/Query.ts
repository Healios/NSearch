import { Guid } from "guid-typescript";
import { ScanFile, Result, Settings } from "@/Models/NSearch";


export class Query
{
    public readonly GUID : Guid;
    public Name : string = "";
    public Terms : string[] = [];
    public Files : ScanFile[] = [];
    public Results : Result[] = [];
    public Settings : Settings = new Settings();

    public constructor(name : string)
    {
        this.GUID = Guid.create();
        this.Name = name;
    }
}
