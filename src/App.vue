<style>
    /*Use local font files instead*/
    @import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800&display=swap");

    html, body {
        overflow: hidden;
        overflow-y: auto;
        height: 100%;
        background-color: #F6F7F8;
    }

    #app {
        height: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2C3E50;
        background-color: #F6F7F8;
    }

    .application--wrap {
        min-height: 100%;
    }

    .app-title {
        font-size: 1rem;
        font-weight: bold;
        color: white;
    }

    input {
        font-weight: 600;
    }

    .v-tabs__item {
        font-family: "Open Sans", "Avenir", "Segoe-UI", sans-serif;
        font-weight: bold;
        font-size: 1rem;
    }

    .v-tabs__item--active {
        color: #2C3E50;
    }

    .v-window {
        display: flex;
        flex-direction: column;
        flex: 1 0 auto;
    }

    .v-window__container {
        display: flex;
        flex-direction: column;
        flex: 1 0 auto;
    }

    .v-window-item {
        display: flex;
        flex-direction: column;
        flex: 1 0 auto; 
    }

    .v-menu__content {
        box-shadow: unset;
    }

    .theme--dark.v-icon.v-icon--disabled {
        cursor: default;
    }

    .primary {
        color: white;
        border-color: #5e72e4;
        background-color: #5e72e4 !important;
        box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
        border-radius: 0.25rem;
        padding: .625rem 1.25rem;
        width: auto;
        height: auto;

        font-weight: 600;
        font-size: 1.2rem;
        letter-spacing: .025em;
        text-transform: uppercase;
        will-change: transform;
    }

    .primary:hover {
        background-color: #5e72e4 !important;
        transform: translateY(-1px);
        box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08);
    }

    .primary:not(:disabled):active {
        background-color: #324cdd !important;
        box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08);
    }

    .grow {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
</style>

<template>
    <v-app dark>
        <navbar/>
        <dragbar/>

        <v-content>
            <v-container grid-list-md fluid fill-height>
                <v-layout row wrap>
                    <v-flex xs12 class="grow">
                        <v-slide-y-transition mode="out-in">
                            <router-view/>
                        </v-slide-y-transition>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Dragbar from "@/Components/Dragbar.vue";
import Navbar from "@/Components/Navbar.vue";

export default Vue.extend({
    name: "App",
    components:
    {
        Dragbar,
        Navbar,
    },
    created()
    {
        const language = localStorage.getItem("language");

        if (language != null)
            this.$root.$i18n.locale = language;
    },
});
</script>
