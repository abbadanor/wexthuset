<script setup>
import {ref, computed} from 'vue'
import {useStore} from "../store"
import { CronTime } from 'cron'
const store = useStore()
const userCronString = ref(store.cronString)

 const validCronTime = computed(() => {
     try {
         const ct = new CronTime(userCronString.value)
         return true
     } catch (e) {
         return false;
     }
 })
</script>

<template>
    <div class="card w-full bg-base-200 shadow-xl mt-3">
        <div class="card-body">
            <h2 class="card-title">Konfiguration</h2>
            <div class="form-control">
            <label class="label">
                <span class="label-text">Ändra cronjob strängen</span>
            </label>
            <label class="input-group">
                <span>Cron time</span>
                <input v-model="userCronString" type="text" placeholder="Type here" class="input w-full max-w-xs" :class="validCronTime ? 'input-success' : 'input-error'" />
                <button @click="store.cronString = userCronString" class="btn" :disabled="!validCronTime">Set</button>
            </label>
            </div>
        </div>
    </div>
</template>
