import { Result, ScanFile } from "@/Models/NSearch";

export class Scanner
{
    // Properties.
    public ObjectTypes : string[] = ["Table", "TableExtension", "Page", "PageExtension", "Codeunit", "Report", "XMLport", "XmlPort", "Dataport", "Form"];
    public Encoding : string = "cp865";
    public Results : Result[] = [];
    public CurrentResult : Result = new Result("", "", "");


    // Variables.
    private file : ScanFile;
    private readline : any = require("readline");
    private fs : any = require("fs");
    private iconv : any = require("electron").remote.getGlobal("iconv");
    private readInterface : any;


    public constructor(file : ScanFile)
    {
        this.file = file;
    }


    // Methods.
    public scan(onReadLine : (line : string) => void, onResultAdded : () => void, onCloseFile : () => void) : void
    {
        this.readInterface = this.readline.createInterface(
        {
            input: this.fs.createReadStream(this.file.Path).pipe(this.iconv.decodeStream(this.Encoding)),
            output: process.stdout,
            console: false,
        });

        this.readInterface.on("line", (line : string) =>
        {
            // Find the current object and parse it's object information.
            if (this.ObjectTypes.find(type => line.includes("OBJECT " + type)))
                this.CurrentResult = this.getFOBObject(line);
            else if (this.ObjectTypes.find(type => this.file.Path.endsWith(".al") && line.startsWith(type + " ")))
                this.CurrentResult = this.getALObject(line);

            // We've reached the end of an object.
            // If we've found an object and we have a result add it to the list.
            if (line.startsWith("}") && this.CurrentResult.ObjectNumber !== "" && this.CurrentResult.Matches.length > 0)
            {
                this.Results.push(this.CurrentResult);
                onResultAdded();
            }

            onReadLine(line);
        });

        this.readInterface.on("close", () =>
        {
            onCloseFile();
        });
    }

    public stop() : void
    {
        if (this.readInterface === undefined) return;
        this.readInterface.close();
    }

    private getFOBObject(line : string) : Result
    {
        const objectType = line.split(" ")[1];
        const objectNumber = line.split(" ")[2];
        const objectName = line.trim().substring(line.indexOf(objectNumber) + objectNumber.length, line.length).trim();
        return new Result(objectNumber, objectType, objectName);
    }

    private getALObject(line : string) : Result
    {
        const objectType = line.split(" ")[0];
        const objectNumber = line.split(" ")[1];
        const objectName = line.trim().substring(line.indexOf(objectNumber) + objectNumber.length, line.length).trim();
        return new Result(objectNumber, objectType, objectName);
    }
}
