<style>
    .v-navigation-drawer {
        display: flex;
        flex-direction: column;
        flex: 1 0 100%;
        user-select: none;
    }

    .navigation-drawer-avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 32px;
    }

    .navigation-drawer-items {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: center;
        padding-top: 0.5rem;
    }

    .navigation-drawer-item {
        padding-top: 1.3rem;
        padding-bottom: 1.3rem;
    }
</style>

<template>
    <v-navigation-drawer app :mini-variant="true" permanent hide-overlay>
        <div class="navigation-drawer-avatar">
            <h1 class="app-title">NSearch</h1>
        </div>

        <div class="navigation-drawer-items">
            <div class="navigation-drawer-item">
                <v-icon @click="scan" :disabled="!canScan" style="font-size: 42px;">fingerprint</v-icon>
            </div>

            <div class="grow"></div>

            <div class="navigation-drawer-item">
                <v-icon @click="switchPage" style="font-size: 32px; color: #CCCCCC;">fa-info-circle</v-icon>
            </div>
        </div>
    </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { ScanFile, ScanFileStatus, SearchMethods, Scanner, Query, QueryFilePayload, QueryResultPayload, Match } from "@/Models/NSearch";

export default Vue.extend({
    name: "Navbar",
    computed:
    {
        canScan() : boolean
        {
            if (this.$store.state.activePage === "About") return false;
            if (this.$store.state.activeQuery === undefined) return false;
            if (this.$store.state.activeQuery.Files.length <= 0) return false;
            if (this.$store.state.activeQuery.Terms.length <= 0) return false;
            return this.$store.state.activeQuery.Files.filter((file : ScanFile) => file.Status === ScanFileStatus.Processing).length <= 0;
        },
    },
    methods:
    {
        scan()
        {
            // Get index of active query.
            const index = this.$store.state.queries.findIndex((query : Query) => query.GUID === this.$store.state.activeQuery.GUID);
            if (index === -1) return;

            // Clear the previous results of the query.
            this.$store.commit("clearResultsFromQuery", this.$store.state.queries[index]);

            // Go through each file.
            // TODO: If there are more than e.g. 15 files, read each file synchronously instead of asynchronously. There is a big performance issue.
            this.$store.state.queries[index].Files.forEach((scanFile : ScanFile) =>
            {
                const scanner = new Scanner(scanFile);

                // Update the file status.
                scanFile.Status = ScanFileStatus.Processing;
                this.$store.commit("updateFile", new QueryFilePayload(this.$store.state.queries[index], scanFile));

                // Watch for cancellation.
                const unwatch = this.$store.watch((state) => this.$store.state.queries[index], (newVal) =>
                {
                    const file = newVal.Files.find((f : ScanFile) => f === scanFile);
                    if (file !== undefined && file.Status === ScanFileStatus.None)
                        scanner.stop();
                }, { deep: true });

                // Process the file.
                scanner.scan(
                (line : string) => // Examine the current line.
                {
                    if (this.$store.state.queries[index].Settings.SearchMethod === SearchMethods.Simple)
                        this.simpleScan(index, scanner, line);
                    else
                        this.regexScan(index, scanner, line);
                },
                () => // Add latest result to the query.
                {
                    this.$store.commit("addQueryResult", new QueryResultPayload(this.$store.state.queries[index], scanner.CurrentResult));
                },
                () => // After processing the file, update the status.
                {
                    // Remember to stop watching.
                    unwatch();

                    // Scan was cancelled and so we don't need to update the status.
                    if (scanFile.Status === ScanFileStatus.None) return;

                    // Update the file status.
                    scanFile.Status = ScanFileStatus.Processed;
                    this.$store.commit("updateFile", new QueryFilePayload(this.$store.state.queries[index], scanFile));
                });
            });
        },
        simpleScan(queryIndex : number, scanner : Scanner, line : string)
        {
            const matches = this.$store.state.queries[queryIndex].Terms
            .filter((term : string) => line.includes(term))
            .map((term : string) =>
            {
                return new Match(term, "<p>" + line.trim().replace(term, "<span class=\"highlight\">" + term + "</span>") + "</p>");
            });
            matches.forEach((match : Match) => scanner.CurrentResult.Matches.push(match));
        },
        regexScan(queryIndex : number, scanner : Scanner, line : string)
        {
            this.$store.state.queries[queryIndex].Terms.filter((term : string) =>
            {
                const regexFlags = this.$store.state.queries[queryIndex].Settings.RegexFlags.join("");
                const reg = new RegExp(term, regexFlags);
                const matches = reg.exec(line);

                if (matches !== null)
                {
                    let modifiedLine = line;

                    for (const match of matches)
                        modifiedLine = modifiedLine.replace(match, "<span class=\"highlight\">" + match + "</span>");

                    scanner.CurrentResult.Matches.push(new Match(term, `<p>${ modifiedLine }</p>`));
                }
            });
        },
        switchPage()
        {
            if (this.$router.currentRoute.name === "Home")
                this.$router.push("/about");
            else
                this.$router.push("/");
        },
    },
});
</script>
