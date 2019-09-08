import { SearchMethods } from "@/Models/NSearch";

export class Settings
{
    public SearchMethod : SearchMethods = SearchMethods.Simple;
    public RegexFlags : string[] = ["g"];

    public constructor()
    {
    }
}
