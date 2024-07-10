<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

const settings = useSettings();

const schema = object({
  email: string().email("Invalid email").required("Required"),
  password: string().required("Required"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  email: "",
  password: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  settings.login(state.email, state.password).catch(() => {
    loginError.value = true;
  });
}

const authenticated = ref(false);
const loginError = ref(false);

settings.isLogged().then((value) => {
  authenticated.value = value;
});

onBeforeMount(() => {
  settings.setNavbar(false);
});
</script>

<template>
  <LoginPage :authenticated="authenticated">
    <div class="header flex items-end justify-between mb-5">
      <h1 class="type-title text-[42px] leading-[52px] font-bold">Login</h1>
    </div>
    <div v-if="authenticated" class="space-y-8">
      <p>
        <b>{{ settings.name }}</b> is currently authenticated. If you recognize
        this account, click continue.
      </p>
      <div class="flex justify-between">
        <UButton
          color="primary"
          variant="soft"
          @click="
            () => {
              settings.logout();
            }
          "
          >Disconnect</UButton
        >
        <UButton
          color="primary"
          variant="solid"
          @click="
            () => {
              navigateTo('/document');
            }
          "
          >Continue</UButton
        >
      </div>
    </div>
    <UForm
      v-else
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup name="email" class="w-full" size="xl" required>
        <UInput v-model="state.email" placeholder="E-mail" />
      </UFormGroup>

      <UFormGroup name="password" class="w-full" size="xl" required>
        <UInput
          v-model="state.password"
          placeholder="Password"
          type="password"
        />
      </UFormGroup>

      <UAlert
        v-if="loginError"
        color="red"
        icon="i-heroicons-information-circle-20-solid"
        title="Incorrect username or password"
      />

      <div class="flex justify-between items-center">
        <UButton type="submit" size="xl"> Login </UButton>
        <ULink
          to="/auth/register"
          active-class="text-primary"
          inactive-class="text-slate-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium"
        >
          Don't have an account ?
        </ULink>
      </div>
    </UForm>
  </LoginPage>
</template>
