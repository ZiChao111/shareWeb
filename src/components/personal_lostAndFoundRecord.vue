<template>
  <div class="lostAndFound" >
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadCrumb" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>失物招领记录</el-breadcrumb-item>
    </el-breadcrumb>

    <el-container >
      <span style="display: block;height: 100%;width: 1100px">
        <el-container>
<!--          头部-->
        <el-header class="el-header">
          <span class="home_head_span">
            <el-menu
                :default-active="this.$route.path"
                :router="true"
                mode="horizontal"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
              <el-menu-item index="/personal_lost" class="lostandfound_head_item">失物招领</el-menu-item>
              <el-menu-item index="/personal_find" class="lostandfound_head_item">物归原主</el-menu-item>
            </el-menu>
          </span>
        </el-header>
        <el-main>
          <!--        类型选择-->
        <div>
          <lost-module v-bind:post-info="lostPostInfo"
                       v-bind:img-src="picture"
                       v-bind:avator-src="avatorSrc"
                       v-bind:username="username"
                       v-if="this.$route.path === '/personal_lost'"></lost-module>
          <find-module v-bind:post-info="findPostInfo"
                       v-bind:img-src="picture"
                       v-bind:avator-src="avatorSrc"
                       v-if="this.$route.path === '/personal_find'"></find-module>
        </div>
        </el-main>
      </el-container>
      </span>

    </el-container>
  </div>
</template>

<script>
import findModule from "@/components/personalFindModule";
import lostModule from "@/components/personalLostModule";
export default {
  components: {"find-module": findModule, "lost-module" : lostModule},
  data(){
    return{
      username: '',
      lostPostInfo: [],
      findPostInfo: [],
      picture: [],
      avatorSrc:''
    }

  },
  async created() {
    this.username = window.localStorage.getItem('username')
    this.avatorSrc = await this.getUserAvator(this.username)
    await this.getLostList()
    await this.getFindList()
  },
  methods: {
    // 页面切换
    pathTo(path){
      this.$router.push({
        path: path
      })
    },
    async getUserAvator(name) {
      var result
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('username', this.username)
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
    },
    async getItemImg(id) {
      var result = 0
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('item_id', id)
      const imgData = await this.$axios.get('/getImage_item',
          {
            responseType: 'arraybuffer',
            headers: {
              'accesstoken': token
            },
            params: {
              item_id: id
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
      if(result === "data:image/png;base64,") return false;
      return result
    },
    async getLostList() {
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('getorlose', 1)
      formData.append('username', this.username)
      const {data: res} = await this.$axios.post('item/getSelf', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      var i = 0;
      for(; i < res.length; i++){
        const result = await this.getItemImg(res[i].item_id)
        if(result === false) continue
        else this.picture[i] = result
      }
      console.log(this.picture)
      this.lostPostInfo = res;
    },
    async getFindList() {
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('getorlose', 0)
      formData.append('username', this.username)
      const {data: res} = await this.$axios.post('item/getSelf', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      var i = 0;
      for(; i < res.length; i++){
        var result = await this.getItemImg(res[i].item_id)
        if(result === false) continue
        else this.picture[i] = result
      }
      console.log(this.picture)
      this.findPostInfo = res
    }
  }
}
</script>

<style scoped>
.el-aside {
  background-color: white;
}
.el-header {
  background-color: #545c64;
}
.home_head_span {
  position: absolute;
  left: 500px;
}
.lostandfound_head_item {
  height: 58px;
  width: 200px;
  text-align: center;
}
</style>
