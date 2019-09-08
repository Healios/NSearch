<style scoped>
    .query {
        padding: 12px;
    }

    .files {
        margin-bottom: 1rem;
    }

    .terms {
        margin-bottom: 3rem;
    }
</style>

<template>
    <div class="query grow">
        <div>
            <files class="files"/>
            <terms class="terms"/>
        </div>

        <div>
            <result class="result"/>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Terms from "./Terms.vue";
import Files from "./Files.vue";
import Result from "./Result.vue";

export default Vue.extend({
    name: "Query",
    components:
    {
        Terms,
        Files,
        Result,
    },
});
</script>
