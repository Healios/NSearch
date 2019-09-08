<style scoped>
    .about {
        user-select: none;
    }

    .footer {
        display: flex;
        flex-direction: row;
        margin-bottom: 1rem;
    }

    a + a {
        margin-left: 1rem;
    }

    p {
        font-size: 1.05rem;
        font-weight: 600;
    }

    .language {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
    }

    .v-btn {
        height: auto;
        padding: 0;
        background-color: transparent;
    }

    .v-btn-toggle {
        padding: 0.2rem 0.5rem;
        background-color: transparent;
    }

    .v-btn--active:before, .v-btn:hover:before, .v-btn:focus:before {
        background-color: transparent;
    }
</style>

<i18n>
{
    "en": {
        "about": "About",
        "description": "NSearch is a utility for scanning Navision Object files and finding the objects that contain one or more defined search terms.",
        "description1": "The tool is of great help when one is introduced to an existing system, because it is possible to quickly get an overview of the system.",
        "description2": "It is also of help when e.g. removing functionality, as one can be sure of getting into every corner of a system by using the right search terms.",
        "description3": "It was written by Marcus Brown."
    },
    "da": {
        "about": "Om",
        "description": "NSearch er et værktøj til at skanne Navision objekt filer og finde de objekter som indeholder et eller flere definerede søgeord.",
        "description1": "Værktøjet er til stor gavn når man introduceres til et eksisterende system fordi at man hurtigt kan danne sig et overblik over systemet.",
        "description2": "Det gavner også hvis man f. eks skal fjerne funktionalitet, da man kan være sikker på at komme i alle hjørner af et system ved at bruge de rigtige søgeord.",
        "description3": "Værktøjet er skrevet af Marcus Brown."
    }
}
</i18n>

<template>
    <div class="about grow">
        <h1>{{ $t("about") }}</h1>
        <div class="footer">
            <a @click="openWebsite('https://mrbrown.blog')" style="font-weight: bold;">Website</a>
            <a @click="openWebsite('https://github.com/Healios/NSearch')" style="font-weight: bold;">Github</a>
        </div>
        <p>{{ $t("description") }}</p>
        <p>{{ $t("description1") }}</p>
        <p>{{ $t("description2") }}</p>
        <p>{{ $t("description3") }}</p>

        <div class="language grow">
            <v-btn-toggle v-model="selectedLangIndex" light class="elevation-0">
                <v-btn v-for="(lang, index) in langs" :key="index" @click="switchLocale(lang, langs)" flat :ripple="false">
                    <v-img contain width="64" height="41" :src="getImgUrl(flags[lang])"/>
                </v-btn>
            </v-btn-toggle>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "About",
    data()
    {
        return {
            selectedLangIndex: 0,
            flags: {
                en: "US",
                da: "DK",
            },
            langs: [
                "en",
                "da",
            ],
        };
    },
    created()
    {
        this.$store.commit("setActivePage", "About");
        this.selectedLangIndex = this.langs.findIndex(l => l === this.$root.$i18n.locale);
    },
    methods:
    {
        openWebsite(url : string)
        {
            const electron = require("electron").remote;
            electron.shell.openExternal(url);
        },
        getImgUrl(pic : string)
        {
            return require("@/Assets/" + pic + ".svg");
        },
        switchLocale(locale : string)
        {
            this.$root.$i18n.locale = locale;
            localStorage.setItem("language", locale);
        },
    },
});
</script>
