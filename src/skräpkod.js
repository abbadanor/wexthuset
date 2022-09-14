import { ref } from 'vue';
import { CronJob, CronTime } from 'cron'
import axios from 'axios'

const cronTimeParser = (ct) => {
    const intervalDictionary = { 1: "minut", 2: "timme", 3: "dag" }
    if (ct.includes('/')) {
        const intervalArray = ct.split(' ')
        for (let i in intervalArray) {
            if (intervalArray[i].includes('/')) {
                const timeInterval = intervalArray[i].split('/')[1]
                return { interval: intervalDictionary[i], time: timeInterval }
            }
        }
    }
}

const fanSpeed = ref(50)
const frequencies = ['minut', 'timme', 'dag']
const cronTime = ref("0 */2 * * * *")
const userTime = ref(cronTimeParser(cronTime.value).time)
const userInterval = ref(cronTimeParser(cronTime.value).interval)
const job = new CronJob(
    cronTime.value,
    function () {
        console.log('You will see this message every second');
    },
    null,
    true,
    'Europe/Stockholm'
);

const generateCronTime = (time, interval) => {
    switch (interval) {
        case 'minut':
            return `0 */${time} * * * *`
        case 'timme':
            return `0 0 */${time} * * *`
        case 'dag':
            return `0 0 0 */${time} * *`
    }
}

const setCronTime = () => {
    cronTime.value = generateCronTime(userTime.value, userInterval.value)
    const newCronTime = new CronTime(cronTime.value)
    job.setTime(newCronTime)
}

const parseCronTime = () => {
    console.log(cronTimeParser(cronTime.value))
}

const logNextDates = () => {
    console.log(job.nextDates().c)
    // const { year, month, day, hour, minute,second } = job.nextDates().c
    // print(dayjs(year, month, day, hour, minute, second).fromNow())
}

const callApi = async () => {
    try {
        const resp = await axios.get('https://api.simsva.se/wexteras/data?id=1');
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
}
 // onMounted(() => {
 //     dayjs.extend(relativeTime)
 //  })
