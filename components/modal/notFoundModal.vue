<script lang="ts" setup>
const emit = defineEmits(["return"]);

function onReturn() {
  emit("return");
}

</script>

<template>
  <UModal :ui="{ width: 'w-full max-w-fit sm:max-w-fit' }" prevent-close>
    <UCard>
      <template #header>
        <h1>The document you are looking for does not exist</h1>
      </template>
      <div class="flex justify-center">
        <UButton
          size="xl"
          color="primary"
          variant="solid"
          label="Return"
          @click="onReturn"
        />
      </div>
    </UCard>
  </UModal>
</template>
