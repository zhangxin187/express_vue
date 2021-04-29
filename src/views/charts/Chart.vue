<template>
  <div class="charts">
    <!-- 物品、分类饼状图 -->
    <div class="pie">
      <h3 class="title">订单物品分类统计饼状图</h3>
      <!-- 选择框操作区 -->
      <el-row type="flex" class="opreaArea">
        <el-col :span="12">
          <el-select v-model="goodsPieSlectValue" placeholder="请选择" @change="changeGoodsPieView">
            <el-option label="下单量" value="count"></el-option>
            <el-option label="重量" value="weight"></el-option>
          </el-select>
          <el-date-picker
            v-model="goodsDateRange"
            type="daterange"
            align="right"
            unlink-panels
            start-placeholder="起始日期"
            end-placeholder="截至日期"
            :picker-options="pickerOptions"
            value-format="timestamp"
            @change="changeGoodsPieByTimeRange"
          ></el-date-picker>
        </el-col>
        <el-col :span="12">
          <el-select v-model="catePieSlectValue" placeholder="请选择" @change="changeCatePieView">
            <el-option label="下单量" value="count"></el-option>
            <el-option label="重量" value="weight"></el-option>
          </el-select>

          <el-date-picker
            v-model="cateDateRange"
            type="daterange"
            align="right"
            unlink-panels
            start-placeholder="起始日期"
            end-placeholder="截至日期"
            :picker-options="pickerOptions"
            value-format="timestamp"
            @change="changeCatePieByTimeRange"
          ></el-date-picker>
        </el-col>
      </el-row>

      <!-- 图表 -->
      <el-row type="flex" >
        <el-col :span="12">
          <div ref="goodsPie" style="width:100%;height:300px"></div>
        </el-col>
        <el-col :span="12">
          <div ref="catePie" style="width:100%;height:300px"></div>
        </el-col>
      </el-row>
    </div>

    <!-- 分类折线图 -->
    <div class="line">
      <h3 class="title">订单分类统计折线图</h3>
      <!-- 选择框操作区 -->
      <el-row type="flex" class="opreaArea">
        <el-col>
        <el-select v-model="cateLineSlectValue" placeholder="请选择" @change="changeCateLineView">
            <el-option label="下单量" value="count"></el-option>
            <el-option label="重量" value="weight"></el-option>
          </el-select>

          <el-date-picker
            v-model="cateSeriesDateRange"
            type="daterange"
            align="right"
            unlink-panels
            start-placeholder="起始日期"
            end-placeholder="截至日期"
            :picker-options="pickerOptions"
            value-format="timestamp"
            @change="changeCateLineByTimeRange"
          ></el-date-picker>
        </el-col>
      </el-row>

      <!-- 图表 -->
      <el-row type="flex" :gutter="100">
        <el-col :span="24" >
          <div ref="cateLine" style="width:100%;height:300px"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      countGoods: [],
      countCate: [],
      // 物品饼状图选择框选中的值
      goodsPieSlectValue: 'count',
      // 分类饼状图选择框选中的值
      catePieSlectValue: 'count',
      // 物品日期选择框选中的日期范围
      goodsDateRange: [],
      // 分类日期选择框选中的日期范围
      cateDateRange: [],
      // 日期范围选择器的快捷栏配置项
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近半年',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一年',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      // 连续时间分类统计数据
      countCateSeries: [],
      // 分类统计折线图的坐标轴
      cateRow: [],
      // 分类统计折线图选择框绑定值
      cateLineSlectValue: 'count',
      cateSeriesDateRange: []
    };
  },
  methods: {
    // 获取统计规定日期内订单物品的个数、重量
    async getCountGoods (start, end) {
      const { data: res } = await this.$axios.get('charts/countGoods', {
        params: {
          start,
          end
        }
      });
      this.countGoods = res.data;
    },

    // 获取统计规定日期内订单物品分类的个数、重量
    async getCountCate (start, end) {
      const { data: res } = await this.$axios.get('charts/countCate', {
        params: {
          start,
          end
        }
      });
      this.countCate = res.data;
    },

    // 获取一段连续时间系列的订单分类统计数据
    async getCountCateSeries () {
      // 不带参数,默认是最近一周的时间
      const { data: res } = await this.$axios.get('charts/countCateSeries');
      this.countCateSeries = res.data.data;
      this.cateRow = res.data.lable;
    },

    // 初始化饼状图
    initPie (dom, data, text) {
      // 基于准备好的dom，初始化echarts实例
      // eslint-disable-next-line no-undef
      var myChart = echarts.init(dom);

      var option = {
        title: {
          text: text,
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          align: 'left',
          left: 'left'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '50%',
            left: '20%',
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    // 初始化折线图
    initLine (dom, opt, row) {
      // 基于准备好的dom，初始化echarts实例
      // eslint-disable-next-line no-undef
      var myChart = echarts.init(dom);
      const option = {
        title: {
          text: '分类统计堆叠区域'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          // ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
          data: opt.legend.data
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            // ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            data: row
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: opt.series
      };
      // 传入的opt与option进行合并
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    // 改变物品饼状图的数据显示,即从订单数改为重量
    changeGoodsPieView (value) {
      if (value === 'weight') {
        this.initPie(
          this.$refs.goodsPie,
          this.echartsGoodsByweight,
          '物品重量占比'
        );
      } else {
        this.initPie(
          this.$refs.goodsPie,
          this.echartsGoodsBycount,
          '物品订单数占比'
        );
      }
    },

    // 改变物品分类饼状图的数据显示,即从订单数改为重量
    changeCatePieView (value) {
      if (value === 'weight') {
        this.initPie(
          this.$refs.catePie,
          this.echartsCateByweight,
          '所属分类重量占比'
        );
      } else {
        this.initPie(
          this.$refs.catePie,
          this.echartsCateBycount,
          '所属分类订单数占比'
        );
      }
    },

    // 改变物品饼状图数据的日期范围
    changeGoodsPieByTimeRange () {
      this.getCountGoods(this.goodsDateRange[0], this.goodsDateRange[1]);
    },

    // 改变物品分类饼状图数据的日期范围
    changeCatePieByTimeRange () {
      this.getCountCate(this.cateDateRange[0], this.cateDateRange[1]);
    },

    // 改变分类折线图的数据显示,即从订单量切换到重量
    changeCateLineView (value) {
      if (value === 'count') {
        this.initLine(this.$refs.cateLine, this.echartsCateSeriesBycount, this.cateRow);
      } else {
        this.initLine(this.$refs.cateLine, this.echartsCateSeriesByweight, this.cateRow);
      }
    },

    async changeCateLineByTimeRange () {
      const { data: res } = await this.$axios.get('charts/countCateSeries', {
        params: {
          start: this.cateSeriesDateRange[0],
          end: this.cateSeriesDateRange[1]
        }
      });
      this.countCateSeries = res.data.data;
      this.cateRow = res.data.lable;
    }

  },

  created () {
    this.getCountGoods();
    this.getCountCate();
    this.getCountCateSeries();
  },

  // axios异步发起请求获取数据并赋值给data,在mounted中是获取不到赋值后的data,异步原因
  // 故在侦听器中进行一系列操作,当data发生了变化再执行操作,可以获取到赋值后的data
  watch: {
    countGoods () {
      console.log(this.echartsGoodsBycount);
      if (this.goodsPieSlectValue === 'count') {
        this.initPie(
          this.$refs.goodsPie,
          this.echartsGoodsBycount,
          '物品订单数占比'
        );
      } else {
        this.initPie(
          this.$refs.goodsPie,
          this.echartsGoodsByweight,
          '物品订单数占比'
        );
      }
    },
    countCate () {
      if (this.catePieSlectValue === 'count') {
        this.initPie(
          this.$refs.catePie,
          this.echartsCateBycount,
          '所属分类订单数占比'
        );
      } else {
        this.initPie(
          this.$refs.catePie,
          this.echartsCateByweight,
          '所属分类重量占比'
        );
      }
    },
    countCateSeries () {
      this.initLine(this.$refs.cateLine, this.echartsCateSeriesBycount, this.cateRow);
    }
  },

  computed: {
    // 返回echarts配置项要求的格式,数据为订单物品个数
    echartsGoodsBycount () {
      const result = [];
      this.countGoods.forEach((item) => {
        result.push({ name: item.name, value: item.count });
      });
      // 对象数组排序,根据对象.value从大到小排序,并截取前8位
      // 只展示订单量前8
      return result.sort((a, b) => {
        return b.value - a.value;
      }).slice(0, 8);
    },

    // 数据为订单物品重量
    echartsGoodsByweight () {
      const result = [];
      this.countGoods.forEach((item) => {
        result.push({ name: item.name, value: item.weight });
      });
      // 只展示重量前8
      return result.sort((a, b) => {
        return b.value - a.value;
      }).slice(0, 8);
    },
    // 数据为订单分类成交数
    echartsCateBycount () {
      const result = [];
      this.countCate.forEach((item) => {
        result.push({ name: item.name, value: item.count });
      });
      return result;
    },

    // 数据为订单分类的总重量
    echartsCateByweight () {
      const result = [];
      this.countCate.forEach((item) => {
        result.push({ name: item.name, value: item.weight });
      });
      return result;
    },

    // 将分类系列数据处理为echarts.option的格式,以便于固定option合并
    echartsCateSeriesBycount () {
      const result = { series: [], legend: { data: [] } };
      this.countCateSeries.forEach(item => {
        result.series.push({
          name: item.name,
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: item.count
        });
        result.legend.data.push(item.name);
      });
      return result;
    },

    // 将分类系列数据处理为echarts.option的格式,以便于固定option合并
    echartsCateSeriesByweight () {
      const result = { series: [], legend: { data: [] } };
      this.countCateSeries.forEach(item => {
        result.series.push({
          name: item.name,
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: item.weight
        });
        result.legend.data.push(item.name);
      });
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.opreaArea {
  margin-bottom: 20px;
}
.el-select {
  width: 100px;
}
.el-select {
  margin-right: 10px;
}
.title {
  margin-bottom: 20px;
  color: #609ed0;
  font-size: 16px;
  font-weight: normal;
}
.line{
  padding-top:50px
}
</style>
