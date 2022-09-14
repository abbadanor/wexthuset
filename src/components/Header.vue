<script setup>
 import {useStore} from "../store"
import { QuestionMarkCircleIcon } from "@heroicons/vue/24/solid";
 const store = useStore()
</script>

<template>
    <div class="navbar bg-base-100">
        <div class="flex-1">
            <router-link to="/" class="btn btn-ghost normal-case text-xl">Wexthüset</router-link>
        </div>
        <div class="">
            <div class="form-control">
                <label class="label">
                    <div class="leading-3 tooltip tooltip-bottom" data-tip="Manuellt läge låter dig styra växthuset">
                        <QuestionMarkCircleIcon class="inline-block w-5 h-5 stroke-current mr-2 cursor-pointer"></QuestionMarkCircleIcon>
                    </div>
                    <span class="label-text">{{store.manualMode ? "Manuellt läge" : "Automatiskt läge"}}</span>
                    <input v-model="store.manualMode" type="checkbox" class="ml-4 toggle">
                </label>
            </div>
        </div>
    </div>
</template>
