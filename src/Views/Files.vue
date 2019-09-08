<style scoped>
    .files {
        display: flex;
        flex-direction: column;
        user-select: none;
    }

    .file-list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 0.35rem;
    }

    .v-list {
        padding-top: 2px; 
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        background-color: transparent;
    }

    .file-add {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: .25rem;
    }

    .upload-overlay {
        position: relative;
        top: 0;
        left: 0;
        border-radius: 0.25rem;
        user-select: none;
        background-color: #f6f7f8;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin-bottom: 1.4rem;
    }

    .upload-overlay .flex {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .upload-description {
        max-width: 80%;
        font-size: 1.5rem;
        color: rgba(0,0,0,0.68);
    }

    .upload-inner-overlay {
        cursor: pointer;
        background-color: transparent;
        position: absolute;
        top: 0;
        left: 0; 
        z-index: 7;
        width: 100%;
        height: 100%;
    }

    .v-list__tile__avatar {
        min-width: unset;
    }

    .v-list__tile__action {
        min-width: unset;
    }

    .check-icon {
        margin-right: 0.3rem;
        color: #4CAF50;
        font-weight: bold;
    }

    .v-progress-circular {
        margin-right: 0.5rem;
        color: #B2B2B2;
    }
</style>

<style>
    .files .v-list__tile {
        padding: 0.5rem 0.1rem;
        height: auto;
    }

    .files .v-list__tile__title {
        height: auto;
        font-weight: 600;
        font-size: 0.87em;
    }

    .files .v-avatar {
        width: auto !important;
        height: auto !important;
    }
</style>

<i18n>
{
    "en": {
        "files": "Files",
        "dragDrop": "Click and select file or drop to add folders/files.",
        "add": "Add file"
    },
    "da": {
        "files": "Filer",
        "dragDrop": "Tryk og vælg fil eller træk og slip for at tilføje mapper/filer.",
        "add": "Tilføj fil"
    }
}
</i18n>

<!-- TODO: Showing more than a handful of files takes up quite a lot of space in the UI. Find a way to show potentially hundreds of files. -->
<!--       This could be by allowing folders to be listed, instead of the individual files, by paginating the list or by allowing a type of scroll. -->
<template>
    <div class="files">
        <div class="file-list" v-if="!showFileDropOverlay" @dragenter="dragEnter">
            <h1 class="headline">{{ $t("files") }}</h1>

            <v-list v-if="$store.state.activeQuery.Files.length > 0" light>
                <v-list-tile v-for="item in $store.state.activeQuery.Files" :key="item.title" avatar>
                    <v-list-tile-avatar v-if="item.Status !== 0">
                        <v-fade-transition>
                            <v-icon v-if="item.Status === 2" class="check-icon">check</v-icon>
                        </v-fade-transition>
                        <v-progress-circular v-if="item.Status === 1" indeterminate size="28"/>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-list-tile-title v-on="on">{{ item.Name }}</v-list-tile-title>
                            </template>
                            <span>{{ item.Name }}</span>
                        </v-tooltip>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-icon @click="removeFile(item)" v-if="item.Status !== 1">delete</v-icon>
                        <v-icon @click="pauseFile(item)" v-if="item.Status === 1">pause</v-icon>
                    </v-list-tile-action>
                </v-list-tile>

                <v-layout justify-center>
                    <v-flex xs10>
                        <div class="file-add">
                            <v-icon @click="showFileBrowserDialog" light>add</v-icon>
                        </div>
                    </v-flex>
                </v-layout>
            </v-list>
        </div>

        <div class="upload-overlay" v-if="showFileDropOverlay" @click="showFileBrowserDialog">
            <v-icon large light>attach_file</v-icon>
            <h1 class="upload-description">{{ $t("dragDrop") }}</h1>
            <div class="upload-inner-overlay" @dragover.prevent @drop="onDrop" @dragleave.prevent="dragLeave"></div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ScanFile } from "@/Models/ScanFile";
import { ScanFileStatus } from "@/Models/ScanFileStatus";
import { QueryFilePayload } from "@/Models/QueryFilePayload";
import { basename, extname } from "path";

export default Vue.extend({
    name: "Files",
    data()
    {
        return {
            showFileDropOverlay: true,
        };
    },
    created()
    {
        this.showFileDropOverlay = this.$store.state.activeQuery.Files.length === 0;
    },
    methods:
    {
        showFileBrowserDialog()
        {
            const electron = require("electron").remote;
            const selectedFiles = electron.dialog.showOpenDialog(electron.getCurrentWindow(),
            {
                filters: [{ name: "Text Files", extensions: ["txt"] }, { name: "AL Files", extensions: ["al"] }],
                properties: ["openFile", "multiSelections"],
            });

            if (selectedFiles === undefined || selectedFiles.length === 0) return;
            selectedFiles.forEach(filePath =>
            {
                if (this.$store.state.activeQuery.Files.find((f : ScanFile) => f.Path === filePath) === undefined)
                    this.$store.commit("addFile", new ScanFile(ScanFileStatus.None, filePath, basename(filePath)));
            });
            this.showFileDropOverlay = false;
        },
        removeFile(scanFile : ScanFile)
        {
            this.$store.commit("removeFile", scanFile);

            if (this.$store.state.activeQuery.Files.length === 0)
                this.showFileDropOverlay = true;
        },
        pauseFile(scanFile : ScanFile)
        {
            scanFile.Status = ScanFileStatus.None;
            this.$store.commit("updateFile", new QueryFilePayload(this.$store.state.activeQuery, scanFile));
        },
        onDrop(event : DragEvent)
        {
            this.showFileDropOverlay = false;
            if (event.dataTransfer === null) return;

            for (const item of event.dataTransfer.items)
            {
                if (!item.webkitGetAsEntry().isFile)
                {
                    const folder = item.getAsFile();
                    if (folder === null) continue;

                    const fs = require("fs");
                    fs.readdir(folder.path, (error : string, files : string[]) =>
                    {
                        files.filter((file : string) => extname(file) === ".al" || extname(file) === ".txt")
                        .forEach((file : string) => this.$store.commit("addFile", new ScanFile(ScanFileStatus.None, folder.path + "\\" + file, file)));
                    });
                }

                if (item.webkitGetAsEntry().isFile)
                {
                    const file = item.getAsFile();
                    if (file === null) continue;
                    if (extname(file.path) !== ".al" && extname(file.path) !== ".txt") continue;
                    this.$store.commit("addFile", new ScanFile(ScanFileStatus.None, file.path, file.name));
                }
            }

            if (this.$store.state.activeQuery.Files.length === 0)
                this.showFileDropOverlay = true;
        },
        dragEnter(event : any)
        {
            this.showFileDropOverlay = true;
        },
        dragLeave(event : any)
        {
            if (this.$store.state.activeQuery.Files.length > 0)
                this.showFileDropOverlay = false;
        },
    },
});
</script>
