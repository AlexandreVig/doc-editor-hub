<script setup lang="ts">
import DocumentIcon from '~/components/icons/DocumentIcon.vue';
import DisconnectIcon from '~/components/icons/DisconnectIcon.vue';
import UserIcon from '~/components/icons/UserIcon.vue';
import type { Route, SideBarLogo } from '~/types/routeTypes';
import LogoutConfirmationModal from '~/components/modal/logoutConfirmationModal.vue';

const modal = useModal();

const settings = useSettings();

const logout = () => {
  modal.open(LogoutConfirmationModal, {
    onDisconnect() {
      settings.logout();
      modal.close();
    },
    onCancel() {
      modal.close();
    },
  });
};

const logo: SideBarLogo = {
  link: "/AppIcon.svg",
  name: "Doc Editor"
}

const DocIcon = h(DocumentIcon)
const DiscIcon = h(DisconnectIcon)
const UIcon = h(UserIcon)

const routes: Route[][] = [
  [
    {
      name: "Documents",
      path: "/document",
      icon: DocIcon
    }
  ],
  [
    {
      name: "Disconnect",
      path: "",
      icon: DiscIcon,
      callback: logout
    },
    {
      name: "User",
      path: "",
      icon: UIcon,
      callback: () => {
        navigateTo('/user');
      },
      class: "user--icon"
    }
  ]
]

</script>
<template>
  <div v-if="settings.navbarEnabled" class="flex w-full h-screen">
    <NavComponent :logo="logo" :routes="routes"></NavComponent>
    <div class="relative flex h-screen grow overflow-y-auto">
      <NuxtPage></NuxtPage>
    </div>
  </div>
  <NuxtPage v-else></NuxtPage>
  <UModals />
  <UNotifications />
</template>
<style>
.user--icon::after {
  position: absolute;
  top: -1px;
  right: 8px;
  left: 8px;
  height: 2px;
  background-color: rgb(203 213 225);
  opacity: 0.25;
  content: "";
}
</style>