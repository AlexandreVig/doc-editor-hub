<script lang="ts" setup>
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const schema = object({
  currentPassword: string()
    .min(6, 'Doit contenir au moins 6 caractères')
    .required('Required'),
  password: string()
    .min(6, 'Doit contenir au moins 6 caractères')
    .required('Required'),
  passwordConfirmation: string()
    .min(6, 'Doit contenir au moins 6 caractères')
    .required('Required'),
})

type Schema = InferType<typeof schema>

const state = reactive({
  currentPassword: undefined,
  password: undefined,
  passwordConfirmation: undefined,
})

const settings = useSettings();

async function onSubmit (event: FormSubmitEvent<Schema>) {
  if (event.data.password !== event.data.passwordConfirmation) {
    onFailure("The passwords don't match");
    return;
  }
  settings.post("/api/auth/update-password", event.data).then((response) => {
    localStorage.setItem('user', response.data.token);
    onSuccess("Your password has been updated");
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
  <UModal :ui="{width: 'w-full max-w-fit sm:max-w-fit'}" prevent-close>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UButton class="absolute top-10 -left-20 flex items-center justify-center w-12 h-12 rounded-full" color="gray" @click="onCancel">
        <UIcon name="i-heroicons-x-mark-16-solid" class="text-2xl" />
      </UButton>
      <UCard :ui="{
          base: 'w-full h-fit',
          ring: '',
          divide: 'divide-y divide-gray-200 dark:divide-gray-700',
          header: { padding: 'px-4 py-10' },
        }">
        <template #header>
          <div class="flex justify-between">
            <div class="flex items-center">
              <div class="-mt-6 ml-4">
                <p class="w-full text-slate-400">Mot de passe</p>
                <h1 class="font-bold text-2xl leading-5">Modification du mot de passe</h1>
              </div>
            </div>
            <UButton
              class="flex items-center justify-center w-12 h-12 rounded-full"
              :disabled="!needToSave"
              type="submit"
            >
              <UIcon name="i-heroicons-check-16-solid" class="text-2xl" />
            </UButton>
          </div>
        </template>
        <div class="flex py-14 gap-x-8 gap-y-12">
            <UFormGroup
              size="xl"
              label="Mot de passe actuel"
              name="currentPassword"
              :ui="{label: {base: 'block font-medium font-semibold text-gray-700 dark:text-gray-200'}}"
            >
              <UInput
                type="password"
                v-model="state.currentPassword"
                icon="i-heroicons-lock-closed-20-solid"
                color="white"
                variant="outline"
                size="xl"
                trailing
              />
            </UFormGroup>
            <UFormGroup
              size="xl"
              label="Nouveau mot de passe"
              name="password"
              :ui="{label: {base: 'block font-medium font-semibold text-gray-700 dark:text-gray-200'}}"
            >
              <UInput
                type="password"
                v-model="state.password"
                icon="i-heroicons-lock-closed-20-solid"
                color="white"
                variant="outline"
                size="xl"
                trailing
              />
            </UFormGroup>
            <UFormGroup
              size="xl"
              label="Confirmation du mot de passe"
              name="passwordConfirmation"
              :ui="{label: {base: 'block font-medium font-semibold text-gray-700 dark:text-gray-200'}}"
            >
              <UInput
                type="password"
                v-model="state.passwordConfirmation"
                icon="i-heroicons-lock-closed-20-solid"
                color="white"
                variant="outline"
                size="xl"
                trailing
              />
            </UFormGroup>
          </div>
      </UCard>
    </UForm>
  </UModal>
</template>