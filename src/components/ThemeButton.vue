<script setup>
import { onMounted } from "vue";
import { themeChange } from "theme-change";

const props = defineProps({
  theme: String,
  position: String,
});

onMounted(() => {
  themeChange(false);
});
</script>

<template>
  <button
    :data-set-theme="theme"
    :data-theme="theme"
    v-if="position"
    class="grid grid-cols-10 grid-rows-3 gap-0 hover:brightness-90"
    :class="(position === 'first') ? 'rounded-t-2xl' : 'rounded-b-2xl'"
  >
    <div
      class="bg-base-200 row-start-1 col-start-1 row-span-2 col-span-1"
      :class="(position === 'first') ? 'rounded-tl-2xl' : ''"
    ></div>
    <div class="bg-base-300 row-start-3 col-start-1 row-span-1 col-span-1"
      :class="(position === 'first') ? '' : 'rounded-bl-2xl'"
    ></div>
    <div
      class="bg-base-100 row-start-1 col-start-2 row-span-3 col-span-9 flex justify-between gap-1 p-2"
      :class="(position === 'first') ? 'rounded-tr-2xl' : 'rounded-br-2xl'"
    >
      <div class="font-bold">{{theme}}</div>
      <div class="flex gap-1">
        <div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
    </div>
  </button>

  <button
    :data-set-theme="theme"
    :data-theme="theme"
    v-else
    class="grid grid-cols-10 grid-rows-3 gap-0 hover:brightness-90"
  >
    <div class="bg-base-200 row-start-1 col-start-1 row-span-2 col-span-1"></div>
    <div class="bg-base-300 row-start-3 col-start-1 row-span-1 col-span-1"></div>
    <div
      class="bg-base-100 row-start-1 col-start-2 row-span-3 col-span-9 flex justify-between gap-1 p-2"
    >
      <div class="font-bold">{{theme}}</div>
      <div class="flex gap-1">
        <div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
          <div class="text-primary-content text-sm font-bold">A</div>
        </div>
        <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
          <div class="text-secondary-content text-sm font-bold">A</div>
        </div>
        <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
          <div class="text-accent-content text-sm font-bold">A</div>
        </div>
        <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
          <div class="text-neutral-content text-sm font-bold">A</div>
        </div>
      </div>
    </div>
  </button>
</template>
