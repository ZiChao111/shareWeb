<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >首页</el-breadcrumb-item>
      <el-breadcrumb-item>兼职信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    主体页面-->
    <div class="mainLostAndFound">
      <el-card class="mainCard">
        <!--        搜索与类别区域-->
        <div class="searchInput">
          <el-row>
            <!--            搜索框-->
            <el-col :span="7" style="margin-left: 400px">
              <el-input v-model="searchWork" prefix-icon="el-icon-search" placeholder="请输入要搜索的兼职内容" clearable>
                <el-button slot="append" icon="el-icon-search" @click="typeChange()">搜索</el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <!--            类别选择-->
        <div style="margin-top: 15px;width: 45%;margin-left: 360px;font-size: 19px">
          <a style="font-size: 15px;margin-right: 10px">类别选择 : </a>
          <el-radio-group v-model="queryInfo.type" @change="typeChange">
            <el-radio :label="''">全部</el-radio>
            <el-radio :label="'专科'">专科</el-radio>
            <el-radio :label="'本科'">本科</el-radio>
            <el-radio :label="'研究生'">研究生</el-radio>
            <el-radio :label="'博士'">博士</el-radio>
          </el-radio-group>
        </div>
        <!--        帖子内容-->
        <el-table :data="workInfo" style="width: 100%;font-size: 15px;" fit highlight-current-row  class="userTable" v-loading="loading" >
          <!--          用户基本信息-->
          <el-table-column   prop="work_id" label="#兼职id号" width="90" type="index"></el-table-column>
          <el-table-column prop="username" label="用户名" width="110"></el-table-column>
          <el-table-column prop="sex" label=" 性别" width="90"></el-table-column>
          <el-table-column prop="school" label="学校" width="110"></el-table-column>
          <el-table-column prop="contact" label="电话" width="140"></el-table-column>
          <el-table-column prop="intention" label="兼职意向" width="100"></el-table-column>
          <el-table-column prop="type" label="学历" width="100"></el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="130"></el-table-column>
          <el-table-column prop="endTime  " label="结束时间" width="130"></el-table-column>
          <el-table-column prop="die_time" label="帖子消失时间" width="180"></el-table-column>
          <!--          操作-->
          <el-table-column  label="操作" width="120" header-align="center">
            <template slot-scope="scope">
              <el-tooltip  effect="dark" content="备注" placement="top-end" :enterable="false">
                <!--              查看帖子内容按钮-->
                <el-button type="primary" icon="el-icon-c-scale-to-original" size="mini"  @click="showMainContent(scope.row.remark)"></el-button>
              </el-tooltip>
              <!--              删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteDialog(scope.row.work_id)" ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--        分页-->
        <el-pagination
          @current-change="handleSizeChange"
          :current-page.sync="queryInfo.pageNum"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="totalMes"
          style="margin-left: 350px">
        </el-pagination>
      </el-card>
    </div>
    <!--    显示兼职备注信息的对话框-->
    <el-dialog
      :visible.sync="seeWorkDialogVisible"
      title="兼职信息备注"
      width="30%">
      <span>{{workRemark}}</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="seeWorkDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 变量
  data () {
    return {
      // 搜索关键字
      searchWork: '',
      // 页面加载
      loading: false,
      // 已选物品类别,关键字，页数，一页个数
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        type: ''
      },
      // 总信息条数
      totalMes: 100,
      // 所有兼职信息
      workInfo: [
        {
          contact: 'rewr',
          die_time: '2021-02-25 22:27:06',
          endTime: 'wrewer',
          intention: 'rewtr',
          remark: 'wrwer',
          school: '青岛大学',
          sex: '男',
          startTime: 'wrewer',
          type: '本科在读',
          username: 'zh2r2001',
          work_id: 2
        },
        {
          contact: 'rewr',
          die_time: '2021-02-25 22:27:06',
          endTime: '',
          intention: 'rewtr',
          remark: 'wrwer',
          school: '青岛大学',
          sex: '男',
          startTime: 'wrewer',
          type: '本科在读',
          username: 'zhr2001',
          work_id: 1
        },
        {
          contact: 'rewr',
          die_time: '2021-02-25 22:27:06',
          endTime: '',
          intention: 'rewtr',
          remark: 'wrwer',
          school: '青岛大学',
          sex: '男',
          startTime: 'wrewer',
          type: '本科在读',
          username: 'zhr2001',
          work_id: 1
        },
        {
          contact: 'rewr',
          die_time: '2021-02-25 22:27:06',
          endTime: '',
          intention: 'rewtr',
          remark: 'wrwer',
          school: '青岛大学',
          sex: '男',
          startTime: 'wrewer',
          type: '本科在读',
          username: 'zhr2001',
          work_id: 1
        },
        {
          contact: 'rewr',
          die_time: '2021-02-25 22:27:06',
          endTime: '',
          intention: 'rewtr',
          remark: 'wrwer',
          school: '青岛大学',
          sex: '男',
          startTime: 'wrewer',
          type: '本科在读',
          username: 'zhr2001',
          work_id: 1
        },
        {
          contact: 'rewr',
          die_time: '2021-02-25 22:27:06',
          endTime: '',
          intention: 'rewtr',
          remark: 'wrwer',
          school: '青岛大学',
          sex: '男',
          startTime: 'wrewer',
          type: '本科在读',
          username: 'zhr2001',
          work_id: 1
        },
        {
          contact: 'rewr',
          die_time: '2021-02-25 22:27:06',
          endTime: '',
          intention: 'rewtr',
          remark: 'wrwer',
          school: '青岛大学',
          sex: '男',
          startTime: 'wrewer',
          type: '本科在读',
          username: 'zhr2001',
          work_id: 1
        },
        {
          contact: 'rewr',
          die_time: '2021-02-25 22:27:06',
          endTime: '',
          intention: 'rewtr',
          remark: 'wrwer',
          school: '青岛大学',
          sex: '男',
          startTime: 'wrewer',
          type: '本科在读',
          username: 'zhr2001',
          work_id: 1
        },
        {
          contact: 'rewr',
          die_time: '2021-02-25 22:27:06',
          endTime: '',
          intention: 'rewtr',
          remark: 'wrwer',
          school: '青岛大学',
          sex: '男',
          startTime: 'wrewer',
          type: '本科在读',
          username: 'zhr2001',
          work_id: 1
        }
      ],
      // 兼职备注显示
      workRemark: '',
      // 控制删除兼职对话框控件
      deleteWorkDialogVisible: false,
      // 控制打开兼职主体内容的控件
      seeWorkDialogVisible: false
    }
  },
  // 生命周期函数
  created () {
    // 获取全部兼职信息
    this.getWorkList()
    // 获取全部兼职数量
    this.getWorkNumber()
  },
  // 函数方法
  methods: {
    // 获取帖子列表函数
    async getWorkList () {
      this.loading = true
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.pageNum)
      formData.append('type', this.queryInfo.type)
      formData.append('intention', this.searchWork)
      const token = window.sessionStorage.getItem('token')
      const res = await this.$axios.post('/work/get', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      console.log(res)
      if (!res) {
        this.$message.error('获取信息失败')
      }
      this.loading = false
      this.workInfo = res.data
    },
    // 获取全部兼职数量
    async getWorkNumber () {
      const formData = new FormData()
      formData.append('type', this.queryInfo.type)
      formData.append('intention', this.searchWork)
      const token = window.sessionStorage.getItem('token')
      const res = await this.$axios.post('work/get_number', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      console.log(res.data)
      this.totalMes = res.data
    },
    // 监听页数改变
    async handleSizeChange () {
      console.log(this.queryInfo.pageNum)
      // 刷新用户信息
      await this.getWorkNumber()
      await this.getWorkList()
    },
    // 学历改变
    async typeChange () {
      // 刷新用户信息
      await this.getWorkNumber()
      await this.getWorkList()
    },
    // 显示兼职备注
    showMainContent (remake) {
      this.workRemark = remake
      this.seeWorkDialogVisible = true
    },
    // 显示删除兼职对话框
    deleteDialog (work_id) {
      this.$confirm('是否永久删除该兼职记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteWork(work_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除兼职（！！！）
    async deleteWork (work_id) {
      // 传递查询参数
      const token = window.sessionStorage.getItem('token')
      const deleteForm = new FormData()
      deleteForm.append('work_id', work_id)
      console.log(work_id)
      const { data: res } = await this.$axios.post('/work/delete', deleteForm,
        {
          headers: {
            accesstoken: token
          }
        })
      console.log(res)
      if (res !== 1) {
        return this.$message.error('队伍删除失败')
      }
      this.$message.success('队伍删除成功')
      // 获得兼职属性
      await this.getWorkNumber()
      await this.getWorkList()
    }
  }
}
</script>

<style land="less" scoped>
</style>
