<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/image/cat.jpg" alt="">
      </div>
      <!-- 登陆界面 -->
      <el-form ref="loginFormRef" :model="manager" :rules="loginFormRules" label-width="0%" class="login_form" prop="">
        <!--用户名-->
        <el-form-item  prop="username">
          <el-input v-model="manager.username" prefix-icon="iconfont icon-user" clearable></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item  prop="password">
          <el-input v-model="manager.password" prefix-icon="iconfont icon-3702mima" type="password" prop="" clearable></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="managerLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'managerLogin',
  data () {
    return {
      // 用户id
      manager: {
        username: 'admin',
        password: '2528964721'
      },
      // 登录规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    managerLogin () {
      const formData = new FormData()
      formData.append('username', this.manager.username)
      formData.append('password', this.manager.password)
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return this.$message.error('格式错误')
        const res = await this.$axios.post('/manager/login', formData)
        const re = res.data
        console.log(res)
        if (re.sucess !== 'yes') return this.$message.error('账户或密码错误')
        this.$message.success('登陆成功')
        // 1. 登录成功之后将token保存在客户端的 sessionStorage
        //  1.1项目中除了登陆之外的其他API接口，必须在登陆之后才能访问
        //  1.2token只应在当前网站打开期间生效，多以将token保存在sessionStorage
        // 2.通过编程式导航导入后端，路由地址是‘/home’
        window.sessionStorage.setItem('token', re.token)
        this.$router.push('/managerCenter')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  height: 400px;
  width: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
