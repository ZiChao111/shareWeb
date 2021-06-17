<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >首页</el-breadcrumb-item>
      <el-breadcrumb-item>失物招领</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    主体页面-->
    <div class="mainLostAndFound">
      <el-card class="mainCard">
        <!--        搜索与类别区域-->
        <div class="searchInput">
          <el-row>
            <!--            搜索框-->
            <el-col :span="7" style="margin-left: 400px">
              <el-input v-model="searchItem" prefix-icon="el-icon-search" placeholder="请输入要搜索的丢失物品内容" clearable>
                <el-button slot="append" icon="el-icon-search" @click="typeChange()">搜索</el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <!--            类别选择-->
        <div style="margin-top: 15px;width: 45%;margin-left: 460px;font-size: 19px">
          <a style="font-size: 15px;margin-right: 10px">类别选择 : </a>
          <el-radio-group v-model="queryInfo.itemType" @change="typeChange">
            <el-radio :label="1">失物</el-radio>
            <el-radio :label="0">招领</el-radio>
          </el-radio-group>
        </div>
        <!--        帖子内容-->
        <el-table :data="itemInfo" style="width: 100%;font-size: 15px;" fit highlight-current-row  class="userTable" v-loading="loading" >
          <!--          用户基本信息-->
          <el-table-column   prop="item_id" label="#物品id号" width="110" type="index"></el-table-column>
          <el-table-column prop="username" label="用户名" width="110"></el-table-column>
          <el-table-column prop="item_name" label="物品名" width="110"></el-table-column>
          <el-table-column prop="tell_campus" label="校区" width="110"></el-table-column>
          <el-table-column prop="symbol" label=" 物品类别" width="110"></el-table-column>
          <el-table-column prop="connect_peo" label="联系人" width="100"></el-table-column>
          <el-table-column prop="connect_phone" label="电话" width="140"></el-table-column>
          <el-table-column prop="die_time" label="到期时间" width ="180"></el-table-column>
          <!--          操作-->
          <el-table-column  label="操作" width="120" header-align="center">
            <template slot-scope="scope">
              <el-tooltip  effect="dark" content="物品备注" placement="top-end" :enterable="false">
                <!--              查看帖子内容按钮-->
                <el-button type="primary" icon="el-icon-c-scale-to-original" size="mini"  @click="showMainContent(scope.row.instruction)"></el-button>
              </el-tooltip>
              <!--              删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteDialog(scope.row.item_id)" ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--        帖子内容-->
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
    <!--    显示物品主体信息的对话框-->
    <el-dialog
      :visible.sync="seeItemDialogVisible"
      title="物品备注"
      width="30%">
      <span>{{itemRemark}}</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="seeItemDialogVisible = false">关 闭</el-button>
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
      searchItem: '',
      // 页面加载
      loading: false,
      // 已选物品类别,关键字，页数，一页个数
      queryInfo: {
        itemType: 1,
        pageNum: 1,
        pageSize: 10
      },
      // 总信息条数
      totalMes: 100,
      // 所有物品信息
      itemInfo: [
      ],
      // 物品备注显示
      itemRemark: '',
      // 控制删除物品对话框控件
      deleteItemDialogVisible: false,
      // 控制打开物品主体内容的控件
      seeItemDialogVisible: false
    }
  },
  // 生命周期函数
  created () {
    // 获取物品信息
    this.getLostAndFoundList()
    // 获取物品数目
    this.getLostAndFoundNumber()
  },
  // 函数方法
  methods: {
    // 获取帖子列表函数 遗失 + 拾得
    async getLostAndFoundList () {
      this.loading = true
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.pageNum)
      formData.append('keywords', this.searchItem)
      formData.append('tag', '')
      formData.append('getorlose', this.queryInfo.itemType)
      formData.append('time', -9999)
      console.log(this.searchItem)
      console.log(this.queryInfo.itemType + '!!!!')
      const { data: res } = await this.$axios.post('get_item', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      if (!res) {
        return this.$message.error('获取失物招领信息失败')
      }
      this.loading = false
      console.log(res)
      console.log(111)
      this.itemInfo = res
    },
    // 获取帖子数量
    async getLostAndFoundNumber () {
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('keyword', this.searchItem)
      formData.append('tag', '')
      formData.append('getorlose', this.queryInfo.itemType)
      formData.append('time', -9999)
      const { data: res } = await this.$axios.post('get_item_number', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      console.log(res)
      this.totalMes = res
    },
    // 改变类别
    async typeChange () {
      await this.getLostAndFoundNumber()
      await this.getLostAndFoundList()
    },
    // 监听页数改变
    async handleSizeChange () {
      console.log(this.queryInfo.pageNum)
      // 刷新用户信息
      await this.getLostAndFoundNumber()
      await this.getLostAndFoundList()
    },
    // 显示物品备注
    showMainContent (remake) {
      this.itemRemark = remake
      this.seeItemDialogVisible = true
    },
    // 显示删除商品对话框
    deleteDialog (item_id) {
      this.$confirm('是否永久删除该物品记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteItem(item_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除物品
    async deleteItem (item_id) {
      // 传递查询参数
      const formData = new FormData()
      formData.append('item_id', item_id)
      const token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$axios.post('/item/delete', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      console.log(111)
      console.log(res)
      // 得到组队信息
      this.loading = false
      this.$message.success('删除成功')
      await this.getLostAndFoundNumber()
      await this.getLostAndFoundList()
    }
  }
}
</script>

<style land="less" scoped>
</style>
