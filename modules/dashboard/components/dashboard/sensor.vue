<script>
import { parseISO, subDays, subMonths, format } from 'date-fns'

import chartTimeseries from '@/components/dashboard/charts/timeseries'
import xButton from '@/components/common/forms/button'
import { api } from '@/utils/constants'
import { setAuthHeader } from '@/utils/helpers'

export default {
  components: {
    chartTimeseries,
    xButton
  },
  props: {
    id: String | Number,
    name: String,
    type: String,
    unit: String,
  },
  data() {
    return {
      series: [],
      hiddenSeries: [],
      modes: {
        avg: true,
        min: true,
        max: true
      },
      timePeriod: '24H',
      error: undefined
    }
  },
  async mounted() {
    await this.loadChart()
  },
  methods: {
    async loadChart(subByMonth = false, subValue = 1) {
      let timeseries
      this.modes= {
        avg: true,
        min: true,
        max: true
      }

      if(subByMonth) {
        timeseries = await this.fetchTimeseries(subMonths(new Date(), subValue), new Date(), '1 day')
      } else {
        timeseries = await this.fetchTimeseries(subDays(new Date(), subValue))
      }

      this.series = [
        {
        slug: 'avg',
        name: 'Average',
        data: this.parseSeries(timeseries, 'avg')
        },
        {
          slug: 'min',
          name: 'Minimum',
          data: this.parseSeries(timeseries, 'min')
        },
        {
          slug: 'max',
          name: 'Maximum',
          data: this.parseSeries(timeseries, 'max')
        }
      ]
    },

    async fetchTimeseries(finish, start = new Date(), step = '1 hour') {

      const url = api.private.getSensorsTimeseries(
        this.id, finish.toISOString(), start.toISOString(), step, this.modes.avg, this.modes.min, this.modes.max
      )

      try {
        return await this.$http.$get(url, setAuthHeader(this.$store.state.auth.token))
        this.error = undefined
      } catch(e) {
        this.error = 'Could not load data.'
      }
    },

    parseSeries(series, name) {
      return series.map((val) => {
        return {
          x: new Date(val.datetime),
          y: val[name]?.toFixed(1)
        }
      })
    },
    // Hides AVG / MIN / MAX from the graph
    switchMode(name) {
      this.modes[name] = !this.modes[name]

      if(this.modes[name] === false) {
        const toPop = this.series.map(s => s.slug).indexOf(name)
        this.hiddenSeries.push(this.series.splice(toPop, 1))
      } else {
        const toPop = this.hiddenSeries.map(s => s.slug).indexOf(name)
        this.series.push(...this.hiddenSeries.splice(toPop, 1)[0])
      }
    },

    async switchPeriod(name) {
      this.timePeriod = name

      if(name === '6M') {
        this.loadChart(true, 6)
      } else if(name === '1M') {
        this.loadChart(true, 1)
      } else if(name === '1W') {
        this.loadChart(false, 7)
      } else {
        this.loadChart(false, 1)
      }
    }
  }
}
</script>

<template>
  <client-only>
    <div class="card default flex-col">
      <div class="w-full flex flex-row justify-between">
        <div>
          <small class="text-gray-500 uppercase">{{ type }}</small>
          <h3 class="h3" contenteditable>{{ name || 'Click to set a name' }}</h3>
        </div>
        <x-button variant="tertiary" type="button" @click.native="loadChart"><i class="gg-sync"></i></x-button>
      </div>
      <chart-timeseries
        v-if="series && !error"
        :series="series"
        :unit="unit"
      />
      <div class="alert error" v-if="error">
        {{ error }}
      </div>
      <div class="w-full flex flex-col justify-start lg:flex-row lg:justify-between">
        <div class="btn-group text-sm">
          <button :class="{'active': modes.avg}" @click="switchMode('avg')">Avg</button>
          <button :class="{'active': modes.min}" @click="switchMode('min')">Min</button>
          <button :class="{'active': modes.max}" @click="switchMode('max')">Max</button>
        </div>
        <div class="btn-group text-sm mt-2 lg:mt-0">
          <button title="last 6 months" :class="{'active': timePeriod === '6M'}" @click="switchPeriod('6M')">6M</button>
          <button title="last month" :class="{'active': timePeriod === '1M'}" @click="switchPeriod('1M')">1M</button>
          <button title="last week" :class="{'active': timePeriod === '1W'}" @click="switchPeriod('1W')">1W</button>
          <button title="today" :class="{'active': timePeriod === '24H'}" @click="switchPeriod('24H')">24H</button>
        </div>
      </div>
    </div>
  </client-only>
</template>

<style lang="postcss" scoped>
.btn-group {
  @apply flex flex-row;
}

.btn-group button {
  @apply h-8 px-3 font-bold bg-primary-100 text-primary-700 border-r border-primary-200 transition-all duration-300;
}

.btn-group button:focus {
  @apply outline-none shadow-outline;
}

.btn-group button:disabled {
  @apply bg-gray-300 text-gray-600 cursor-not-allowed !important;
}

.btn-group button:hover {
  @apply bg-primary-200 text-primary-900;
}

.btn-group button:active {
  @apply bg-primary-600 text-white;
}

.btn-group button:first-of-type {
  @apply rounded-l;
}

.btn-group button:last-of-type {
  @apply rounded-r border-none;
}

.btn-group button.active {
  @apply bg-primary-500 text-white z-10;
}
</style>
