<script setup lang="ts">
import type { User } from '../../types/userTypes';
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import updatePasswordModal from '~/components/modal/updatePasswordModal.vue';

const schema = object({
  name: string().required('Required'),
  email: string().email('Invalid email').required('Required')
})

type Schema = InferType<typeof schema>

async function onSubmit (event: FormSubmitEvent<Schema>) {
  let data: User = {
    name: event.data.name,
    email: event.data.email
  };
  settings.put(`/users/${settings.userId}`, data).then(() => {
    needToSave.value = false;
    settings.isLogged();
    toast.add({
      title: "Vos informations ont été mis à jour !",
      id: 'modal-success',
      color: 'green'
    })
  }).catch((error) => {
    console.error(error);
    toast.add({
      title: "Une erreur c'est produite !",
        id: 'modal-failure'
    })
  })
}

const toast = useToast()
const modal = useModal()

const updatePassword = () => {
  modal.open(updatePasswordModal, {
    onSuccess (message: string) {
      toast.add({
        title: message,
        id: 'modal-success',
        color: 'green'
      })
      modal.close()
    },
    onFailure (message: string) {
      toast.add({
        title: message,
        id: 'modal-failure'
      })
    },
    onCancel () {
      modal.close()
    }
  });
}

definePageMeta({
  middleware: 'auth'
})

const settings = useSettings()


onMounted(() => {
  settings.setNavbar(true);
})


const needToSave = ref(false)


const state = reactive({
  name: settings.name,
  email: settings.email,
})

watch(state, () => {
  needToSave.value = true;
})
</script>

<template>
    <UForm :schema="schema" :state="state" class="space-y-4 w-full h-fit" @submit="onSubmit">
      <UCard :ui="{
        base: 'w-full h-fit',
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-700',
        header: { padding: 'px-4 py-10' },
        body: { padding: '', base: 'h-full px-24 p-4 divide-y divide-gray-200 dark:divide-gray-700 flex justify-center' },
        footer: { padding: 'p-4' }
      }">
        <template #header>
          <div class="flex justify-between">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-slate-200">
                <UIcon name="i-heroicons-users" class="text-2xl" />
              </div>
              <div class="-mt-6 ml-4">
                <p class="w-full text-slate-400">Utilisateur</p>
                <h1 class="font-bold text-2xl leading-5">{{settings.name}}</h1>
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
        <div class="w-1/2">
          <div class="flex items-center p-5 bg-slate-100 rounded-xl">
            <div class="h-36 w-36 mr-5 flex justify-center">
              <img
                class="w-full flex justify-center items-center border-white border-8 rounded-full"
                :src="`https://www.gravatar.com/avatar/${settings.userHash}?s=200&d=retro`" alt="Avatar"
              />
            </div>
            <div>
              <h1 class="font-bold text-lg leading-5">{{settings.name}}</h1>
              <p class="text-slate-400 flex items-center font-medium my-0.5">
                <UIcon name="i-heroicons-at-symbol-16-solid mr-1"/> {{settings.email}}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 py-14 gap-x-8 gap-y-12">
            <UFormGroup
              size="xl"
              label="Username"
              name="name"
              :ui="{label: {base: 'block font-medium font-semibold text-gray-700 dark:text-gray-200'}}"
            >
              <UInput
                icon="i-heroicons-user-circle-20-solid"
                color="white"
                variant="outline"
                size="xl"
                v-model="state.name"
                trailing
              />
            </UFormGroup>
            <UFormGroup
              size="xl"
              label="E-mail"
              name="email"
              :ui="{label: {base: 'block font-medium font-semibold text-gray-700 dark:text-gray-200'}}"
            >
              <UInput
                icon="i-heroicons-envelope-20-solid"
                color="white"
                variant="outline"
                size="xl"
                v-model="state.email"
                trailing
              />
            </UFormGroup>
            <UFormGroup
              size="xl"
              label="Mot de passe"
              name="password"
              :ui="{label: {base: 'block font-medium font-semibold text-gray-700 dark:text-gray-200'}}"
            >
              <UButton
                color="primary"
                size="xl"
                icon="i-heroicons-lock-closed-20-solid"
                label="Mettre à jour"
                trailing
                @click="updatePassword"
              />
            </UFormGroup>
          </div>
        </div>
      </UCard>
    </UForm>
</template>