<script lang="ts" setup>
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const props = defineProps({
  docId: {
    type: String,
    required: true,
  }
})

const schema = object({
  email: string().email("Invalid email").required("Required"),
})

type Schema = InferType<typeof schema>

const state = reactive({
  email: "",
})

const settings = useSettings();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  settings.post(`/api/documents/share/${props.docId}`, {
    email: event.data.email
  }).then(() => {
    onSuccess("Your document has been shared !");
  }).catch((error) => {
    onFailure(`An error occurred: ${error.response.statusText}`);
  })
}

const emit = defineEmits(['success', 'failure', 'cancel'])

function onSuccess(message: string) {
  emit('success', message);
}

function onFailure(message: string) {
  emit('failure', message);
}

function onCancel() {
  emit('cancel');
}

const needToSave = ref(false)

watch(state, () => {
  needToSave.value = true;
})

</script>

<template>
  <UModal :ui="{ width: 'w-full max-w-fit sm:max-w-fit' }" prevent-close>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UButton class="absolute top-10 -left-20 flex items-center justify-center w-12 h-12 rounded-full" color="gray"
        @click="onCancel">
        <UIcon name="i-heroicons-x-mark-16-solid" class="text-2xl" />
      </UButton>
      <UCard :ui="{
        base: 'w-full h-fit',
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-700',
        header: { padding: 'px-4 py-10' },
      }">
        <template #header>
          <div class="flex items-center">
            <div class="-mt-6 ml-4">
              <p class="w-full text-slate-400">Share</p>
              <h1 class="font-bold text-2xl leading-5">Share this document</h1>
            </div>
          </div>
        </template>
        <div class="flex py-14 flex-col gap-12 items-center">
          <UFormGroup size="xl" label="Email of your colllaborator" name="email" class="w-full"
            :ui="{ label: { base: 'block font-medium font-semibold text-gray-700 dark:text-gray-200' } }">
            <UInput type="email" v-model="state.email" color="white" variant="outline" size="xl" />
          </UFormGroup>
          <UButton class="w-fit" type="submit" icon="i-fa6-solid-share-from-square" size="lg" color="primary" variant="solid" label="Share"
          trailing />
        </div>

      </UCard>
    </UForm>
  </UModal>
</template>