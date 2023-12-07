<template>
    <k-navbar title="InCAMEO">
      <template #right>
        <k-link class="popover-navbar-link" @click="() => openPopover('.popover-navbar-link')" navbar><span class="material-symbols-outlined">more_vert</span></k-link>
      </template>
    </k-navbar>


    <k-popover :opened="popoverOpened" :target="popoverTargetRef" @backdropclick="() => (popoverOpened = false)">
      <k-list nested>
        <k-block-title>App Theme</k-block-title>
        <k-list strong inset>
          <k-list-item label title="Material Theme">
            <template #media>
              <k-radio component="div" class="-my-1" :checked="theme === 'material'" @change="() => setAppTheme('material')"/>
            </template>
          </k-list-item>
          <k-list-item label title="iOS Theme">
            <template #media>
              <k-radio component="div" class="-my-1" :checked="theme === 'ios'" @change="() => setAppTheme('ios')"/>
            </template>
          </k-list-item>
        </k-list>
        <k-list-item title="Light/Dark Mode">
          <template #after>
            <k-toggle component="div" class="-my-1" :checked="darkMode" @click="toggleDarkMode"/>
          </template>
        </k-list-item>
        <k-list-item title="Accent Color" link @click="() => (popoverOpened = false)" />
      </k-list>
    </k-popover>
</template>


<script setup lang="ts">
import { kNavbar, kList, kListItem, kLink, kPopover, kToggle, kBlockTitle, kRadio, useTheme } from 'konsta/vue';

const theme = useTheme();

const darkMode = ref(false);
const popoverOpened = ref(false);
const popoverTargetRef = ref();

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle('dark');
};

const openPopover = (targetRef: string) => {
    popoverTargetRef.value = targetRef;
    popoverOpened.value = true;
};
</script>