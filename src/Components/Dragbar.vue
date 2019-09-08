<style scoped>
    .dragbar {
        height: 32px;
        background-color: #EAEAEA;
        -webkit-app-region: drag;
    }

    .window-controls {
        display: flex;
        flex-direction: row;
        align-items: center;
        -webkit-app-region: no-drag;
    }

    .icon-button {
        color: rgba(0, 0, 0, 0.6);
    }

    .icon-button + .icon-button {
        margin-left: 0.5rem;
    }
</style>

<template>
    <v-card-actions class="dragbar">
        <v-spacer></v-spacer>
        <div class="window-controls">
            <!-- TODO: Make this look nice. -->
            <v-icon @click="minimize" small class="icon-button">fa-window-minimize</v-icon>
            <v-icon @click="maximize" v-if="!isMaximized" small class="icon-button">fa-window-maximize</v-icon>
            <v-icon @click="restore" v-if="isMaximized" small class="icon-button">fa-window-restore</v-icon>
            <v-icon @click="close" small class="icon-button">fa-window-close</v-icon>
        </div>
    </v-card-actions>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "Dragbar",
    computed:
    {
        isMaximized() : boolean
        {
            const electron = require("electron").remote;
            return electron.getCurrentWindow().isMaximized();
        },
    },
    methods:
    {
        minimize()
        {
            const electron = require("electron").remote;
            electron.getCurrentWindow().minimize();
        },
        maximize()
        {
            const electron = require("electron").remote;
            electron.getCurrentWindow().maximize();
        },
        restore()
        {
            const electron = require("electron").remote;
            electron.getCurrentWindow().unmaximize();
        },
        close()
        {
            const electron = require("electron").remote;
            electron.getCurrentWindow().close();
        },
    },
});
</script>
