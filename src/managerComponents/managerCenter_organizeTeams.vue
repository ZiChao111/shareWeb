<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >首页</el-breadcrumb-item>
      <el-breadcrumb-item>组队记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    主体页面-->
    <div class="mainTeam">
      <el-card class="mainCard">
        <!--        搜索与类别区域-->
        <div class="searchInput">
          <el-row>
            <!--            搜索框-->
            <el-col :span="7" style="margin-left: 400px">
              <el-input v-model="searchThing" prefix-icon="el-icon-search" placeholder="请输入要搜索的组队内容" clearable>
                <el-button slot="append" icon="el-icon-search" @click="typeChange()">搜索</el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <!--            类别选择-->
        <div style="margin-top: 15px;width: 45%;margin-left: 330px;font-size: 11px">
          <a style="font-size: 15px;margin-right: 10px;">类别选择 : </a>
          <el-radio-group v-model="queryInfo.teamCategory" @change="typeChange" style="padding-top: 10px">
            <el-radio :label="''">全部</el-radio>
            <el-radio :label="'组队比赛'">组队比赛</el-radio>
            <el-radio :label="'聚会K歌'">聚会K歌</el-radio>
            <el-radio :label="'拼车'">拼车</el-radio>
            <el-radio :label="'社团招新'">社团招新</el-radio>
            <el-radio :label="'寻求帮助'">寻求帮助</el-radio>
            <el-radio :label="'其它'">其它</el-radio>
          </el-radio-group>
        </div>
        <!--        帖子内容-->
        <el-table :data="teamInfo" style="width: 100%;font-size: 14px;" fit highlight-current-row  class="userTable" v-loading="loading" >
          <!--          用户基本信息-->
          <el-table-column   prop="team_id" label="#组队id号" width="110" type="index"></el-table-column>
          <el-table-column prop="username" label="用户名" width="110"></el-table-column>
          <el-table-column prop="title" label="组队标题" width="110"></el-table-column>
          <el-table-column prop="teamType" label="队伍类别" width="110"></el-table-column>
          <el-table-column prop="school" label="学校" width="100"></el-table-column>
          <el-table-column prop="sponsor" label="发起人" width="100"></el-table-column>
          <el-table-column prop="number" label="人数" width="100"></el-table-column>
          <el-table-column prop="phone" label="电话" width="130"></el-table-column>
          <el-table-column prop="qq" label="QQ" width="120"></el-table-column>
          <el-table-column prop="die_time" label="到期时间" width="160"></el-table-column>
          <!--          操作-->
          <el-table-column  label="操作" width="120" header-align="center">
            <template slot-scope="scope">
              <el-tooltip  effect="dark" content="备注" placement="top-end" :enterable="false">
                <!--              查看帖子内容按钮-->
                <el-button type="primary" icon="el-icon-c-scale-to-original" size="mini"  @click="showMainContent(scope.row.remark)"></el-button>
              </el-tooltip>
              <!--              删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteDialog(scope.row.team_id)" ></el-button>
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
    <!--    显示组队备注信息的对话框-->
    <el-dialog
      :visible.sync="seeTeamDialogVisible"
      title="队伍备注"
      width="30%">
      <span>{{teamRemark}}</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="seeTeamDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 变量
  data () {
    return {
      // 搜索商品
      searchThing: '',
      // 页面加载
      loading: false,
      // 已选物品类别,商品关键字，页数，一页个数
      queryInfo: {
        teamCategory: '',
        pageNum: 1,
        pageSize: 10
      },
      // 总信息条数
      totalMes: 100,
      // 商品其他信息
      teamInfo: [
      ],
      // 商品备注显示
      teamRemark: '',
      // 控制删除商品对话框控件
      deleteTeamIDialogVisible: false,
      // 控制打开商品主体内容的控件
      seeTeamDialogVisible: false
    }
  },
  // 生命周期函数
  created () {
    // 获取组队信息
    this.getTeamMes()
    // 获取全部组队信息数量
    this.getTeamNumber()
  },
  // 函数方法
  methods: {
    // 得到组队内容
    async getTeamMes () {
      // 页面进入待刷新状态
      this.loading = true
      // 传递查询参数
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.pageNum)
      formData.append('keyword', this.searchThing)
      formData.append('teamType', this.queryInfo.teamCategory)
      formData.append('inschool', '0')
      for (var value of formData.values()) { console.log(value) }
      console.log(this.queryInfo.teamCategory)
      const token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$axios.post('/team_get', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      console.log(res)
      if (!res) {
        this.$message.error('获取信息失败')
      }
      // 得到商品数据
      this.teamInfo = res
      console.log(this.teamInfo)
      // 页面刷新成功
      this.loading = false
      this.$message.success('获取组队信息成功')
      this.$forceUpdate()
    },
    // 获取组队总数
    async getTeamNumber () {
      // 传递查询参数
      const formData = new FormData()
      formData.append('keyword', this.searchThing)
      formData.append('teamType', this.queryInfo.teamCategory)
      formData.append('inschool', '0')
      const token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$axios.post('/team_get_number', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      console.log(res)
      if (!res && res !== 0) {
        this.$message.error('获取信息失败!')
      }
      this.totalMes = res
    },
    // 改变类别
    async typeChange () {
      await this.getTeamNumber()
      await this.getTeamMes()
    },
    // 监听页数改变
    async handleSizeChange () {
      console.log(this.queryInfo.pageNum)
      // 刷新用户信息
      await this.getTeamNumber()
      await this.getTeamMes()
    },
    // 显示组队主要内容
    showMainContent (remake) {
      this.teamRemark = remake
      this.seeTeamDialogVisible = true
    },
    // 显示删除组队记录对话框
    deleteDialog (team_id) {
      console.log(team_id)
      this.$confirm('是否永久删除该组队记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTeam(team_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除队伍
    async deleteTeam (team_id) {
      // 传递查询参数
      const token = window.sessionStorage.getItem('token')
      const deleteForm = new FormData()
      deleteForm.append('id', team_id)
      console.log(team_id + '!!!')
      const { data: res } = await this.$axios.post('/team_reset', deleteForm,
        {
          headers: {
            accesstoken: token
          }
        })
      console.log('!!!!!!!!!!!2')
      console.log(res)
      if (res !== 1) {
        return this.$message.error('队伍删除失败')
      }
      this.$message.success('队伍删除成功')
      // 获得队伍属性
      await this.getTeamNumber()
      await this.getTeamMes()
    }
  }
}
</script>

<style land="less" scoped>
</style>
