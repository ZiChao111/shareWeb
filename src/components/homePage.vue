<template>
  <div class="home_2">
    <!--    头-->
    <div class="home_2_head">
      <div class="home_1_head_title">
        <span>Gravel Net ——大学生校园互助平台</span>
      </div>
      <div class="home_1_head_person" v-if="username !== ''">
        <el-row >
          <el-col span="8">
            <div @click="to_person()">
              <el-avatar :src="avatarSrc" fit="cover"></el-avatar>
            </div>
          </el-col>
          <el-col span="4">
            <el-button class="el-button" @click="quit()">
              账号退出
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="login" v-if="username === ''">
        <div class="home_1_head_register">
          <el-button class="el-button" @click="to_register">注册</el-button>
        </div>
        <div class="home_1_head_login">
          <el-button class="el-button" @click="to_login">登陆</el-button>
        </div>
      </div>
      <div class="home_1_head_HasLogin" v-if="username !== ''" style="float: right; margin-right: 20px">
        <span class="welcome" >
          欢迎您！{{username}}
        </span>
      </div>
    </div>
    <!--    主体-->
    <div class="home_2_main">
      <!--      第一行-->
      <div class="home_main_div_1" @click="pathto('treehole')">
        <a class="home_2_a_treeHole a">
          <img src="../assets/image/treeHole.jpeg" class="home_2_main_img">
          <div class="home_2_main_treeHole">
            树洞
          </div>
        </a>
      </div>
      <!--第二行-->
      <div class="home_main_div_1">
        <a class="home_2_a_market a" @click="pathto('market')">
          <img src="../assets/image/change.jpg" class="home_2_main_img_market">
          <div class="home_2_main_market">二手市场</div>
        </a>
        <a class="home_2_a_lostandfind a" @click="pathto('laf')">
          <img src="../assets/image/lostandfind.jpeg" class="home_2_main_img_market">
          <div class="home_2_main_market">失物招领</div>
        </a>
      </div>
      <!--第三行-->
      <div class="home_main_div_1" >
        <a class="home_2_a_help a" @click="pathto('aid')">
          <img src="../assets/image/help.png" class="home_2_main_img_help">
          <div class="home_2_main_market">互助平台</div>
        </a>
        <a class="home_2_a_parttome_job a" @click="pathto('job')">
          <img src="../assets/image/part_time_job.jpeg" class="home_2_main_img_market">
          <div class="home_2_main_market">兼职信息</div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "homePage",
  data: {
    username: '',
    avatarSrc: ''
  },
  async created() {
    this.username = window.localStorage.getItem('username')
    this.avatarSrc = await this.getAvatarSrc(this.username)
    this.$forceUpdate()
  },
  methods: {
    to_person(){
      this.$router.push('/personalCenter')
    },
    to_register(){
      this.$router.push('/register')
    },
    to_login(){
      this.$router.push('/')
    },
    pathto(path) {
      this.$router.push('/'+path)
    },
    quit() {
      window.sessionStorage.clear()
      this.username = ''
      this.$forceUpdate()
    },
    async getAvatarSrc(name) {
      var result
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('username', name)
      const imgData = await this.$axios.get('/getImage_user',
          {
            responseType: 'arraybuffer',
            headers: {
              'accesstoken': token
            },
            params: {
              username: name
            }
          }
      ).then(response => {
        return (
            "data:image/png;base64," +
            btoa(
                new Uint8Array(response.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                )
            )
        );
      })
          .then(data => {
            result = data
          })
      return result
    }
  }
}
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.home_2 {
  width: 100%;
  height: 1000px;
}
.welcome{
  display: inline-block;
  font-size: 20px;
}
.home_2_head {
  width: 100%;
  height: 80px;
}
.home_1_head_title{
  font-size: 20px;
  height: 100%;
  width: 500px;
  display: inline-block;
  float: left;
}
.home_1_head_login {
  height: 100%;
  width: 100px;
  display: inline-block;
  float: right;
}
.home_1_head_register {
  height: 100%;
  width: 100px;
  display: inline-block;
  float: right;
}
.home_1_head_person {
  height: 100%;
  width: 200px;
  display: inline-block;
  float: right;
}
.home_2_main {
  margin: 50px auto;
  width: 1000px;
  height: 800px;
}
a:hover{
  background-color: #BFAB86;
}

.home_main_div_1 {
  width: 100%;
  height: 280px;
}
.home_2_a_treeHole {
  display: block;
  float: left;
  width: 240px;
  height: 240px;
  margin-left: 370px;
  margin-top: 20px;
  box-shadow: 5px 3px 20px grey;
  border-radius: 120px;
}
.home_2_main_img {
  display: inline-block;
  width: 100px;
  float: left;
  margin-top: 35px;
  margin-left: 70px;
}
.home_2_main_treeHole {
  display: inline-block;
  width: 220px;
  height: 50px;
  float: left;
  margin-top: 20px;
  font-family: STCaiyun;
  font-size: 50px;
  text-align: center;
  padding-left: 18px;
}

.home_2_a_market {
  display: inline-block;
  float: left;
  width: 240px;
  height: 220px;
  border-radius: 120px;
  box-shadow: 5px 3px 20px grey;
  margin-left: 100px;
  padding-top: 20px;
}
.home_2_main_img_market {
  display: inline-block;
  width: 100px;
  padding-left: 70px;
  padding-top: 18px;
}
.home_2_main_market {
  display: inline-block;
  width: 220px;
  height: 50px;
  float: left;
  margin-top: 18px;
  font-family: STCaiyun;
  font-size: 40px;
  text-align: center;
  padding-left: 16px;
}
.home_2_a_lostandfind {
  display: inline-block;
  float: right;
  width: 240px;
  height: 220px;
  border-radius: 120px;
  box-shadow: 5px 3px 20px grey;
  margin-right: 100px;
  padding-top: 20px;
}
.home_2_a_help {
  display: inline-block;
  float: left;
  width: 240px;
  height: 240px;
  border-radius: 120px;
  box-shadow: 5px 3px 20px grey;
  margin-left: 180px;
  margin-top: 45px;
}
.home_2_main_img_help {
  display: inline-block;
  width: 100px;
  height: 100px;
  padding-left: 70px;
  padding-top: 30px;
}

.home_2_a_parttome_job {
  display: inline-block;
  float: right;
  width: 240px;
  height: 240px;
  border-radius: 120px;
  box-shadow: 5px 3px 20px grey;
  margin-right: 180px;
  margin-top: 45px;
}
</style>
