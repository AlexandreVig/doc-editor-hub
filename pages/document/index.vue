<script setup lang="ts">
const settings = useSettings();
const toast = useToast();

const ownedDocs = ref([]);
const sharedDocs = ref([]);

onMounted(() => {
  settings.setNavbar(true);
  updateDocList();
});

definePageMeta({
  middleware: "auth",
});

const updateDocList = () => {
  settings.get("/api/documents").then((res) => {
    ownedDocs.value = res.data.ownedDocuments;
    sharedDocs.value = res.data.sharedDocuments;
  });
};

const createFile = () => {
  settings
    .post("/api/documents", {
      title: "New document",
      content: {
        segments: [],
      },
    })
    .then(() => {
      toast.add({
        title: "A new file has been created",
        id: "modal-success",
        color: "green",
      });
    })
    .catch((error) => {
      console.error(error);
      toast.add({
        title: "An error occurred",
        id: "modal-failure",
      });
    })
    .finally(() => {
      updateDocList();
    });
};
</script>
<template>
  <UCard
    :ui="{
      base: 'w-full h-fit',
      ring: '',
      divide: 'divide-y divide-gray-200 dark:divide-gray-700',
      header: { padding: 'px-4 py-10' },
      body: {
        padding: '',
        base: 'h-full px-24 p-4 divide-y divide-gray-200 dark:divide-gray-700 flex justify-center',
      },
      footer: { padding: 'p-4' },
    }"
  >
    <template #header>
      <div class="flex justify-between">
        <div class="flex items-center">
          <div
            class="flex items-center justify-center w-12 h-12 rounded-full bg-slate-200"
          >
            <UIcon name="i-heroicons-document" class="text-2xl" />
          </div>
          <div class="-mt-6 ml-4">
            <p class="w-full text-slate-400">List</p>
            <h1 class="font-bold text-2xl leading-5">Documents</h1>
          </div>
        </div>
      </div>
    </template>
    <div class="w-full">
      <h1 class="text-2xl">My documents</h1>
      <div v-if="ownedDocs.length > 0" class="grid grid-cols-6 gap-6 my-6">
        <DocCard
          v-for="doc in ownedDocs"
          :document="doc"
          @update="updateDocList"
        />
        <UButton
          @click="createFile"
          class="w-fit h-fit m-auto"
          icon="i-heroicons-plus-16-solid"
          size="sm"
          color="primary"
          variant="solid"
          label="Create document"
          trailing
        />
      </div>
      <div v-else class="my-6">
        <EmptyCard>
          <div class="grid grid-rows-2 text-center z-50">
            You don't have any file
            <UButton
              @click="createFile"
              class="w-fit mx-auto"
              icon="i-heroicons-plus-16-solid"
              size="sm"
              color="primary"
              variant="solid"
              label="Create document"
              trailing
            />
          </div>
        </EmptyCard>
      </div>
      <UDivider class="my-8" />
      <h1 class="text-2xl mb-4">Shared documents</h1>
      <div v-if="sharedDocs.length > 0" class="grid grid-cols-6 gap-6 my-6">
        <DocCard v-for="doc in sharedDocs" :document="doc" />
      </div>
      <div v-else class="my-6">
        <EmptyCard> You don't have shared document </EmptyCard>
      </div>
    </div>
  </UCard>
</template>
