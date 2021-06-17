<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >首页</el-breadcrumb-item>
      <el-breadcrumb-item>树洞帖子</el-breadcrumb-item>
    </el-breadcrumb>
<!--    主体界面-->
    <div clas="firstCard">
      <el-card class="mainCard">
        <!--        搜索与添加区域-->
        <div class="searchInput">
          <el-row>
            <!--            搜索框-->
            <el-col :span="7" style="margin-left: 400px">
              <el-input v-model="searchPost" prefix-icon="el-icon-search" placeholder="请输入要搜索的帖子标题" clearable>
                <el-button slot="append" icon="el-icon-search" @click="changePost()">搜索</el-button>
              </el-input>
            </el-col>
<!--            检索投诉次数过高帖子-->
            <el-col :span="7" style="margin-left: 900px">
              <el-button type="text" icon="el-icon-coordinate" @click="complaintPost()">投诉帖子</el-button>
            </el-col>
          </el-row>
        </div>
<!--        帖子内容-->
        <el-table :data="postInf" style="width: 100%;font-size: 17px;" fit highlight-current-row  class="userTable" v-loading="loading" >
          <!--          用户基本信息-->
          <el-table-column  label="#" width="70" type="index"></el-table-column>
          <el-table-column prop="username" label="用户名" width="110"></el-table-column>
          <el-table-column prop="post_title" label="帖子标题" width="170"></el-table-column>
          <el-table-column prop="post_time" label=" 发帖时间" width="220"></el-table-column>
          <el-table-column prop="give_like_number" label="点赞数" width="100"></el-table-column>
          <el-table-column prop="give_dislike_number" label="点踩数" width="100"></el-table-column>
          <el-table-column prop="reported_number" label="投诉次数" width="120"></el-table-column>
          <!--          操作-->
          <el-table-column  label="操作" width="120" header-align="center">
            <template slot-scope="scope">
              <el-tooltip  effect="dark" content="帖子主体内容" placement="top-end" :enterable="false">
                <!--              查看帖子内容按钮-->
                <el-button type="primary" icon="el-icon-c-scale-to-original" size="mini"  @click="showMainContent(scope.row.post_content)"></el-button>
              </el-tooltip>
              <!--              删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteDialog(scope.row.post_id)" ></el-button>
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
    <!--    显示帖子主体信息的对话框-->
    <el-dialog
      :visible.sync="seePostDialogVisible"
      title="主要内容"
      width="30%">
      <span>{{postContent}}</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="seePostDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 变量
  data () {
    return {
      // 搜索的商品
      searchPost: '',
      // 加载界面
      loading: false,
      // 页数，一页用户数
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      // 总信息条数
      totalMes: 100,
      // 判断是否找被投诉单子
      complain: false,
      // 帖子信息
      postInf: [
      ],
      // 帖子内容
      postContent: '',
      // 控制删除帖子对话框控件
      deletePostDialogVisible: false,
      // 控制打开帖子主体内容的控件
      seePostDialogVisible: false,
      // 是否是投诉的排序
      complaint: false
    }
  },
  // 生命周期函数
  created () {
    // 获取所有商品
    this.getAllPostInf()
    // 获取商品数量
    this.getPostNumber()
  },
  // 函数方法
  methods: {
    // 获取所有帖子信息
    async getAllPostInf () {
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.pageNum)
      formData.append('keywords', this.searchPost)
      console.log(this.searchPost)
      const token = window.sessionStorage.getItem('token')
      const data = await this.$axios.post('/get_content', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      this.postInf = data.data
    },
    // 获取帖子总数信息
    async getPostNumber () {
      const formData = new FormData()
      formData.append('keyword', this.searchPost)
      const token = window.sessionStorage.getItem('token')
      const data = await this.$axios.post('/get_content_number', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      this.totalMes = data.data
    },
    // 监听页数改变
    async handleSizeChange () {
      console.log(this.queryInfo.pageNum)
      // 刷新用户信息
      await this.getPostNumber()
      await this.getAllPostInf()
    },
    // 改变帖子
    async changePost () {
      // 获得帖子属性
      await this.getPostNumber()
      await this.getAllPostInf()
    },
    // 打开被投诉的帖子 没写完
    async complaintPost () {
      this.complaint = !this.complaint
      if (this.complaint) {
        const formData = new FormData()
        const token = window.sessionStorage.getItem('token')
        const data = await this.$axios.post('/get_reported_content2', formData,
          {
            headers: {
              accesstoken: token
            }
          })
        this.postInf = data.data
      } else {
        // 获得帖子属性
        await this.getPostNumber()
        await this.getAllPostInf()
      }
    },
    // 打开对话框，显示帖子主体
    showMainContent (post_content) {
      this.postContent = post_content
      this.seePostDialogVisible = true
    },
    // 显示删除帖子对话框
    deleteDialog (post_id) {
      this.$confirm('是否永久删除该帖子记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletePost(post_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除帖子
    async deletePost (post_id) {
      console.log(post_id)
      // 传递查询参数
      const token = window.sessionStorage.getItem('token')
      const deleteForm = new FormData()
      deleteForm.append('post_id', post_id)
      const { data: res } = await this.$axios.post('/delete_content', deleteForm,
        {
          headers: {
            accesstoken: token
          }
        })
      console.log(res)
      if (res !== 1) {
        return this.$message.error('帖子删除失败')
      }
      this.$message.success('帖子删除成功')
      // 获得帖子属性
      await this.getPostNumber()
      await this.getAllPostInf()
    }
  }
}
</script>

<style land="less" scoped>
</style>
