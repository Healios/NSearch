<style scoped>
    .home {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .placeholder {
        position: relative;
        top: 0;
        left: 0;
        background-color: #f6f7f8;
        text-align: center;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: flex-start;
        padding-top: 15%;
    }

    .v-menu__content {
        border: 1px solid rgba(0, 0, 0, .1);
        border-radius: .248rem;
        box-shadow: 0 1px 3px rgba(50, 50, 93, .15),0 1px 0 rgba(0, 0, 0, .02);
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, .35);
        z-index: 7;
        user-select: none;
    }

    .black-border {
        border-radius: 2px;
        border: 1px solid rgba(0, 0, 0, .1);
    }

    .v-card {
        display: flex;
        flex-direction: column;
        color: #2C3E50;
        border: 1px solid white;
        box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
        width: 20rem;
        height: 15rem;
    }

    .v-card__title {
        padding-bottom: 0.5rem;
    }

    .headline {
        font-weight: 500;
    }

    .v-card__text {
        font-weight: 500;
        padding-top: 0.5rem;
        padding-bottom: 0;
    }

    .v-card__actions {
        display: flex;
        flex-grow: 1;
    }

    .v-card__actions a + a {
        margin-left: 1rem;
    }

    .link {
        font-weight: bold;
        font-size: 1.1rem;
    }

    .link.btn {
        border: 1px solid #5e72e4;
        border-radius: .248rem;
        transition: box-shadow .15s ease;
    }

    .link.btn.small {
        padding: 0.3rem 1.3rem;

    }

    .link.btn.normal {
        padding: 0.3rem 2rem;
    }

    .link.btn:hover {
        border: 1px solid #8296FF;
        box-shadow: 0 1px 3px rgba(130, 150, 255, .6),0 1px 0 rgba(0, 0, 0, .02);
    }

    .link.btn:not(:disabled):active {
        box-shadow: unset;
    }

    .input-padding {
        padding: 0 0.3rem;
    }
</style>

<i18n>
{
    "en": {
        "query": "Query",
        "rename": "Rename",
        "delete": "Delete",
        "reopen": "Reopen deleted query",
        "confirm": "Are you sure you want to delete this query?",
        "cancel": "Cancel",
        "noQueries": "No queries have been created.",
        "placeholder": "E.g. Captions",
        "saving": "Saving workspace"
    },
    "da": {
        "query": "Forespørgsel",
        "rename": "Omdøb",
        "delete": "Slet",
        "reopen": "Genåben slettet forespørgsel",
        "confirm": "Er du sikker på at du vil slette denne forespørgsel?",
        "cancel": "Annuller",
        "noQueries": "Der er ikke oprettet nogen forespørgsler.",
        "placeholder": "F. eks Captions",
        "saving": "Gemmer arbejdsplads"
    }
}
</i18n>

<template>
    <div class="home">
        <!-- Tabs -->
        <v-tabs light v-model="currentTab" show-arrows color="transparent" hide-slider>
            <!-- TODO: Add chip to notify user of results, when not viewing the tab. Should function like a notification. Once viewed don't show anymore. -->
            <v-tab :ripple="false" v-for="query in $store.state.queries" :key="query.GUID.toString()" @contextmenu="(event) => showContextMenu(event, query)">
                <span>{{ query.Name }}</span>
            </v-tab>
            <v-icon @click="addTab">add_box</v-icon>
            <v-spacer></v-spacer>
        </v-tabs>

        <v-tabs-items color="transparent" v-model="currentTab">
            <!-- Tab content -->
            <v-tab-item v-for="query in $store.state.queries" :key="query.GUID.toString()">
                <query-component v-if="$store.state.queries.length > 0"/>
            </v-tab-item>

            <!-- Placeholder -->
            <div class="placeholder" v-if="$store.state.queries.length === 0">
                <h1>{{ $t("noQueries") }}</h1>
            </div>
        </v-tabs-items>

        <!-- Dialogs -->
        <v-menu v-model="contextMenu" light :position-x="contextMenuX" :position-y="contextMenuY" :close-on-content-click="false" absolute transition="scale-transition">
            <v-list>
                <v-list-tile @click="showRenameDialog = true; contextMenu = false;">
                    <v-list-tile-title>{{ $t("rename") }}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="showDeleteDialog = true; contextMenu = false;">
                    <v-list-tile-title>{{ $t("delete") }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>

        <v-fade-transition>
            <div class="overlay" v-if="showRenameDialog">
                <div class="black-border">
                    <v-card light class="elevation-0">
                        <v-card-title class="headline">{{ $t("rename") }}</v-card-title>

                        <v-card-text>
                            <div class="input-padding">
                                <v-text-field v-model="tabName" :placeholder="$t('placeholder')"/>
                            </div>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <a @click="showRenameDialog = false" class="link">{{ $t("cancel") }}</a>
                            <a @click="renameTab" class="link btn small">{{ $t("rename") }}</a>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </div>
            </div>

            <div class="overlay" v-if="showDeleteDialog">
                <div class="black-border">
                    <v-card light class="elevation-0">
                        <v-card-title class="headline">{{ $t("delete") }}</v-card-title>

                        <v-card-text>
                            {{ $t("confirm") }}
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <a @click="showDeleteDialog = false" class="link">{{ $t("cancel") }}</a>
                            <a @click="deleteTab" class="link btn normal">{{ $t("delete") }}</a>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </div>
            </div>
        </v-fade-transition>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Query, ScanFileStatus, QueryFilePayload } from "@/Models/NSearch";
import QueryComponent from "@/Views/Query.vue";

export default Vue.extend({
    name: "Home",
    components:
    {
        QueryComponent,
    },
    data()
    {
        return {
            currentTab: 0,
            tabName: "",
            queryToHandle: new Query(""),
            contextMenu: false,
            contextMenuX: 0,
            contextMenuY: 0,
            showRenameDialog: false,
            showDeleteDialog: false,
        };
    },
    created()
    {
        this.$store.commit("setActivePage", "Home");

        // Add initial query.
        if (this.$store.state.queries.length > 0) return;
        this.$store.commit("addQuery", new Query(this.$t("query").toString() + "1"));
        this.$store.commit("setActiveQuery", this.$store.state.queries[0]);
    },
    watch:
    {
        currentTab(value)
        {
            // Set the active query. Only place this is handled.
            this.$store.commit("setActiveQuery", this.$store.state.queries[value]);
        },
    },
    methods:
    {
        addTab()
        {
            this.$store.commit("addQuery", new Query(this.$t("query").toString() + (this.$store.state.queries.length + 1)));
            this.currentTab = this.$store.state.queries.length - 1;
        },
        showContextMenu(event : MouseEvent, query : Query)
        {
            this.tabName = "";
            this.queryToHandle = query;

            event.preventDefault();
            this.contextMenu = true;
            this.contextMenuX = event.clientX;
            this.contextMenuY = event.clientY;
        },
        renameTab()
        {
            this.queryToHandle.Name = this.tabName;
            this.$store.commit("renameQuery", this.queryToHandle);
            this.showRenameDialog = false;
        },
        deleteTab()
        {
            // Remember to pause files before removing query.
            for (const scanFile of this.queryToHandle.Files)
            {
                scanFile.Status = ScanFileStatus.None;
                this.$store.commit("updateFile", new QueryFilePayload(this.queryToHandle, scanFile));
            }

            // TODO: Find a way to refactor this in a "nice way".
            // The issue is that removeQuery is called before unwatch().
            setTimeout(() => this.$store.commit("removeQuery", this.queryToHandle), 50);
            this.showDeleteDialog = false;
        },
    },
});
</script>
