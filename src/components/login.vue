<template>
  <div class="login_container"> 
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/image/cat.jpg" alt="">
      </div>
      <!-- 登陆界面 -->
      <el-form ref="loginFormRef" :model="User" :rules="loginFormRules"  class="login_form">
        <!--用户名-->
        <el-form-item  prop="username" label="用户名:">
          <el-input v-model="User.username" prefix-icon="iconfont icon-user" style="width: 300px"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item  prop="password" label="密码：">
          <el-input v-model="User.password" prefix-icon="iconfont icon-3702mima" type="password" prop="" style="width: 300px"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="loginButton">
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
        <div class="registerButton">
          没有账号?<el-button type="text" @click="gotoRegister" style="font-size:18px">注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      User: {
        username: '',
        password: ''
      },

      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      let formdata = new FormData()
      formdata.append('username', this.User.username)
      formdata.append('password', this.User.password)
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return this.$message.error('格式错误')
        const res = await this.$axios.post(`/User_login`, formdata)
        var re = res.data
        console.log(res)
        if (re.sucess !== 'yes') return this.$message.error('账户或密码错误')
        this.$message.success('登陆成功')
        // 1. 登录成功之后将token保存在客户端的 sessionStorage
        //  1.1项目中除了登陆之外的其他API接口，必须在登陆之后才能访问
        //  1.2token只应在当前网站打开期间生效，多以将token保存在sessionStorage
        // 2.通过编程式导航导入后端，路由地址是‘/home’
        window.sessionStorage.setItem('token', re.token)
        window.localStorage.setItem('username', this.User.username)
        this.$router.push('/home')
      })
    },
    gotoRegister () {
      this.$router.push('/register')
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  height: 100%;
  background-color: #f6f9fa;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #f6f9fa;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 120px;
    width: 120px;
    border: 1px solid #f6f9fa;
    border-radius: 50%;
    padding: 6px;
    box-shadow: 0 0 10px #f6f9fa;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #f6f9fa;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #f6f9fa
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .loginButton {
    display: flex;
    justify-content: flex-end;
  }
  .registerButton {
    padding-left: 150px;
  }
}
</style>
