<style scoped>
    .terms {
        display: flex;
        flex-direction: column;
        user-select: none;
    }

    .v-text-field {
        margin: 0;
        margin-top: 0.2rem;
        margin-bottom: 0.5rem;
        padding: 0;
    }

    .v-input {
        flex: 0 0 auto;
    }

    .regex-icon {
        margin-left: 0.5rem;
    }

    .v-menu__content {
        border: 1px solid rgba(0, 0, 0, .1);
        border-radius: .248rem;
        box-shadow: 0 1px 3px rgba(50, 50, 93, .15),0 1px 0 rgba(0, 0, 0, .02);
    }

    .active {
        background-color: rgba(0, 0, 0, .08);
    }
</style>

<style>
    .terms .v-input__slot {
        color: #2C3E50 !important;
        box-shadow: 0 1px 3px rgba(50, 50, 93, .15),0 1px 0 rgba(0, 0, 0, .02);
        border: 0;
        transition: box-shadow .15s ease;
        font-size: 1rem;
        font-weight: normal;
        padding: .625rem .75rem !important;
        border-radius: .25rem;
        background-color: #fff;
        background-clip: padding-box;
    }

    .terms .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
        border: none;
    }

    .terms .theme--light.v-text-field:not(.v-input--has-state) > .v-input__control > .v-input__slot:hover:before {
        border: none;
    }

    .terms .v-text-field > .v-input__control > .v-input__slot:after {
        border: none;
    }

    .terms .v-input--is-disabled:not(.v-input--is-readonly) .v-input__slot {
        background-color: #EDEFF2;
    }
</style>


<i18n>
{
    "en": {
        "terms": "Terms",
        "add": "Add term",
        "simple": "Simple",
        "regex": "Regex",
        "hint1": "Press ",
        "hint2": " to create a new term."
    },
    "da": {
        "terms": "Søgeord",
        "add": "Tilføj søgeord",
        "simple": "Simpel",
        "regex": "Regulært udtryk",
        "hint1": "Tryk på ",
        "hint2": " for at lave et nyt søgeord."
    }
}
</i18n>

<template>
    <div class="terms">
        <h1 class="headline">{{ $t("terms") }}</h1>
        <v-combobox v-model="terms" :search-input.sync="search" :disabled="isScanning" multiple hide-selected persistent-hint small-chips deletable-chips hide-details light>
            <template v-slot:append>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                       <v-icon v-on="on" @click="addTerm">
                            add_circle
                        </v-icon>
                    </template>
                    <span>{{ $t("add") }}</span>
                </v-tooltip>

                <v-tooltip v-model="showTooltip" top>
                    <template v-slot:activator="{ on }">
                        <v-icon v-on="on" @click="setSearchMethod" @contextmenu="showContextMenu" class="regex-icon">
                            {{ getIcon() }}
                        </v-icon>
                    </template>
                    <span>{{ getIconDescription() }}</span>
                </v-tooltip>
            </template>
        </v-combobox>

        <v-menu v-model="contextMenu" light top :position-x="contextMenuX" :position-y="contextMenuY" :close-on-content-click="false" absolute transition="scale-transition">
            <v-list>
                <v-list-tile @click="setRegexFlag('g')" :class="{ 'active' : isFlagSet('g') }">
                    <v-list-tile-title>g</v-list-tile-title>
                </v-list-tile>

                <v-list-tile @click="setRegexFlag('i')" :class="{ 'active' : isFlagSet('i') }">
                    <v-list-tile-title>i</v-list-tile-title>
                </v-list-tile>

                <v-list-tile @click="setRegexFlag('u')" :class="{ 'active' : isFlagSet('u') }">
                    <v-list-tile-title>u</v-list-tile-title>
                </v-list-tile>

                <v-list-tile @click="setRegexFlag('y')" :class="{ 'active' : isFlagSet('y') }">
                    <v-list-tile-title>y</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ScanFile } from "@/Models/ScanFile";
import { ScanFileStatus } from "@/Models/ScanFileStatus";
import { SearchMethods } from "@/Models/SearchMethods";

export default Vue.extend({
    name: "Terms",
    data()
    {
        return {
            terms: new Array<string>(),
            search: "",
            showTooltip: false,
            contextMenu: false,
            contextMenuX: 0,
            contextMenuY: 0,
        };
    },
    created()
    {
        this.terms = this.$store.state.activeQuery.Terms;
    },
    computed:
    {
        isScanning() : boolean
        {
            return this.$store.state.activeQuery.Files.filter((file : ScanFile) => file.Status === ScanFileStatus.Processing).length > 0;
        },
    },
    watch:
    {
        terms(values)
        {
            this.$store.commit("setTerms", this.terms);
        },
    },
    methods:
    {
        addTerm()
        {
            if (this.search != null)
            {
                const index = this.terms.findIndex(term => term === this.search);
                if (index >= 0) this.terms.splice(index, 1);
                this.terms.push(this.search);
            }
        },
        getIcon()
        {
            return this.$store.state.activeQuery.Settings.SearchMethod === SearchMethods.Simple ? "title" : "translate";
        },
        getIconDescription()
        {
            return this.$store.state.activeQuery.Settings.SearchMethod === SearchMethods.Simple ? this.$t("simple").toString() : this.$t("regex").toString();
        },
        showContextMenu(event : MouseEvent)
        {
            if (this.$store.state.activeQuery.Settings.SearchMethod === SearchMethods.Simple) return;

            event.preventDefault();
            if (this.contextMenu)
                this.contextMenu = false;
            else
            {
                this.showTooltip = false;
                this.contextMenu = true;
            }

            this.contextMenuX = event.clientX;
            this.contextMenuY = event.clientY;
        },
        setSearchMethod()
        {
            if (this.search !== null && this.search.trim().length >= 0)
                this.addTerm();

            if (this.$store.state.activeQuery.Settings.SearchMethod === SearchMethods.Regex)
            {
                this.$store.commit("setSearchMethod", SearchMethods.Simple);
                return;
            }

            if (this.$store.state.activeQuery.Settings.SearchMethod === SearchMethods.Simple)
            {
                this.$store.commit("setSearchMethod", SearchMethods.Regex);
                return;
            }
        },
        isFlagSet(flag : string)
        {
            return this.$store.state.activeQuery.Settings.RegexFlags.includes(flag);
        },
        setRegexFlag(flag : string)
        {
            if (!this.$store.state.activeQuery.Settings.RegexFlags.includes(flag))
                this.$store.commit("addRegexFlag", flag);
            else
                this.$store.commit("removeRegexFlag", flag);
        },
    },
});
</script>
