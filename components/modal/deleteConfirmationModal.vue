<script lang="ts" setup>
const emit = defineEmits(["delete", "cancel"]);

function onDelete() {
  emit("delete");
}

function onCancel() {
  emit("cancel");
}
</script>

<template>
  <UModal :ui="{ width: 'w-full max-w-fit sm:max-w-fit' }" prevent-close>
    <UCard>
      <template #header>
        <h1>Are you sure you want to delete this file?</h1>
      </template>
      <div class="flex justify-end gap-4">
        <UButton
          size="xl"
          color="primary"
          variant="soft"
          label="Cancel"
          @click="onCancel"
        />
        <UButton
          size="xl"
          color="primary"
          variant="solid"
          label="Delete"
          @click="onDelete"
        />
      </div>
    </UCard>
  </UModal>
</template>
