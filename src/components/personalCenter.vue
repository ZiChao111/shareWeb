<template>
  <el-container class="personalCenter_container">
<!--    头部区域-->
    <el-header class="personalCenter_header">
      <div class="mainContent">
        <span>个人中心</span>
      </div>
      <div>
        <el-button type="info" @click="pathTo('/home')">主页</el-button>
        <el-button type="info" @click="quit()">账号退出</el-button>
      </div>
    </el-header>
<!--    页面主体区域-->
    <el-container>
<!--    侧边栏区域菜单页面-->
      <el-aside width="isCollapse ? '64px': '200px" class="personalCenter_aside">
        <div class="toggle-button" @click="toggleCollapseButton">|||</div>
<!--        侧边栏菜单-->
        <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409BFF"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            class="personalCenter_menu"
            :default-active="activePath"
            :router="true"
            >
<!--          一级菜单第一项模板区域-->
          <el-menu-item :index="'/personal_information'" @click="saveNavState('/personal_information')" >
<!--            图标-->
            <i class="el-icon-user"></i>
<!--            文本-->
            <span slot="title">个人信息</span>
          </el-menu-item>
          <el-menu-item :index="'/personal_treeHole'" @click="saveNavState('/personal_treeHole')">
            <i class="el-icon-reading"></i>
            <span slot="title">历史树洞</span>
          </el-menu-item>
          <el-menu-item :index="'/personal_transactionRecord'" @click="saveNavState('/personal_transactionRecord')">
            <i class="el-icon-shopping-bag-2"></i>
            <span slot="title">交易收藏</span>
          </el-menu-item>
          <el-menu-item :index="'/personal_lostAndFoundRecord'" @click="saveNavState('/personal_lostAndFoundRecord')">
            <i class="el-icon-s-claim"></i>
            <span slot="title">失物招领记录</span>
          </el-menu-item>
          <el-menu-item :index="'/personal_organizeTeams'" @click="saveNavState('/personal_organizeTeams')">
            <i class="el-icon-s-order"></i>
            <span slot="title">组队记录</span>
          </el-menu-item>
          <el-menu-item :index="'/personal_partimejob'" @click="saveNavState('/personal_partimejob')">
            <i class="el-icon-s-order"></i>
            <span slot="title">兼职记录</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
<!--    右侧主体区域-->
      <el-main>
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return {
      //折叠判断
      isCollapse: false,
      //  被激活的链接地址
      activePath:'',
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击按钮,切换菜单的折叠和展开
    toggleCollapseButton(){
      this.isCollapse =! this.isCollapse
    },
    pathTo(path){
      this.$router.push({
        path: path
      })
    },
    // 保存连接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    
    quit() {
      window.sessionStorage.clear()
      this.$router.push('/home')
    }
  },
  name: "personalCenter",
}
</script>

<style land="less" scoped>
.personalCenter_container{
  height: 100%;
  position:absolute;
  top:0;
  right:0;
  bottom:10px;
  left:0;
}
.personalCenter_header {
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-content: center;
  padding-top: 10px;
  color: #ffffff;
  font-size: 20px;
  padding-bottom: 10px;
}
.personalCenter_aside {
  background-color: #333744;
}
.personalCenter_menu {
  border-right: 0;
}
.el-main{
  background-color: #EAEDF1;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
