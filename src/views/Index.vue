<template>
  <div class="index">
    <el-alert title="欢迎使用物流管理平台" type="success" class="title">
    </el-alert>
    <!-- 中控展示台 -->
    <div class="view">
      <div class="space">
        <div class="total">
          <svg
            t="1619689274086"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6979"
            width="200"
            height="200"
          >
            <path
              d="M827.733333 896H196.266667c-14.933333 0-25.6-10.666667-25.6-25.6V153.6C170.666667 138.666667 181.333333 128 196.266667 128h631.466666c14.933333 0 25.6 10.666667 25.6 25.6v716.8c0 14.933333-10.666667 25.6-25.6 25.6z"
              fill="#24AA7D"
              p-id="6980"
            ></path>
            <path
              d="M827.733333 917.333333H196.266667C170.666667 917.333333 149.333333 896 149.333333 870.4V153.6C149.333333 128 170.666667 106.666667 196.266667 106.666667h631.466666C853.333333 106.666667 874.666667 128 874.666667 153.6v716.8c0 25.6-21.333333 46.933333-46.933334 46.933333zM196.266667 149.333333c-2.133333 0-4.266667 2.133333-4.266667 4.266667v716.8c0 2.133333 2.133333 4.266667 4.266667 4.266667h631.466666c2.133333 0 4.266667-2.133333 4.266667-4.266667V153.6c0-2.133333-2.133333-4.266667-4.266667-4.266667H196.266667z"
              fill="#24AA7D"
              p-id="6981"
            ></path>
            <path
              d="M300.8 426.666667c-6.4 0-10.666667-2.133333-14.933333-6.4l-44.8-44.8c-8.533333-8.533333-8.533333-21.333333 0-29.866667 8.533333-8.533333 21.333333-8.533333 29.866666 0l44.8 44.8c8.533333 8.533333 8.533333 21.333333 0 29.866667-4.266667 4.266667-10.666667 6.4-14.933333 6.4z"
              fill="#FCFCFC"
              p-id="6982"
            ></path>
            <path
              d="M300.8 426.666667c-6.4 0-10.666667-2.133333-14.933333-6.4-8.533333-8.533333-8.533333-21.333333 0-29.866667l104.533333-104.533333c8.533333-8.533333 21.333333-8.533333 29.866667 0s8.533333 21.333333 0 29.866666l-104.533334 104.533334c-4.266667 4.266667-10.666667 6.4-14.933333 6.4z"
              fill="#FCFCFC"
              p-id="6983"
            ></path>
            <path
              d="M300.8 682.666667c-6.4 0-10.666667-2.133333-14.933333-6.4l-44.8-44.8c-8.533333-8.533333-8.533333-21.333333 0-29.866667s21.333333-8.533333 29.866666 0l44.8 44.8c8.533333 8.533333 8.533333 21.333333 0 29.866667-4.266667 4.266667-10.666667 6.4-14.933333 6.4z"
              fill="#1E1E1E"
              p-id="6984"
            ></path>
            <path
              d="M300.8 682.666667c-6.4 0-10.666667-2.133333-14.933333-6.4-8.533333-8.533333-8.533333-21.333333 0-29.866667l104.533333-104.533333c8.533333-8.533333 21.333333-8.533333 29.866667 0s8.533333 21.333333 0 29.866666l-104.533334 104.533334c-4.266667 4.266667-10.666667 6.4-14.933333 6.4z"
              fill="#FCFCFC"
              p-id="6985"
            ></path>
            <path
              d="M300.8 682.666667c-6.4 0-10.666667-2.133333-14.933333-6.4l-44.8-44.8c-8.533333-8.533333-8.533333-21.333333 0-29.866667s21.333333-8.533333 29.866666 0l44.8 44.8c8.533333 8.533333 8.533333 21.333333 0 29.866667-4.266667 4.266667-10.666667 6.4-14.933333 6.4z"
              fill="#FCFCFC"
              p-id="6986"
            ></path>
            <path
              d="M300.8 682.666667c-6.4 0-10.666667-2.133333-14.933333-6.4-8.533333-8.533333-8.533333-21.333333 0-29.866667l104.533333-104.533333c8.533333-8.533333 21.333333-8.533333 29.866667 0s8.533333 21.333333 0 29.866666l-104.533334 104.533334c-4.266667 4.266667-10.666667 6.4-14.933333 6.4z"
              fill="#FCFCFC"
              p-id="6987"
            ></path>
            <path
              d="M746.666667 384H469.333333c-12.8 0-21.333333-8.533333-21.333333-21.333333s8.533333-21.333333 21.333333-21.333334h277.333334c12.8 0 21.333333 8.533333 21.333333 21.333334s-8.533333 21.333333-21.333333 21.333333zM746.666667 640H469.333333c-12.8 0-21.333333-8.533333-21.333333-21.333333s8.533333-21.333333 21.333333-21.333334h277.333334c12.8 0 21.333333 8.533333 21.333333 21.333334s-8.533333 21.333333-21.333333 21.333333z"
              fill="#FCFCFC"
              p-id="6988"
            ></path>
          </svg>
          <el-link :underline="false" type="primary"
            >总订单数: <span>{{ countOrders.total }}</span></el-link
          >
        </div>
        <div class="check">
          <svg
            t="1619689875288"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="9128"
            width="200"
            height="200"
          >
            <path
              d="M797.0304 946.1248H233.728c-52.3264 0-94.7712-42.4448-94.7712-94.7712V275.3024c0-52.3264 42.4448-94.7712 94.7712-94.7712h563.3536c52.3264 0 94.7712 42.4448 94.7712 94.7712v576c-0.0512 52.3776-42.4448 94.8224-94.8224 94.8224z"
              fill="#CCDAFF"
              p-id="9129"
            ></path>
            <path
              d="M662.4256 281.856H357.0688c-35.7888 0-64.768-28.9792-64.768-64.768V146.688c0-35.7888 28.9792-64.768 64.768-64.768h305.3056c35.7888 0 64.768 28.9792 64.768 64.768V217.088c0.0512 35.7888-28.9792 64.768-64.7168 64.768zM480.768 736.8704c-12.544 0-25.1392-4.7616-34.7648-14.2336l-113.0496-111.2064c-19.5072-19.2-19.8144-50.6368-0.5632-70.144 19.2-19.5072 50.6368-19.7632 70.144-0.5632l77.7728 76.4928 154.2656-156.2112c19.2512-19.5072 50.688-19.712 70.144-0.4608a49.58208 49.58208 0 0 1 0.4608 70.144l-189.0304 191.4368a49.95584 49.95584 0 0 1-35.3792 14.7456z"
              fill="#7A7AF9"
              p-id="9130"
            ></path>
          </svg>
          <el-link :underline="false" type="primary"
            >待确认订单: <span>{{ countOrders.noArrive }}</span></el-link
          >
        </div>
        <div class="add">
          <svg
            t="1619689924517"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="11373"
            width="200"
            height="200"
          >
            <path
              d="M832 768.4V640.7h-64v127.7H640v63.9h128V960h64V832.3h128v-63.9z"
              fill="#669E8B"
              p-id="11374"
            ></path>
            <path
              d="M832 768.4V640.7h-64v127.7H640v63.9h128V960h64V832.3h128v-63.9z"
              fill="#669E8B"
              p-id="11375"
            ></path>
            <path
              d="M728 301.9c0 10.5-5.2 20.3-13.8 26.3L413.9 535.3c-5.5 3.8-11.8 5.7-18.2 5.7-6.4 0-12.7-1.9-18.2-5.7L77.8 328.8c-8.6-6-13.8-15.8-13.8-26.3s5.2-20.3 13.8-26.3L378.1 69.6c10.9-7.5 25.4-7.5 36.3 0l299.7 206c8.7 6 13.9 15.8 13.9 26.3z"
              fill="#E6C37C"
              p-id="11376"
            ></path>
            <path
              d="M395.7 713.2c-6.4 0-12.7-1.9-18.2-5.7L77.8 501c-14.5-10-18.2-29.9-8.1-44.4 10-14.5 30-18.1 44.5-8.1l281.5 194 282.1-194.6c14.5-10 34.5-6.4 44.5 8.1s6.4 34.4-8.1 44.4L413.9 707.6c-5.5 3.7-11.8 5.6-18.2 5.6z"
              fill="#E6C37C"
              p-id="11377"
            ></path>
            <path
              d="M576 704.6h104.5l23.5-16.2v-64.2c-8.7-2.2-18.2-0.8-26.2 4.6L395.7 823.4l-281.5-194c-14.5-10-34.5-6.4-44.5 8.1s-6.4 34.4 8.1 44.4l299.7 206.6c5.5 3.8 11.8 5.7 18.2 5.7 6.4 0 12.7-1.9 18.2-5.7L576 776.7v-72.1z"
              fill="#E6C37C"
              p-id="11378"
            ></path>
          </svg>
          <el-link :underline="false" type="primary"
            >今日新增订单: <span>{{ countOrders.add }}</span></el-link
          >
        </div>
        <div class="arrive">
          <svg
            t="1619690024478"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="13700"
            width="200"
            height="200"
          >
            <path
              d="M512.7 684.9l-48.8-26.5 240.9-356.6 48.8 26.6z"
              fill="#007C68"
              p-id="13701"
            ></path>
            <path
              d="M519.9 609l-48.7-26.5 233.6-280.7 48.8 26.6z"
              fill="#A2A2A2"
              p-id="13702"
            ></path>
            <path
              d="M512.7 684.9l-48.8-26.5-131.4-141 48.7 26.6z"
              fill="#808080"
              p-id="13703"
            ></path>
            <path
              d="M381.2 544l-48.7-26.6 138.7 65.1 48.7 26.5z"
              fill="#A0A0A0"
              p-id="13704"
            ></path>
            <path
              d="M197.5 258.6l720-101.2-1.2 672.5-720 101.2 1.2-672.5z m315.2 426.3l240.9-356.6L519.9 609l-138.7-65 131.5 140.9"
              fill="#00B094"
              p-id="13705"
            ></path>
            <path
              d="M753.6 328.4L512.7 684.9 381.2 544l138.7 65z"
              fill="#DFDFDF"
              p-id="13706"
            ></path>
            <path
              d="M196.3 931.1l-48.8-26.5 1.2-672.5 48.8 26.5z"
              fill="#006757"
              p-id="13707"
            ></path>
            <path
              d="M197.5 258.6l-48.8-26.5 720.1-101.2 48.7 26.5z"
              fill="#008F78"
              p-id="13708"
            ></path>
            <path
              d="M195.3 936.3l-52.8-28.7 1.3-679.8 726-102 52.8 28.7v3l-1.3 676.8-726 102z m-42.8-34.7l44.7 24.3 714.1-100.4 1.2-665.1-44.7-24.3-714.1 100.3-1.2 665.2z"
              p-id="13709"
            ></path>
          </svg>
          <el-link :underline="false" type="primary"
            >今日送达订单: <span>{{ countOrders.arrive }}</span></el-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      orders: []
    };
  },
  methods: {
    // 获取全部订单列表
    // 获取订单列表
    async getOrders () {
      const { data: res } = await this.$axios.get('orders', {
        params: {
          pagenum: 1,
          pagesize: 9999999
        }
      });
      this.orders = res.data.docs;
    }
  },
  computed: {
    countOrders () {
      // 对订单数据进行统计
      // add：今日新增订单  arrive:今日送达订单 total:订单总量 noArrive：总未送达数量
      const result = {
        add: 0,
        arrive: 0,
        total: this.orders.length,
        noArrive: 0
      };
      // 获取当天00.00和23.59的时间戳
      const start = new Date(new Date().toLocaleDateString()).getTime();
      const end =
        new Date(new Date().toLocaleDateString()).getTime() +
        24 * 60 * 60 * 1000 -
        1;
      this.orders.forEach(item => {
        if (
          new Date(item.createTime).getTime() >= start &&
          new Date(item.createTime).getTime() <= end
        ) {
          result.add++;
        }
        if (
          new Date(item.arriveTime).getTime() >= start &&
          new Date(item.arriveTime).getTime() <= end
        ) {
          result.arrive++;
        }
        if (!item.isArrive) {
          result.noArrive++;
        }
      });
      return result;
    }
  },

  created () {
    this.getOrders();
  }
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 20px;
}
.view {
  margin-top: 20px;
}
.space {
  display: flex;
  flex-wrap: wrap;
  width: 450px;
  height: 150px;
  border: 1px dotted;
}
.space > div {
  flex: 50%;
  height: 50%;
  .el-link {
    font-size: 16px;
    margin-left: 8px;
  }
  svg {
    margin-left: 10px;
  }
}
.total {
  border-right: 1px dotted;
  border-bottom: 1px dotted;
  display: flex;
  align-items: center;
}
.check {
  border-bottom: 1px dotted;
  display: flex;
  align-items: center;
}
.add {
  border-right: 1px dotted;
  display: flex;
  align-items: center;
}
.arrive {
  display: flex;
  align-items: center;
}
</style>
