<template>
  <div>
<!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item >首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图区域-->
    <div class="firstCard">
      <el-card class="mainCard">
<!--        搜索与添加区域-->
        <div class="searchInput">
          <el-row>
<!--            搜索框-->
            <el-col :span="7" style="margin-left: 400px">
              <el-input v-model="searchUsername" prefix-icon="el-icon-search" placeholder="请输入要搜索的用户名" clearable>
                <el-button slot="append" icon="el-icon-search" @click="changeUser()">搜索</el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
<!--        用户列表-->
        <el-table :data="userFormData" style="width: 100%" fit highlight-current-row  class="userTable" v-loading="loading">
<!--          用户基本信息-->
          <el-table-column  label="#" width="70" type="index"></el-table-column>
          <el-table-column prop="username" label="用户名" width="110"></el-table-column>
          <el-table-column prop="password" label="密码" width="170"></el-table-column>
          <el-table-column prop="email" label=" 邮箱" width="180"></el-table-column>
          <el-table-column prop="school" label="学校" width="100"></el-table-column>
          <el-table-column prop="campus" label="校区" width="100"></el-table-column>
          <el-table-column prop="qq" label="QQ" width="120"></el-table-column>
          <el-table-column prop="phone" label="电话" width="120"></el-table-column>
          <el-table-column prop="end_time" label="账号到期时间" width="170"></el-table-column>
<!--          操作-->
          <el-table-column  label="操作" width="120" header-align="center">
            <template slot-scope="scope">
<!--              修改按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
<!--              删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteDialog(scope.row.username)" ></el-button>
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
      <!--    修改用户的对话框-->
      <el-dialog
        :visible.sync="editDialogVisible"
        title="修改用户"
        width="50%"
        @close="editDialogClosed">
        <!--      主体-->
        <el-form :model="editStudentForm" :rules="editStudentRules" ref="editStudentFormRef" label-width="100px" class="demo-ruleForm">
          <!--        用户名-->
          <el-form-item label="用户名：">
            <el-input v-model="editStudentForm.username" readonly></el-input>
          </el-form-item>
          <!--        密码-->
          <el-form-item label="密码：" prop="password">
            <el-input v-model="editStudentForm.password" ></el-input>
          </el-form-item>
          <!--   大学选择  -->
          <el-select v-model="editStudentForm.school" filterable clearable placeholder="请选择大学"  class="schoolOptions">
            <!-- v-for="item in schoolName" :key='item.id'       -->
            <el-option
              v-for="item in schoolOptions"
              :key="item.value"
              :value="item.value">
            </el-option>
          </el-select>
          <!--        校区-->
          <el-form-item label="校区：" prop="campus" >
            <el-input v-model="editStudentForm.campus"  ></el-input>
          </el-form-item>
          <!--        邮箱-->
          <el-form-item label="邮箱：" prop="email" >
            <el-input v-model="editStudentForm.email" readonly></el-input>
          </el-form-item>
          <!--        QQ-->
          <el-form-item label="QQ：" prop="qq" >
            <el-input v-model="editStudentForm.qq"  ></el-input>
          </el-form-item>
          <!--        电话-->
          <el-form-item label="电话:" prop="phone" type="number">
            <el-input v-model="editStudentForm.phone"  ></el-input>
          </el-form-item>
          <!--        账号到期时间-->
          <el-form-item label="账号到期时间:" prop="end_time" type="number">
            <el-input v-model="editStudentForm.end_time"  ></el-input>
          </el-form-item>
        </el-form>
        <!--      按钮-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo()">修 改</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  // 变量
  data () {
    // 验证手机号的规则
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (regMobile.test(value)) {
        //  合法的手机号
        return cb()
      }
      cb(new Error('请输入正确的手机号'))
    }
    // 验证QQ号的规则
    const checkQQNumber = (rule, value, cb) => {
      const regQQ = /^[0-9]{5,12}$/
      if (regQQ.test(value)) {
        //  合法的QQ号
        return cb()
      }
      cb(new Error('请输入正确的QQ号'))
    }
    return {
      // 搜索用户名
      searchUsername: '',
      // 页数，一页用户数
      queryInfo: {
        pageNum: 1,
        pageSize: 10
      },
      // 总信息条数
      totalMes: 100,
      // 用户信息表格
      userFormData: [
      ],
      // 控制编辑用户对话框控件
      editDialogVisible: false,
      // 控制删除用户对话框控件
      deleteDialogVisible: false,
      // 修改学生信息时存储信息的数组
      editStudentForm: {
        campus: '',
        email: '',
        end_time: '',
        id: 1,
        password: '',
        phone: '',
        qq: '',
        school: '',
        username: ''
      },
      // 修改学生信息的验证规则
      editStudentRules: {
        phone: [
          {
            validator: checkMobile,
            message: '请输入正确的手机号码',
            trigger: 'change'
          }
        ],
        qq: [
          {
            validator: checkQQNumber,
            message: '请输入正确的QQ号',
            trigger: 'change'
          }
        ],
        school: {
          type: 'string',
          required: true,
          message: '大学不能为空',
          trigger: 'blur'
        },
        password: [
          {
            type: 'string',
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            min: 10,
            max: 17,
            message: '密码长度在10到17个字符之间'
          }]
      },
      // 大学选项
      schoolOptions: [],
      // 删除用户的username
      deleteUsername: '',
      // 界面加载
      loading: '',
      // 获取学校
      choseSchool: true
    }
  },
  // 生命周期函数
  async created () {
    // 获取用户个数
    await this.getTotalNumber()
    // 获取用户所有信息
    await this.getAllUserInf()
    // 获取学校信息
    await this.getALLSchools()
  },
  // 函数方法
  methods: {
    // 获取所有用户信息
    async getAllUserInf () {
      // 页面进入待刷新状态
      this.loading = true
      // 传递查询参数
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.pageNum)
      formData.append('keyword', this.searchUsername)
      for (var value of formData.values()) { console.log(value) }
      const token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$axios.post('/get_user', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      console.log(res)
      if (!res) {
        this.$message.error('获取信息失败')
      }
      // 得到组队信息
      this.loading = false
      this.userFormData = res
      this.$message.success('获取用户信息成功')
    },
    // 获取用户个数
    async getTotalNumber () {
      // 传递查询参数
      const formData = new FormData()
      formData.append('keyword', this.searchUsername)
      const token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$axios.post('/get_user_number', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      if (!res) {
        this.$message.error('获取信息失败')
      }
      // 得到个数信息
      this.totalMes = res
    },
    // 获取学校
    async getALLSchools () {
      if (this.choseSchool) {
        // 传递查询参数
        const formData = new FormData()
        const token = window.sessionStorage.getItem('token')
        const { data: res } = await this.$axios.post('/user/school', formData,
          {
            headers: {
              accesstoken: token
            }
          })
        if (!res) {
          this.$message.error('获取信息失败')
        }
        console.log(this.schoolOptions)
        this.schoolOptions = res
        this.schoolOptions.length = 2688
        this.choseSchool = false
      }
    },
    // 监听页数改变
    async handleSizeChange () {
      console.log(this.queryInfo.pageNum)
      // 刷新用户信息
      await this.getTotalNumber()
      await this.getAllUserInf()
    },
    async changeUser () {
      // 刷新用户信息
      await this.getTotalNumber()
      await this.getAllUserInf()
    },
    // 展示编辑用户的对话框
    showEditDialog (row) {
      this.editStudentForm.campus = row.campus
      this.editStudentForm.username = row.username
      this.editStudentForm.qq = row.qq
      this.editStudentForm.school = row.school
      this.editStudentForm.id = row.id
      this.editStudentForm.end_time = row.end_time
      this.editStudentForm.email = row.email
      this.editStudentForm.phone = row.phone
      this.editStudentForm.password = row.password
      this.editDialogVisible = true
    },
    // 修改信息的对话框关闭
    editDialogClosed () {
      this.$refs.editStudentFormRef.resetFields()
    },
    // 修改用户
    async editUserInfo () {
      this.$refs.editStudentFormRef.validate(async valid => {
        if (!valid) return// 验证失败
        // 传递查询参数
        const formData = new FormData()
        formData.append('username', this.editStudentForm.username)
        formData.append('qq', this.editStudentForm.qq)
        formData.append('password', this.editStudentForm.password)
        formData.append('phone', this.editStudentForm.phone)
        formData.append('campus', this.editStudentForm.campus)
        formData.append('school', this.editStudentForm.school)
        formData.append('end_time', this.editStudentForm.end_time)
        for (var value of formData.values()) { console.log(value) }
        const token = window.sessionStorage.getItem('token')
        const { data: res } = await this.$axios.post('/user/change', formData,
          {
            headers: {
              accesstoken: token
            }
          })
        console.log(111)
        console.log(res)
        this.$message.success('修改成功！')
        // 刷新信息
        await this.getTotalNumber()
        await this.getAllUserInf()
        // 关闭窗口
        this.editDialogVisible = false
      })
    },
    // 删除用户的对话框
    deleteDialog (username) {
      this.$confirm('是否永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUser(username)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除用户的函数
    async deleteUser (username) {
      // 传递查询参数
      const formData = new FormData()
      formData.append('username', username)
      const token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$axios.post('user/delete', formData,
        {
          headers: {
            accesstoken: token
          }
        })
      console.log(111)
      console.log(res)
      if (!res) {
        this.$message.error('删除失败')
      }
      // 得到组队信息
      this.loading = false
      this.$message.success('删除成功')
      await this.getTotalNumber()
      await this.getAllUserInf()
    }
  }
}
</script>

<style land="less" scoped>
.userTable{
}
/*大学选择*/
.schoolOptions{
  position: relative;
  left: 21%;
  transform: translate(-30%,-10%);
  margin-bottom: 15px;
}
</style>
