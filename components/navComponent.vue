<script setup lang="ts">
import type { Route, SideBarLogo } from "~/types/routeTypes";

const route = useRoute();

const props = defineProps<{ routes: Route[][], logo?: SideBarLogo }>();
</script>
<template>
  <div class="relative flex h-full bg-slate-800 flex-col w-16">
    <ULink v-if="props.logo" class="flex items-center justify-center w-16 h-16 bg-primary-700">
      <img
        :src="props.logo.link"
        :alt="props.logo.name"
        class="w-11 object-contain object-center"
      />
    </ULink>
    <div
      v-for="routeArray, ind in props.routes"
      class="overflow-x-hidden overflow-y-auto" :class="ind < props.routes.length - 1 ? 'grow' : 'relative'"
    >
      <UTooltip v-for="propsRoute in routeArray" :text="propsRoute.name" :popper="{ arrow: true, placement: 'right' }">
        <UButton v-if="propsRoute.callback"
          variant="link"
          active-class="text-slate-800 bg-slate-200 hover:bg-slate-200"
          inactive-class="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-800"
          @click="propsRoute.callback"
          :class="propsRoute.class ? ' ' + propsRoute.class : ''"
        >
          <component :is="propsRoute.icon" />
        </UButton>
        <UButton
          v-else
          :to="propsRoute.path"
          variant="link"
          :class="
            (route.path.startsWith(propsRoute.path)
              ? 'text-slate-800 bg-slate-200 hover:bg-slate-200'
              : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-800')
            + (propsRoute.class ? ' ' + propsRoute.class : '')
          "
        >
          <component :is="propsRoute.icon" />
        </UButton>
      </UTooltip>
    </div>
  </div>
</template>
