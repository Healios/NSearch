import { Guid } from "guid-typescript";
import { Match } from "@/Models/NSearch";

export class Result
{
    [key : string] : any;

    public GUID : Guid;
    public ObjectNumber : string;
    public ObjectType : string;
    public ObjectName : string;
    public Matches : Match[];

    public constructor(objectNumber : string, objectType : string, objectName : string)
    {
        this.GUID = Guid.create();
        this.ObjectNumber = objectNumber;
        this.ObjectType = objectType;
        this.ObjectName = objectName;
        this.Matches = [];
    }
}
