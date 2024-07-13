<script setup lang="ts">
import type { docCard } from '~/types/cardTypes';
import { sha256 } from "js-sha256";
import deleteConfirmationModal from './modal/deleteConfirmationModal.vue';

const props = defineProps<{ document: docCard, isShared: boolean }>();
const emit = defineEmits(["update"]);

const modal = useModal();
const toast = useToast();

const settings = useSettings();

const getHash = (email: string) => {
  return sha256(email);
}

const editFile = () => {
  window.open(`/document/edit/${props.document._id}`, '_blank')?.focus();
}

const deleteFile = () => {
  modal.open(deleteConfirmationModal, {
    onDelete() {
      settings.delete(`/api/documents/${props.document._id}`).then(() => {
        toast.add({
          title: "The file has been deleted",
          id: 'modal-success',
          color: 'green'
        })
      }).catch((error) => {
        console.error(error);
        toast.add({
          title: "An error occurred",
            id: 'modal-failure'
        })
      }).finally(() => {
        modal.close();
        emit("update");
      });
    },
    onCancel() {
      modal.close();
    },
  });
}
</script>

<template>
  <div
    class="p-4 rounded-lg shadow-lg bg-slate-200 h-fit"
  >
    <p>{{ document.title }}</p>
    <UIcon name="i-heroicons-document" class="text-5xl w-full text-center" />
    <div class="flex flex-col">
      <span>Last modified:</span>
      <span>{{ document.timestamps.updatedAt }}</span>
    </div>
    <div v-if="isShared && document.collaborators.length > 0"  class="flex justify-between mt-2">
      <span>Shared by:</span>
      <UAvatarGroup size="xs" :max="4">
        <UTooltip class="rounded-full" :text="document.ownerId.name">
          <UAvatar
            :src="`https://www.gravatar.com/avatar/${getHash(document.ownerId.email)}?d=retro`"
            :alt="document.ownerId.name"
          />
        </UTooltip>
      </UAvatarGroup>
    </div>
    <div v-if="document.collaborators.length > 0"  class="flex justify-between mt-2">
      <span>Shared with:</span>
      <UAvatarGroup size="xs" :max="4">
        <UTooltip class="rounded-full"v-for="user in document.collaborators" :text="user.name">
          <UAvatar
            :src="`https://www.gravatar.com/avatar/${getHash(user.email)}?d=retro`"
            :alt="user.name"
          />
        </UTooltip>
      </UAvatarGroup>
    </div>
    <div class="flex justify-around mt-4">
      <UButton
        @click="editFile"
        icon="i-heroicons-pencil-square"
        size="sm"
        color="green"
        variant="solid"
        label="Edit"
        :trailing="false"
      />
      <UButton
        v-if="!isShared"
        @click="deleteFile"
        icon="i-heroicons-trash"
        size="sm"
        color="red"
        variant="solid"
        :trailing="false"
      />
    </div>
  </div>
</template>
