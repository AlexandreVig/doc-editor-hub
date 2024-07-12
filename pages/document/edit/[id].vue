<script setup lang="ts">
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import notFoundModal from "~/components/modal/notFoundModal.vue";
import shareModal from "~/components/modal/shareModal.vue";
import type { User, UserEditor } from "~/types/userTypes";

const settings = useSettings();
const route = useRoute();

definePageMeta({
  middleware: "auth",
});

const doc = new Y.Doc();

const docTitle = ref("");

const isExporting = ref(false);

const provider = new HocuspocusProvider({
  url: "ws://localhost:1234",
  document: doc,
  name: String(route.params.id),
});

const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
  "#C3E2C2",
  "#EAECCC",
  "#AFC8AD",
  "#EEC759",
  "#9BB8CD",
  "#FF90BC",
  "#FFC0D9",
  "#DC8686",
  "#7ED7C1",
  "#F3EEEA",
  "#89B9AD",
  "#D0BFFF",
  "#FFF8C9",
  "#CBFFA9",
  "#9BABB8",
  "#E3F4F4",
];

const getRandomElement = (list: string[]) =>
  list[Math.floor(Math.random() * list.length)];

const selectedColor = getRandomElement(colors);

provider.setAwarenessField('user', {
  name: settings.name,
  userHash: settings.userHash,
  color: selectedColor,
})

provider.subscribeToBroadcastChannel()

const usersConnected: Ref<UserEditor[]> = ref([{
  clientId: NaN,
  user: {
    name: settings.name,
    userHash: settings.userHash,
    color: selectedColor,
  }
}]);

provider.on('awarenessChange', ({ states }: {states: UserEditor[]}) => {
  const users: UserEditor[] = states;
  const uniqueUsers = users.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.user.userHash === value.user.userHash
    ))
  )
  usersConnected.value = uniqueUsers;
})

provider.on("stateless", ({ payload }: {payload: string}) => {
  const res = JSON.parse(payload);
  if (res.type === "docTitleUpdate" && res.sender !== settings.userHash) {
    docTitle.value = res.value
  }
})

const modal = useModal();
const toast = useToast();

const errorNotFound = () => {
  modal.open(notFoundModal, {
    onReturn() {
      window.close();
    },
  });
};

const shareDocument = () => {
  modal.open(shareModal, {
    docId: String(route.params.id),
    onSuccess(message: string) {
      toast.add({
        title: message,
        id: 'modal-success',
        color: 'green'
      })
      modal.close()
    },
    onFailure(message: string) {
      toast.add({
        title: message,
        id: 'modal-failure'
      })
    },
    onCancel() {
      modal.close()
    }
  });
}

const getDocumentContent = async () => {
  let content = "";
  await settings.get(`/api/documents/${String(route.params.id)}`).then((response) => {
    content = response.data.content;
    docTitle.value = response.data.title;
  }).catch((error) => {
    errorNotFound();
  })
  return content;
}

const lastSavedContent = ref({title: "", content: ""})
const pushDocumentContent = (content: string) => {
  if (content !== lastSavedContent.value.content || docTitle.value !== lastSavedContent.value.title) {
    settings.put(`/api/documents/${String(route.params.id)}`, {
      title: docTitle.value,
      content
    });
    lastSavedContent.value.content = String(content);
    lastSavedContent.value.title = String(docTitle.value);
  }
}

const editor = useEditor({
  onBlur: ({ editor }) => {
    pushDocumentContent(editor.getHTML());
  },
  extensions: [
    StarterKit.configure({
      listItem: false,
      orderedList: false,
      history: false,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Highlight,
    Underline,
    Link,
    ListItem,
    OrderedList,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Collaboration.configure({
      document: doc,
    }),
    CollaborationCursor.configure({
      user: {
        name: settings.name,
        userHash: settings.userHash,
        color: selectedColor,
      },
      provider,
    }),
  ],
});

onMounted(async () => {
  provider.on("synced", async () => {
    if (editor.value?.isEmpty) {
      const content = await getDocumentContent();
      editor.value?.commands.setContent(
        content
      );
    }
  });
  getDocumentContent();
});

onBeforeUnmount(() => {
  const htmlContent = editor.value?.getHTML();
  if (htmlContent) {
    pushDocumentContent(htmlContent);
  }
  unref(editor)?.destroy();
});

const headingItems = [
  [
    {
      label: "Paragraph",
      click: () => {
        editor.value?.chain().focus().setParagraph().run();
      },
    },
    {
      label: "Heading 1",
      labelClass: "heading-button-1",
      click: () => {
        editor.value?.chain().focus().toggleHeading({ level: 1 }).run();
      },
    },
    {
      label: "Heading 2",
      labelClass: "heading-button-2",
      click: () => {
        editor.value?.chain().focus().toggleHeading({ level: 2 }).run();
      },
    },
    {
      label: "Heading 3",
      labelClass: "heading-button-3",
      click: () => {
        editor.value?.chain().focus().toggleHeading({ level: 3 }).run();
      },
    },
    {
      label: "Heading 4",
      labelClass: "heading-button-4",
      click: () => {
        editor.value?.chain().focus().toggleHeading({ level: 4 }).run();
      },
    },
  ],
];

const alignItems = [
  [
    {
      label: "Align left",
      icon: "i-fa6-solid-align-left",
      click: () => {
        editor.value?.chain().focus().setTextAlign("left").run();
      },
    },
    {
      label: "Align center",
      icon: "i-fa6-solid-align-center",
      click: () => {
        editor.value?.chain().focus().setTextAlign("center").run();
      },
    },
    {
      label: "Align right",
      icon: "i-fa6-solid-align-right",
      click: () => {
        editor.value?.chain().focus().setTextAlign("right").run();
      },
    },
    {
      label: "Align justify",
      icon: "i-fa6-solid-align-justify",
      click: () => {
        editor.value?.chain().focus().setTextAlign("justify").run();
      },
    },
  ],
];

const getAlignICon = () => {
  if (editor.value?.isActive({ textAlign: "center" })) {
    return "i-fa6-solid-align-center";
  }
  if (editor.value?.isActive({ textAlign: "right" })) {
    return "i-fa6-solid-align-right";
  }
  if (editor.value?.isActive({ textAlign: "justify" })) {
    return "i-fa6-solid-align-justify";
  }
  return "i-fa6-solid-align-left";
};

const setLink = () => {
  const previousUrl = editor.value?.getAttributes("link").href;
  const url = window.prompt("URL", previousUrl);

  // cancelled
  if (url === null) {
    return;
  }

  // empty
  if (url === "") {
    editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  // update link
  editor.value
    ?.chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: url })
    .run();
};

watch(docTitle, () => {
  provider.sendStateless(JSON.stringify({
    sender: settings.userHash,
    type: "docTitleUpdate",
    value: docTitle.value
  }))
})

const exportDocumentToPdf = async () => {
  try {
    isExporting.value = true;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem('user')}`);
    const response = await fetch(`/api/documents/export/${String(route.params.id)}`, {
      headers: myHeaders
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.value}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading the file:', error);
  } finally {
    isExporting.value = false;
  }
}
</script>

<template>
  <div v-if="editor" class="h-full w-full">
    <div class="flex px-8 py-4 justify-between">
      <UInput size="lg" v-model="docTitle" :onchange="() => {
        const htmlContent = editor?.getHTML();
        if (htmlContent) {
          pushDocumentContent(htmlContent);
        }
      }" />
      <div class="flex gap-4 items-center">
        <UButton @click="shareDocument" icon="i-fa6-solid-share-from-square" size="lg" color="primary" variant="solid" label="Share"
          trailing />
        <UAvatarGroup size="sm" :max="3">
          <UTooltip class="rounded-full" v-for="user in usersConnected" :text="user.user.name">
            <UAvatar
              :src="`https://www.gravatar.com/avatar/${user.user.userHash}?d=retro`"
              :alt="user.user.name"
            />
          </UTooltip>
        </UAvatarGroup>
      </div>
    </div>
    <div class="control-group flex justify-center bg-slate-200 py-2 px-8 mb-10 shadow-md">
      <div class="flex gap-2">
        <UTooltip text="Undo" :popper="{ arrow: true, placement: 'top' }">
          <UButton @click="editor.commands.undo()" icon="i-fa6-solid-arrow-rotate-left" size="lg" color="white"
            :disabled="!editor.can().undo()" />
        </UTooltip>
        <UTooltip text="Redo" :popper="{ arrow: true, placement: 'top' }">
          <UButton @click="editor.commands.redo()" icon="i-fa6-solid-arrow-rotate-right" size="lg" color="white"
            :disabled="!editor.can().redo()" />
        </UTooltip>
        <UTooltip text="Download" :popper="{ arrow: true, placement: 'top' }">
          <UButton @click="exportDocumentToPdf" icon="i-fa6-solid-download" size="lg" color="white" :loading="isExporting" />
        </UTooltip>
      </div>
      <UDivider orientation="vertical" class="mx-4"
        :ui="{ border: { base: 'flex border-gray-400 dark:border-gray-800' } }" />
      <UTooltip text="Heading" :popper="{ arrow: true, placement: 'top' }">
        <UDropdown :items="headingItems" :popper="{ placement: 'bottom-start' }">
          <UButtonGroup size="lg" orientation="horizontal">
            <UButton icon="i-fa6-solid-heading" color="white" />
            <UButton icon="i-heroicons-chevron-down-20-solid" color="gray" />
          </UButtonGroup>
        </UDropdown>
      </UTooltip>
      <UDivider orientation="vertical" class="mx-4"
        :ui="{ border: { base: 'flex border-gray-400 dark:border-gray-800' } }" />
      <div class="flex gap-2">
        <UTooltip text="Bold" :popper="{ arrow: true, placement: 'top' }">
          <UButton @click="editor.chain().focus().toggleBold().run()" icon="i-fa6-solid-bold" size="lg"
            :color="editor.isActive('bold') ? 'blue' : 'white'" />
        </UTooltip>
        <UTooltip text="Underline" :popper="{ arrow: true, placement: 'top' }">
          <UButton @click="editor.chain().focus().toggleUnderline().run()" icon="i-fa6-solid-underline" size="lg"
            :color="editor.isActive('underline') ? 'blue' : 'white'" />
        </UTooltip>
        <UTooltip text="Italic" :popper="{ arrow: true, placement: 'top' }">
          <UButton @click="editor.chain().focus().toggleItalic().run()" icon="i-fa6-solid-italic" size="lg"
            :color="editor.isActive('italic') ? 'blue' : 'white'" />
        </UTooltip>
        <UTooltip text="Strike" :popper="{ arrow: true, placement: 'top' }">
          <UButton @click="editor.chain().focus().toggleStrike().run()" icon="i-fa6-solid-strikethrough" size="lg"
            :color="editor.isActive('strike') ? 'blue' : 'white'" />
        </UTooltip>
        <UTooltip text="Highlight" :popper="{ arrow: true, placement: 'top' }">
          <UButton @click="editor.chain().focus().toggleHighlight().run()" icon="i-fa6-solid-highlighter" size="lg"
            :color="editor.isActive('highlight') ? 'blue' : 'white'" />
        </UTooltip>
      </div class="flex gap-2">
      <UDivider orientation="vertical" class="mx-4"
        :ui="{ border: { base: 'flex border-gray-400 dark:border-gray-800' } }" />
      <UTooltip text="Alignment" :popper="{ arrow: true, placement: 'top' }">
        <UDropdown :items="alignItems" :popper="{ placement: 'bottom-start' }">
          <UButtonGroup size="lg" orientation="horizontal">
            <UButton :icon="getAlignICon()" color="white" />
            <UButton icon="i-heroicons-chevron-down-20-solid" color="gray" />
          </UButtonGroup>
        </UDropdown>
      </UTooltip>
      <UDivider orientation="vertical" class="mx-4"
        :ui="{ border: { base: 'flex border-gray-400 dark:border-gray-800' } }" />
      <div class="flex gap-2">
        <UTooltip text="Link" :popper="{ arrow: true, placement: 'top' }">
          <UButton @click="setLink" icon="i-fa6-solid-link" size="lg"
            :color="editor.isActive('link') ? 'blue' : 'white'" />
        </UTooltip>
        <UDivider orientation="vertical" class="mx-4" :ui="{
          border: { base: 'flex border-gray-400 dark:border-gray-800' },
        }" />
        <UTooltip text="Bullet List" :popper="{ arrow: true, placement: 'top' }">
          <UButton @click="editor.chain().focus().toggleBulletList().run()" icon="i-fa6-solid-list-ul" size="lg"
            :color="editor.isActive('bulletList') ? 'blue' : 'white'" />
        </UTooltip>
        <UTooltip text="Ordered List" :popper="{ arrow: true, placement: 'top' }">
          <UButton @click="editor.chain().focus().toggleOrderedList().run()" icon="i-fa6-solid-list-ol" size="lg"
            :color="editor.isActive('orderedList') ? 'blue' : 'white'" />
        </UTooltip>
        <UTooltip text="Task List" :popper="{ arrow: true, placement: 'top' }">
          <UButton @click="editor.chain().focus().toggleTaskList().run()" icon="i-fa6-solid-list-check" size="lg"
            :color="editor.isActive('taskList') ? 'blue' : 'white'" />
        </UTooltip>
      </div>
    </div>
    <div class="container mx-auto bg-white mb-10">
      <TiptapEditorContent :editor="editor" class="w-full shadow-md p-2" />
    </div>
  </div>
</template>

<style>
.tiptap {
  min-height: 24rem;
  padding: 1em;
}

.tiptap :first-child {
  margin-top: 0;
}

.tiptap ul,
.tiptap ol {
  list-style: revert;
  padding: 0 1rem;
  margin: 1.25rem 1rem 1.25rem 0.4rem;
}

.tiptap ul li p,
.tiptap ol li p {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

.tiptap h1,
.tiptap h2,
.tiptap h3,
.tiptap h4,
.tiptap h5,
.tiptap h6 {
  line-height: 1.1;
  margin-top: 2.5rem;
  text-wrap: pretty;
}

.heading-button-1,
.heading-button-2,
.heading-button-3,
.heading-button-4 {
  line-height: 1.4;
}

.tiptap h1,
.tiptap h2 {
  margin-top: 3.5rem;
  margin-bottom: 1.5rem;
}

.tiptap h1,
.heading-button-1 {
  font-size: 1.4rem;
}

.tiptap h2,
.heading-button-2 {
  font-size: 1.2rem;
}

.tiptap h3,
.heading-button-3 {
  font-size: 1.1rem;
}

.tiptap h4,
.tiptap h5,
.tiptap h6,
.heading-button-4 {
  font-size: 1rem;
}

.tiptap mark {
  background-color: #faf594;
  border-radius: 0.4rem;
  box-decoration-break: clone;
  padding: 0.1rem 0.3rem;
}

.tiptap blockquote {
  border-left: 3px solid #cbd5e1;
  margin: 1.5rem 0;
  padding-left: 1rem;
}

.tiptap hr {
  border: none;
  border-top: 1px solid #94a3b8;
  margin: 2rem 0;
}

.tiptap a {
  color: #8b5cf6;
  cursor: pointer;
  text-decoration: underline;
}

.tiptap a:hover {
  color: #5b21b6;
}

.tiptap ul[data-type="taskList"] {
  list-style: none;
  margin-left: 0;
  padding: 0;
}

.tiptap ul[data-type="taskList"] li {
  align-items: flex-start;
  display: flex;
}

.tiptap ul[data-type="taskList"] li>label {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  user-select: none;
}

.tiptap ul[data-type="taskList"] li>div {
  flex: 1 1 auto;
}

.tiptap ul[data-type="taskList"] input[type="checkbox"] {
  cursor: pointer;
}

.tiptap ul[data-type="taskList"] ul[data-type="taskList"] {
  margin: 0;
}

.tiptap .collaboration-cursor__caret {
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  margin-left: -1px;
  margin-right: -1px;
  pointer-events: none;
  position: relative;
  word-break: normal;
}

/* Render the username above the caret */
.tiptap .collaboration-cursor__label {
  border-radius: 3px 3px 3px 0;
  color: #0d0d0d;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  left: -1px;
  line-height: normal;
  padding: 0.1rem 0.3rem;
  position: absolute;
  top: -1.4em;
  user-select: none;
  white-space: nowrap;
}
</style>
