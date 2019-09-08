<style scoped>
    .result {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .result-title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .theme--dark.v-list {
        border-radius: .248rem;
        background-color: white;
        color: #2c3e50;
    }

    .v-list__tile {
        padding: 0.5rem 0.1rem;
        height: auto;
    }

    .v-list__tile__title {
        height: auto;
        font-weight: 600;
        font-size: 0.87em;
    }

    th {
        text-align: left;
    }

    a {
        user-select: none;
        font-weight: 600;
        color: #2c3e50;
    }

    .object {
        font-weight: bold;
    }

    .v-btn-toggle {
        /* flex-direction: column;
        align-items: flex-start; */
        background-color: transparent;
    }

    .v-btn-toggle .v-btn {
        font-weight: 600;
        font-size: 1rem;
        color: #656666;
        opacity: .8;
        padding: 0;
    }

    /* .v-btn-toggle > .v-btn + .v-btn {
        padding-left: 1rem;
    } */

    .v-btn-toggle .v-btn.v-btn--active {
        color: #5e72e4;
    }

    .v-btn--active:before, .v-btn:hover:before, .v-btn:focus:before {
        background-color: transparent;
    }

    .v-input--selection-controls {
        margin: 0;
        padding: 0;
    }

    .v-input {
        justify-content: center;
    }

    .result .theme--dark.v-icon {
        color: #2C3E50;
        margin-right: 0.2rem;
    }

    .span-click {
        cursor: pointer;
    }
</style>

<style>
    .result p {
        margin-bottom: 0;
    }

    .result .v-chip .v-chip__content {
        color: #656666;
        padding: 0.1rem 0.3rem;
        height: auto;
    }

    .result .v-input--selection-controls__input {
        margin-right: 0;
    } 

    .theme--dark.v-chip {
        background-color: rgba(0, 0, 0, .1);
    }

    .result .v-expansion-panel__header {
        padding: 0;
        min-height: auto;
    }

    .result .theme--light.v-expansion-panel .v-expansion-panel__container {
        background-color: transparent;
        color: #2C3E50;
    }

    .highlight {
        /* color: white; */
        background-color: rgba(0, 0, 0, .16);
        border-radius: .248rem;
    }
</style>


<i18n>
{
    "en": {
        "results": "Results",
        "no": "No.",
        "type": "Type",
        "name": "Name",
        "line": "Line",
        "clear": "Clear results",
        "expand": "Expand all",
        "collapse": "Collapse all"
    },
    "da": {
        "results": "Resultater",
        "no": "Nr.",
        "type": "Type",
        "name": "Navn",
        "line": "Linje",
        "clear": "Ryd resultater",
        "expand": "Udvid alle",
        "collapse": "Indskrænk alle"
    }
}
</i18n>

<template>
    <div class="result">
        <div class="result-title">
            <h1 class="headline">{{ $t("results") }}</h1>
            <v-spacer></v-spacer>
            <v-tooltip left v-if="$store.state.activeQuery.Results.length > 0">
                <template v-slot:activator="{ on }">
                    <v-icon light v-on="on" @click="clearResults">delete</v-icon>
                </template>
                <span>{{ $t("clear") }}</span>
            </v-tooltip>
        </div>

        <v-btn-toggle v-model="objectTypeFilter" multiple class="elevation-0">
            <v-btn v-for="type in objectTypes" :key="type" flat :ripple="false">
                {{ type }}
                <v-chip label>
                    {{ $store.state.activeQuery.Results.filter(result => result.ObjectType === type).length }}
                </v-chip>
            </v-btn>
        </v-btn-toggle>

        <v-layout row wrap>
            <!-- Headers -->
            <v-flex xs2>
                <span class="span-click" @click="sortColumn('ObjectNumber')">
                    <v-icon small v-if="sort.Column === 'ObjectNumber' && sort.Asc">fa-sort-numeric-up</v-icon>
                    <v-icon small v-if="sort.Column === 'ObjectNumber' && !sort.Asc">fa-sort-numeric-down</v-icon>
                    <a>{{ $t("no") }}</a>
                </span>
            </v-flex>
            <v-flex xs2>
                <span class="span-click" @click="sortColumn('ObjectType')">
                    <v-icon small v-if="sort.Column === 'ObjectType' && sort.Asc">fa-sort-alpha-up</v-icon>
                    <v-icon small v-if="sort.Column === 'ObjectType' && !sort.Asc">fa-sort-alpha-down</v-icon>
                    <a>{{ $t("type") }}</a>
                </span>
            </v-flex>
            <v-flex xs5>
                <span class="span-click" @click="sortColumn('ObjectName')">
                    <v-icon small v-if="sort.Column === 'ObjectName' && sort.Asc">fa-sort-alpha-up</v-icon>
                    <v-icon small v-if="sort.Column === 'ObjectName' && !sort.Asc">fa-sort-alpha-down</v-icon>
                    <a>{{ $t("name") }}</a>
                </span>
            </v-flex>
            <v-flex xs3 style="text-align: right;">
                <a @click="expandAll" v-if="!oneOrMoreExpanded">{{ $t("expand") }}</a>
                <a @click="collapseAll" v-if="oneOrMoreExpanded">{{ $t("collapse") }}</a>
            </v-flex>

            <v-flex v-for="(result, index) in sortedAndFiltered" :key="result.ObjectNumber + result.ObjectName" xs12>
                <v-expansion-panel v-model="panel[index]" expand light class="elevation-0">
                    <v-expansion-panel-content>
                        <template v-slot:actions>
                            <div></div>
                        </template>

                        <template v-slot:header>
                            <!-- Object Info -->
                            <v-layout style="background-color: rgba(0, 0, 0, 0.1);">
                                <v-flex xs2><p class="object">{{ result.ObjectNumber }}</p></v-flex>
                                <v-flex xs2><p class="object">{{ result.ObjectType }}</p></v-flex>
                                <v-flex xs8><p class="object">{{ result.ObjectName }}</p></v-flex>
                            </v-layout>
                        </template>

                        <!-- Line & Matched Term -->
                        <v-flex v-for="match in result.Matches" :key="match.GUID.toString()" xs12>
                            <div v-html="match.Line"></div>
                        </v-flex>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Guid } from "guid-typescript";
import { Result, Match } from "@/Models/NSearch";

export default Vue.extend({
    name: "Result",
    data()
    {
        return {
            objectTypes: ["Table", "Page", "Report", "Codeunit", "XML Port", "Form"],
            objectTypeFilter: [0, 1, 2, 3, 4, 5],
            sort: { Column: "ObjectNumber", Asc: true },
            panel: new Array<boolean[]>(),
        };
    },
    computed:
    {
        sortedAndFiltered() : Result[]
        {
            return this.$store.state.activeQuery.Results
                    // Show only results for selected object types.
                    .filter((result : Result) => this.objectTypeFilter.includes(this.objectTypes.indexOf(result.ObjectType)))
                    .sort((curr : Result, previous : Result) =>
                    {
                        // Sort number values.
                        if (this.sort.Column === "ObjectNumber")
                            if (this.sort.Asc)
                            {
                                if (parseInt(curr.ObjectNumber, 0) < parseInt(previous.ObjectNumber, 0))
                                    return -1;
                                else if (parseInt(curr.ObjectNumber, 0) > parseInt(previous.ObjectNumber, 0))
                                    return 1;
                            }
                            else
                            {
                                if (parseInt(curr.ObjectNumber, 0) < parseInt(previous.ObjectNumber, 0))
                                    return 1;
                                else if (parseInt(curr.ObjectNumber, 0) > parseInt(previous.ObjectNumber, 0))
                                    return -1;
                            }

                        // Sort string values.
                        if (this.sort.Asc)
                        {
                            if (curr[this.sort.Column] < previous[this.sort.Column])
                                return -1;
                            else if (curr[this.sort.Column] > previous[this.sort.Column])
                                return 1;
                        }
                        else
                        {
                            if (curr[this.sort.Column] < previous[this.sort.Column])
                                return 1;
                            else if (curr[this.sort.Column] > previous[this.sort.Column])
                                return -1;
                        }

                        return 0;
                    });
        },
        oneOrMoreExpanded() : boolean
        {
            return this.panel.filter((values : boolean[]) => values.filter((val : boolean) => val === true).length > 0).length > 0;
        },
    },
    methods:
    {
        sortColumn(column : string)
        {
            if (this.sort.Column === column)
                this.sort = { Column: column, Asc: !this.sort.Asc };
            else
                this.sort = { Column: column, Asc: true };
        },
        expandAll()
        {
            this.panel = this.sortedAndFiltered.map(() => [true]);
        },
        collapseAll()
        {
            this.panel = [[]];
        },
        clearResults()
        {
            this.$store.commit("clearResultsFromQuery", this.$store.state.activeQuery);
        },
    },
});
</script>
