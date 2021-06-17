<template>
<div class="managerCenter">
<!--  主容器-->
  <el-container class="managerCenterContainer">
<!--    头部区域-->
    <el-header class="header">
      <div class="mainContent">
        <span style="padding-left: 30px"> 管理员界面</span>
      </div>
      <div>
        <el-button type="info" @click="gotoLogin">账号退出</el-button>
      </div>
    </el-header>
<!--    主体区域-->
    <el-container>
      <!--    侧边栏区域菜单页面-->
      <el-aside width="isCollapse ? '64px': '200px" class="aside">
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
          <el-menu-item :index="'/managerCenter_userInformation'" @click="saveNavState('/managerCenter_userInformation')">
            <i class="el-icon-s-custom"></i>
            <span slot="title">用户信息</span>
          </el-menu-item>
          <el-menu-item :index="'/managerCenter_treeHolePost'" @click="saveNavState('/managerCenter_treeHolePost')">
            <i class="el-icon-reading"></i>
            <span slot="title">树洞帖子</span>
          </el-menu-item>
          <el-menu-item :index="'/managerCenter_transactionRecord'" @click="saveNavState('/managerCenter_transactionRecord')">
            <i class="el-icon-shopping-bag-2"></i>
            <span slot="title">交易商品</span>
          </el-menu-item>
          <el-menu-item :index="'/managerCenter_lostAndFoundRecord'" @click="saveNavState('/managerCenter_lostAndFoundRecord')">
            <i class="el-icon-s-claim"></i>
            <span slot="title">失物招领</span>
          </el-menu-item>
          <el-menu-item :index="'/managerCenter_organizeTeams'" @click="saveNavState('/managerCenter_organizeTeams')">
            <i class="el-icon-s-order"></i>
            <span slot="title">组队记录</span>
          </el-menu-item>
          <el-menu-item :index="'/managerCenter_job'" @click="saveNavState('/managerCenter_job')">
            <i class="el-icon-mobile"></i>
            <span slot="title">兼职信息</span>
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
</div>
</template>
<script>
export default {
  // 变量
  data () {
    return {
      // 折叠判断
      isCollapse: false,
      //  被激活的链接地址
      activePath: '/managerCenter_userInformation'
    }
  },
  // 生命周期函数
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  // 方法
  methods: {
    // 点击按钮,切换菜单的折叠和展开
    toggleCollapseButton () {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    // 返回主页
    gotoLogin () {
      this.$router.push('/managerLogin')
    }
  }
}
</script>
<style land="less" scoped>
.managerCenter{
  width: 100%;
  height: 100%;
}
.managerCenterContainer{
  height: 100%;
  position:absolute;
  top:0;
  right:0;
  bottom:10px;
  left:0;
}
.header{
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
.aside{
  background-color: #333744;
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
