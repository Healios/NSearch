import { Guid } from "guid-typescript";

export class Match
{
    public readonly GUID : Guid;
    public Term : string;
    public Line : string;

    public constructor(term : string, line : string)
    {
        this.GUID = Guid.create();
        this.Term = term;
        this.Line = line;
    }
}
