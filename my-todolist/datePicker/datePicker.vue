<template>
  <el-date-picker
    v-model="timerange"
    :type="type"
    :value-format="valueFormat"
    :pickerOptions="queryLimitOptions"
    :default-time="['00:00:00', '23:59:59']"
    range-separator="至"
    @change="dataChange"
    :clearable="false"
    :editable="false"
    >
  </el-date-picker>
</template>
<script>
import cache from '@/utils/cache'
export default {
  name: 'datePicker',
  props: {
    /**
     * 时间类型，精确到日期还是秒
     */
    type: {
      type: String,
      default: 'datetimerange'
    },
    /**
     * 时间格式
     */
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    },
  },
  computed: {
    /**
     * 限制时间区间
     */
    queryMaxDuration () {
      return 3600 * 1000 * 24 * (Number(this.configs.queryMaxDuration) - 1)
    },
    /**
     * 默认时间范围
     */
    queryDeafultDuration () {
      return 3600 * 1000 * 24 * (Number(this.configs.queryDeafultDuration) - 1)
    }
  },
  data () {
    return {
      defaultRange: [], // 默认时间范围
      timerange: [],
      configs: {}, // 系统配置
      timePicked: '', // 选择的第一个时间点
      queryLimitOptions: { // 时间范围选择限制
        /**
         * 不可选时间
         * @param {date} time 时间
         */
        disabledDate: (time) => {
          if (this.timePicked) {
            const max = new Date(this.timePicked.getTime() + this.queryMaxDuration)
            const min = new Date(this.timePicked.getTime() - this.queryMaxDuration)
            // 当选择了1个时间点，计算可选时间范围
            return time.getTime() > max.getTime() || time.getTime() < min.getTime()
          } else {
            return false
          }
        },
        /**
         * 选择第一个时间点时记录
         * @param {object} time 时间对象，第一个点是minDate
         */
        onPick: (time) => {
          if (time.minDate) {
            this.timePicked = time.maxDate ? '' : time.minDate
          } else {
            this.timePicked = ''
          }
        }
      },
    }
  },
  methods: {
    /**
     * 监听时间控件变化
     */
    dataChange (val) {
      this.$emit('input', val || this.defaultRange)
      this.$emit('change', val || this.defaultRange)
      if (!val) {
        this.reset()
      }
    },
    /**
     * 控件初始化
     */
    reset () {
      this.timerange = this.defaultRange
      this.$emit('input', this.defaultRange)
      this.$emit('change', this.defaultRange)
    },
    /**
     * 获取系统配置
     */
    getConfig () {
      const {
        queryDeafultDuration = 15,
        queryMaxDuration = 30
      } = cache.getDicsStorageByName('selectPropertiesByMap')
      this.configs = {
        queryDeafultDuration,
        queryMaxDuration
      }
      const startTime = this.DateFormat(new Date(new Date() - this.queryDeafultDuration))
      const endTime = this.DateFormat(new Date())
      this.defaultRange = this.type === 'datetimerange' ? [startTime + ' 00:00:00', endTime + ' 23:59:59'] : [startTime, endTime]
      this.reset()
    },
  },
  created () {
    this.getConfig()
  }
}
</script>
