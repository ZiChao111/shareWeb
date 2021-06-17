<template>
  <div class="register-container">
    <div>
      <!-- 背景图片区域 -->
      <div class="backgroundPicture">
    
    <el-form
      ref="registerForm"
      label-width="150px"
      class="register-form"
      :model="registerForm"
      :rules="registerRules"
    >
      <!--    用户名   -->
      <el-form-item prop="username" label="用户名:">
        <el-input v-model="registerForm.username" ></el-input>
      </el-form-item>
      <!--    邮箱   -->
      <el-form-item prop="email" label="学生邮箱:">
        <el-input v-model="registerForm.email"></el-input>
      </el-form-item>
      <!--   大学选择  -->
      <el-select v-model="registerForm.school" filterable clearable placeholder="请选择大学"  class="schoolOptions">
        <!-- v-for="item in schoolName" :key='item.id'       -->
        <el-option
          v-for="item in registerForm.schoolOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!--    密码   -->
      <el-form-item prop="password" label="密码:">
        <el-input v-model="registerForm.password" type="password" show-password></el-input>
      </el-form-item>
      <!--    确认密码   -->
      <el-form-item prop="comparePassword" label="确认密码:">
        <el-input v-model="registerForm.comparePassword" type="password" show-password ></el-input>
      </el-form-item>
      <el-button type="primary" style="width: 100%;" native-type="submit" :loading="loading" @click="register">注册</el-button>
      <div class="register-info"><el-button :to="{name: 'login'}" type="text" @click="gotoLogin" style="color: #409EFF;font-size: 16px;cursor:hand">
        已有账号，直接登录></el-button></div>
    </el-form>
    </div>
    <!--    提示发送确认邮件   -->
    <el-dialog
      title="提示"
      :visible="centerDialogVisible"
      width="30%"
      center :append-to-body='true' :lock-scroll="false"
    >
      <span>已发送验证邮件到您的邮箱，请前问邮箱进行身份验证。</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars

export default {
  async created () {
    await this.getSchoolName()
  },
  data: function () {
    // 判断用户名是否已经存在
    // eslint-disable-next-line no-unused-vars
    const checkUsername = (rule, value, callback) => {
      if (value !== '') {
        if (this.usernameRules()) {
          callback(new Error('用户名已存在'))
        }
        callback()
      }
    }
    return {
      loading: false,
      // 判断是否已经获取学校了
      choseSchool: true,
      // 提示邮件已发送
      centerDialogVisible: false,
      // 学校名称
      schoolName: [],
      error: '',
      registerForm: {
        username: '',
        email: '',
        // 大学选项
        schoolOptions: [],
        school: '',
        password: '',
        comparePassword: ''
      },
      registerRules: {
        username: [
          {
            type: 'string',
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            message: '用户名长度在6到12个字符之间'
          }],
        email: {
          type: 'email',
          required: true,
          message: '请输入有效的邮箱地址',
          trigger: 'blur'
        },
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
          }],
        comparePassword: {
          type: 'string',
          required: true,
          trigger: 'blur',
          validator: function (rule, value, callback) {
            console.log(this.registerForm.password)
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.registerForm.password) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          }.bind(this)
        }
      }
    }
  },
  methods: {
    // 判断id名是否已经存在
    usernameRules () {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return// 验证失败
        const { data: res } = await this.$axios.post('usernamerules?username=' + this.registerForm.username)// 访问后台
        if (res.flag === 'success') {
          this.$message.error('用户名已存在！！！')// 信息提示
        }
      })
    },
    // 点击按钮注册
    register: function () {
      // 创建用户表单
      const registerform = new FormData()
      registerform.append('username', this.registerForm.username)
      registerform.append('password', this.registerForm.password)
      registerform.append('email', this.registerForm.email)
      registerform.append('school', this.registerForm.school)
      registerform.append('campus', '')
      registerform.append('phone', '')
      registerform.append('qq', '')
      this.$refs.registerForm.validate(async valid => {
        console.log(valid)
        // 预校验通过，发起请求
        if (valid) {
          // // 提示注册成功
          // this.$message.success('注册成功!')
          // // 发起添加用户请求，1表示成功
          console.log('111')
          console.log(registerform)
          const res = await this.$axios.post('/User_insert', registerform)
          console.log(res)
          console.log('1111')
          // 判断可否注册
          if (res.data === 1) {
            // 弹窗，表明已发送验证邮件
            this.centerDialogVisible = true
            return this.$message.success('注册成功!')
          } else if (res.data === '用户名已存在') {
            return this.$message.error('用户名已存在!')
          } else if (res.data === '邮箱已存在') {
            return this.$message.error('邮箱已存在!')
          } else {
            return this.$message.error('注册失败!')
          }
        } else {
          return this.$message.error('格式错误')
        }
      }
      )
    },
    // 返回登录页面
    gotoLogin() {
      this.$router.push('/login')
    },
    // 获取学校
    async getSchoolName () {
      if (this.choseSchool) {
        // 传递查询参数
        const formData = new FormData()
        const { data: res } = await this.$axios.post('/user/school', formData)
        if (!res) {
          this.$message.error('获取信息失败')
        }
        console.log(res)
        this.registerForm.schoolOptions = res
        this.registerForm.schoolOptions.length = 2689
        this.choseSchool = false 
      }
    },
  }
}
</script>

<style lang="less" scoped>
// 容器
.register-container {
  background-image: url('../assets/image/registerBack.jpg');
  background-size: 100% 100%;
  position: fixed;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
}
// 背景图片
.backgroundPicture {
}
// 表单
.register-form {
  position: relative;
  width: 450px;
  margin-left: 540px;
  margin-top: 150px;
  background: #fff;
  padding: 20px;
  .register-info {
    text-align: right;
    font-size: 0.9rem;
    margin-top: 10px;
    color: #909399;
  }
  .register-error {
    color: #f56c6c;
  }
}
/*大学选择*/
.schoolOptions{
  position: relative;
  left: 50%;
  transform: translate(-30%,-10%);
  margin-bottom: 15px;
}
/*如果已注册账号，请点击登录*/
.register-info{
}
</style>
