<div class="card w-full bg-base-200 shadow-xl mt-3">
    <div class="card-body">
        <h2 class="card-title">Bevattning</h2>
        <div class="input-group">
            <span>Var</span>
            <input id="time" v-model="userTime" type="text" placeholder="10"
                class="input input-bordered" />
            <span>:e</span>
            <select id="interval" v-model="userInterval" class="select select-bordered">
                <option v-for="f in frequencies" v-bind:value="f">
                    {{f}}
                </option>
            </select>
            <button @click="setCronTime" class="btn">Go</button>
        </div>
    </div>
</div>


<div class="card w-full bg-base-200 shadow-xl mt-3">
    <div class="card-body">
        <h2 class="card-title">Styr fläkten</h2>
        <div class="flex">
            <input type="range" v-model="fanSpeed" min="0" max="100" class="range range-primary" />
            <span class="font-bold ml-4 whitespace-nowrap">{{ fanSpeed * 100 }} RPM</span>
        </div>
    </div>
</div>
