<script setup lang="ts">

const props = defineProps<{
  authenticated: boolean
}>()

</script>
<template>
  <div class="flex w-full h-screen justify-center bg-slate-100">
    <div class="flex flex-col shrink-0 justify-between w-full max-w-6xl h-full overflow-x-hidden overflow-y-auto text-base py-10 px-20 bg-white shadow-lg">
      <div class="flex items-center w-max max-w-full h-16">
        <div class="flex items-center justify-center w-14 h-14 rounded bg-primary-700">
          <img src="/AppIcon.svg" alt="logo" class="w-10 object-contain object-center"/>
        </div>
        <div class="mt-0.5 ml-4">
          <h1 class="font-bold text-lg leading-5">Doc Editor</h1>
          <p class="w-full text-slate-400">Application</p>
        </div>
      </div>
      <div class="w-[340px] max-w-full self-center">
        <slot></slot>
      </div>
      <div v-if="authenticated" class="text-slate-400 leading-[24px] flex font-medium">
        <UIcon class="text-2xl relative ml-1 mr-2" name="i-heroicons-lock-open-16-solid leading-[24px]" />Authentifié
      </div>
      <div v-else class="text-slate-400 leading-[24px] flex font-medium">
        <UIcon class="text-2xl relative ml-1 mr-2" name="i-heroicons-lock-closed-16-solid leading-[24px]" />Non authentifié
      </div>
    </div>
  </div>
</template>