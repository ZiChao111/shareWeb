<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >首页</el-breadcrumb-item>
      <el-breadcrumb-item>二手交易</el-breadcrumb-item>
    </el-breadcrumb>
<!--    主体页面-->
    <div class="mainTransaction">
      <el-card class="mainCard">
        <!--        搜索与类别区域-->
        <div class="searchInput">
          <el-row>
            <!--            搜索框-->
            <el-col :span="7" style="margin-left: 400px">
              <el-input v-model="searchThing" prefix-icon="el-icon-search" placeholder="请输入要搜索的商品内容" clearable>
                <el-button slot="append" icon="el-icon-search" @click="typeChange()">搜索</el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
          <!--            类别选择-->
          <div style="margin-top: 15px;width: 45%;margin-left: 330px;font-size: 11px">
            <a style="font-size: 15px;margin-right: 10px">类别选择 : </a>
            <el-radio-group v-model="queryInfo.itemCategory" @change="typeChange">
              <el-radio :label="''">全部</el-radio>
              <el-radio :label="'图书'">图书</el-radio>
              <el-radio :label="'零食'">零食</el-radio>
              <el-radio :label="'衣服'">衣服</el-radio>
              <el-radio :label="'电子产品'">电子产品</el-radio>
              <el-radio :label="'其它'">其它</el-radio>
            </el-radio-group>
          </div>
        <!--        帖子内容-->
        <el-table :data="thingInfo" style="width: 100%;font-size: 14px;" fit highlight-current-row  class="userTable" v-loading="loading" >
          <!--          用户基本信息-->
          <el-table-column   prop="thing_id" label="#商品id号" width="110" type="index"></el-table-column>
          <el-table-column prop="username" label="用户名" width="110"></el-table-column>
          <el-table-column prop="thing_name" label="商品名" width="110"></el-table-column>
          <el-table-column prop="type" label=" 商品类别" width="110"></el-table-column>
          <el-table-column prop="price" label="价格" width="100"></el-table-column>
          <el-table-column prop="school" label="学校" width="100"></el-table-column>
          <el-table-column prop="phone" label="电话" width="130"></el-table-column>
          <el-table-column prop="qq" label="QQ" width="120"></el-table-column>
          <el-table-column prop="die_time" label="到期时间" width="160"></el-table-column>
          <!--          操作-->
          <el-table-column  label="操作" width="120" header-align="center">
            <template slot-scope="scope">
              <el-tooltip  effect="dark" content="商品备注" placement="top-end" :enterable="false">
                <!--              查看帖子内容按钮-->
                <el-button type="primary" icon="el-icon-c-scale-to-original" size="mini"  @click="showMainContent(scope.row.remark)"></el-button>
              </el-tooltip>
              <!--              删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteDialog(scope.row.thing_id)" ></el-button>
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
    <!--    显示商品主体信息的对话框-->
    <el-dialog
      :visible.sync="seeThingDialogVisible"
      title="商品备注"
      width="30%">
      <span>{{thingRemark}}</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="seeThingDialogVisible = false">关 闭</el-button>
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
      // 范围选择， 0表示全部
      range: 0,
      // 已选物品类别,商品关键字，页数，一页个数
      queryInfo: {
        itemCategory: '',
        pageNum: 1,
        pageSize: 10
      },
      // 总信息条数
      totalMes: 100,
      // 商品其他信息
      thingInfo: [
      ],
      // 商品备注显示
      thingRemark: '',
      // 控制编辑商品对话框控件
      editThingDialogVisible: false,
      // 控制删除商品对话框控件
      deleteThingDialogVisible: false,
      // 控制打开商品主体内容的控件
      seeThingDialogVisible: false
    }
  },
  // 生命周期函数
  created () {
    // 获取全部商品
    this.getItemMes()
    // 获取全部商品数量
    this.getItemNumber()
  },
  // 函数方法
  methods: {
    // 根据queryInfo获得帖子列表的函数,获得商品的各个属性（待写） !!!!!
    async getItemMes () {
      // 页面进入待刷新状态
      this.loading = true
      // 传递查询参数
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.pageNum)
      formData.append('keywords', this.searchThing)
      formData.append('type', this.queryInfo.itemCategory)
      formData.append('inschool', '0')
      const token = window.sessionStorage.getItem('token')

      const { data: res } = await this.$axios.post('/thing_get', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      if (!res) {
        this.$message.error('获取信息失败')
      }
      // 得到商品数据
      this.thingInfo = res
      console.log(res)
      this.$forceUpdate()
      // 页面刷新成功
      this.loading = false
      this.$message.success('商品信息刷新成功')
    },
    // 获取商品总数
    async getItemNumber () {
      // 传递查询参数
      const formData = new FormData()
      formData.append('keywords', this.searchThing)
      formData.append('type', this.queryInfo.itemCategory)
      formData.append('inschool', '0')

      const token = window.sessionStorage.getItem('token')

      const { data: res } = await this.$axios.post('/thing_get_number', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      if (!res && res !== 0) {
        this.totalMes = 100
        this.$message.error('获取商品总数失败')
      }
      // 得到商品数据
      this.totalMes = res
    },
    // 改变类别
    async typeChange () {
      await this.getItemNumber()
      await this.getItemMes()
    },
    // 监听页数改变
    async handleSizeChange () {
      console.log(this.queryInfo.pageNum)
      // 刷新商品信息
      await this.getItemNumber()
      await this.getItemMes()
    },
    // 显示商品主要内容
    showMainContent (remake) {
      this.thingRemark = remake
      this.seeThingDialogVisible = true
    },
    // 显示删除商品对话框
    deleteDialog (thing_id) {
      console.log(thing_id)
      this.$confirm('是否永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteThing(thing_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除商品
    async deleteThing (thing_id) {
      // 传递查询参数
      const token = window.sessionStorage.getItem('token')
      const deleteForm = new FormData()
      deleteForm.append('id', thing_id)
      console.log(thing_id)
      const { data: res } = await this.$axios.post('/thing_reset', deleteForm,
        {
          headers: {
            accesstoken: token
          }
        })
      console.log(res)
      if (res !== 1) {
        return this.$message.error('商品删除失败')
      }
      this.$message.success('商品删除成功')
      // 获得商品属性
      await this.getItemNumber()
      await this.getItemMes()
    }
  }
}
</script>

<style land="less" scoped>
</style>
