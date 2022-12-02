<template>
    <h2>HelloWorld2</h2>
    <h1>{{ msg }}</h1>
</template>
<script setup>
import { ref } from 'vue';

defineProps({
    msg: String,
});

const count = ref(0);
</script>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
