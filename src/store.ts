import Vue from "vue";
import Vuex from "vuex";
import { Query, QueryFilePayload, QueryResultPayload, ScanFile, SearchMethods } from "@/Models/NSearch";
Vue.use(Vuex);

export default new Vuex.Store({
    state:
    {
        activePage: "",
        queries: Array<Query>(),
        deletedQueries: Array<Query>(), // Not used atm.
        activeQuery: new Query(""),
    },
    mutations:
    {
        setActivePage(state : any, pageName : string)
        {
            state.activePage = pageName;
        },
        setActiveQuery(state : any, query : Query)
        {
            state.activeQuery = query;
        },
        addQuery(state : any, query : Query)
        {
            state.queries.push(query);
        },
        removeQuery(state : any, query : Query)
        {
            const index = state.queries.findIndex((q : Query) => q.GUID === query.GUID);
            if (index > -1) state.deletedQueries.push(state.queries.splice(index, 1)[0]);
        },
        renameQuery(state : any, query : Query)
        {
            const foundQuery = state.queries.find((q : Query) => q.GUID === query.GUID);
            if (foundQuery !== undefined)
            foundQuery.Name = query.Name;
        },
        addFile(state : any, file : ScanFile)
        {
            state.activeQuery.Files.push(file);
        },
        // This doesn't modify the active query because we might update the file status of a "non-active" query.
        updateFile(state : any, payload : QueryFilePayload)
        {
            const query = state.queries.find((q : Query) => q.GUID === payload.Query.GUID);
            if (query === undefined) return;

            const file = query.Files.find((f : ScanFile) => f === payload.File);
            if (file !== undefined) file.Status = payload.File.Status;
        },
        removeFile(state : any, scanFile : ScanFile)
        {
            const index = state.activeQuery.Files.findIndex((f : ScanFile) => f === scanFile);
            if (index > -1) state.activeQuery.Files.splice(index, 1);
        },
        setTerms(state : any, terms : string[])
        {
            state.activeQuery.Terms = terms;
        },
        addTerm(state : any, term : string)
        {
            state.activeQuery.Terms.push(term);
        },
        removeTerm(state : any, term : string)
        {
            const index = state.activeQuery.Terms.findIndex((t : string) => t === term);
            if (index > -1) state.activeQuery.Terms.splice(index, 1);
        },
        setSearchMethod(state : any, searchMethod : SearchMethods)
        {
            state.activeQuery.Settings.SearchMethod = searchMethod;
        },
        addRegexFlag(state : any, flag : string)
        {
            state.activeQuery.Settings.RegexFlags.push(flag);
        },
        removeRegexFlag(state : any, flag : string)
        {
            const index = state.activeQuery.Settings.RegexFlags.findIndex((f : string) => f === flag);
            if (index > -1) state.activeQuery.Settings.RegexFlags.splice(index, 1);
        },
        addQueryResult(state : any, payload : QueryResultPayload)
        {
            const query = state.queries.find((q : Query) => q.GUID === payload.Query.GUID);
            if (query === undefined) return;

            query.Results.push(payload.Result);
        },
        clearResultsFromQuery(state : any, query : Query)
        {
            const foundQuery = state.queries.find((q : Query) => q.GUID === query.GUID);
            if (foundQuery === undefined) return;

            foundQuery.Results = [];
        },
    },
    actions:
    {
    },
});
