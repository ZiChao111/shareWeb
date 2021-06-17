<template>
  <div class="market" >
    <!--    回到顶部-->
    <el-backtop :bottom="100">
      <div class="top">Top</div>
    </el-backtop>
    <!--    布局容器-->
    <el-container class="marketMainContainer">
      <!--      头部区域-->
      <el-header class="mutualAidHeader">
        <!--        标题-->
       <div class="mutualAid_img">
         <img src="../assets/image/help.png" style="display: inline-block;height: 100px;width: 100px" class="mutualAid_img_img">
       </div>
        <!--        搜索区域-->
        <div class="searchInput">
          <el-input v-model="queryInfo.keyword" prefix-icon="el-icon-search" placeholder="请输入要搜索的组队信息">
            <el-button slot="append" icon="el-icon-search" @click="searchItem">搜索</el-button>
          </el-input>
        </div>
        <!--        按钮区域-->
        <span  class="mutualAid">
           <el-button type="text" @click="pathTo('/home')">返回主页</el-button>
           <el-button type="text" @click="pathTo('/personal_information')">个人中心</el-button>
           <el-button type="text">账号退出</el-button>
        </span>

      </el-header>
      <!--      页面主体区域-->
      <el-main class="el-main">
        <!--    回到顶部(存在问题)-->
        <el-backtop :bottom="100">
          <div class="top">Top</div>
        </el-backtop>
<!--        第一层卡片，筛选-->
        <div class="firstCard">
<!--          标题-->
          <div style="padding-bottom: 15px">
            <div class="allCategories">队伍信息筛选></div>
<!--            筛选条件-->
          </div>
          <!--          分类卡片区域-->
          <el-card class="sortedCard">
            <!--            范围限制-->
            <div>
              <a>范围 ：</a>
              <el-radio-group v-model="range" @change="rangeChange">
                <el-radio  label="1">本校</el-radio>
                <el-radio  label="0">全部</el-radio>
              </el-radio-group>
            </div>
            <!--            水平分界线-->
            <el-divider></el-divider>
<!--            队伍类别筛选-->
            <div>
              <a>类别选择 : </a>
              <el-radio-group v-model="teamCategory"@change="rangeChange">
                <el-radio :label="''">全部</el-radio>
                <el-radio :label="'组队比赛'">组队比赛</el-radio>
                <el-radio :label="'聚会K歌'">聚会K歌</el-radio>
                <el-radio :label="'拼车'">拼车</el-radio>
                <el-radio :label="'社团招新'">社团招新</el-radio>
                <el-radio :label="'寻求帮助'">寻求帮助</el-radio>
                <el-radio :label="'其它'">其它</el-radio>
              </el-radio-group>
            </div>
          </el-card>
        </div>
<!--        第二层组队信息-->
        <div class="secondCard">
<!--          第二层卡片 队伍信息-->
          <el-card class="teamInformation" >
            <el-row>
              <el-col :span="5" v-for="(item, index) in teamInfo"  :offset="1" class="teamCol">
                <el-card  class="teamItem" shadow="hover" style="width: 230px;height: 426px;">
                  <div style="height: 330px;">
                    <!--          头像-->
                    <el-avatar :src="avatarSrc[index]"></el-avatar>
                    <br>
                    <span>{{'发起人： '+item.sponsor+' '}}</span>
                    <br>
                    <span>{{'标题： '+item.title+'   '}}</span>
                    <br>
                    <span>{{'队伍类别： '+item.teamType+' '}}</span>
                    <br>
                    <span>{{'学校： '+item.school+'   '}}</span>
                    <br>
                    <span>{{'人数要求： '+item.number+'   '}}</span>
                    <br>
                    <span>{{'联系方式： '+item.phone+' '}}</span>
                    <br>
                    <span>{{'QQ ： '+item.qq+' '}}</span>
                    <br>备注：
                    <el-input
                        type="textarea"
                        :rows="5"
                        v-model="item.remark"
                        readonly>
                    </el-input>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-main>
      <!--      底部区域-->
      <el-footer class="el-footer">
        <!--        弹出发起组队窗口-->
        <el-button class="teamUpButton" @click="teamUp">发起组队</el-button>
        <!--            分页栏，分页数据与queryInfo相关数据绑定-->
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="queryInfo.pageNum"
            :page-sizes="[10]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </el-footer>
    </el-container>
    <!--    发帖对话框-->
    <el-dialog
        title="组队发起"
        :visible.sync="postDialogVisible"
        width="35%"
        @close="teamUpDialogClosed"
        class="teamUpDialog">
      <!--      帖子信息区域-->
      <!--      组队表单-->
      <el-form :model="teamUpForm" :rules="teamUpFormRule" ref="teamUpFormRef" label-width="70px" class="teamUpForm">
        <!--        队伍名-->
        <el-form-item label="标题" prop="title">
          <el-input v-model="teamUpForm.title" ></el-input>
        </el-form-item>
        <!--        发起人或者单位-->
        <el-form-item label="发起人/单位" prop="sponsor" label-width="100px">
          <el-input v-model="teamUpForm.sponsor" ></el-input>
        </el-form-item>
        <!--   组队类别选择  -->
        <el-form-item label="组队类别" prop="itemType">
          <el-select v-model="teamUpForm.teamType" placeholder="请选择队伍类别">
            <el-option label="组队比赛" value="组队比赛"></el-option>
            <el-option label="聚会happy" value="聚会happy"></el-option>
            <el-option label="团购" value="团购"></el-option>
            <el-option label="拼车" value="拼车"></el-option>
            <el-option label="寻求帮助" value="寻求帮助"></el-option>
            <el-option label="社团招新" value="社团招新"></el-option>
            <el-option label="其它" value="其它"></el-option>
          </el-select>
        </el-form-item>
        <!--        人数要求-->
        <el-form-item label="人数要求" prop="number">
          <el-input-number v-model="teamUpForm.number" controls-position="right"  :min="2" :max="100"></el-input-number>
        </el-form-item>
        <!--        联系电话-->
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="teamUpForm.phone" ></el-input>
        </el-form-item>
        <!--        qq-->
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="teamUpForm.qq" ></el-input>
        </el-form-item>
        <!--        备注-->
        <el-form-item label="备注">
          <el-input type="textarea" v-model="teamUpForm.remarks"
                    maxlength="120"  show-word-limit  autosize></el-input>
        </el-form-item>

      </el-form>
      <!--      按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="postDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postTeamUp">发 表</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 变量，数据
  data() {
    // 验证手机号的规则
    let checkMobile = (rule,value,cb)=>{
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (regMobile.test(value) || value === ''){
        //  合法的手机号
        return cb()
      }
      cb(new Error('请输入正确的手机号'))
    }
    // 验证QQ号的规则
    let checkQQNumber = (rule,value,cb)=>{
      const regQQ =  /^[0-9]{5,12}$/
      if (regQQ.test(value) || value === ''){
        //  合法的QQ号
        return cb()
      }
      cb(new Error('请输入正确的QQ号'))
    }
    return {
      // 组队关键字，页数，一页个数
      queryInfo: {
        keyword: '',
        pageNum: 1,
        pageSize: 16
      },
      // 范围选择， 1仅为本校，0表示全部
      range: '0',
      // 类别选择,是否全选
      selectAll: true,
      // 已选组队类别
      teamCategory: '',
      // 当前页面队伍信息
      teamInfo:[
      ],
      // 队伍信息页面加载
      loading: false,
      // 发起组队的弹窗控件
      postDialogVisible: false,
      // 发起组队表单
      teamUpForm:{
        title:'',
        sponsor:'',
        username:'',
        teamType:'其他',
        number:'2',
        phone :'',
        qq :'',
        remarks:'',
        school:'',
      },
      // 用户头像
      avatarSrc:[

      ],
      // 发起组队表单规则
      teamUpFormRule:{
        //标题规则
        title: {
          required: true,
          trigger: 'blur',
          min: 2,
          max: 12,
          message: '标题长度在2到12个字符之间'
        },
        //发起人/单位规则
        sponsor: {
          required: true,
          trigger: 'blur',
          min: 2,
          max: 12,
          message: '发起人/单元长度在2到12个字符之间'
        },
        // 队伍类型规则
        teamType: {
          trigger: "blur",
          required: true
        },
        phone: {
          required: false,
          validator: checkMobile,
          trigger: "blur"
        },
        qq: {
          validator: checkQQNumber,
          trigger: 'blur'
        },
    },
  }
  },
  // 生命周期函数
  created() {
    // 得到队伍信息
    this.getTeamMes()
    // 获得学生信息
    this.getStudentInformation()
    // 监听bool数组元素改变
    this.$forceUpdate()
  },
  // 函数
  methods:{
    // 页面切换
    pathTo(path){
      this.$router.push({
        path: path
      })
    },
    // 得到组队内容
    async getTeamMes() {
      // 页面进入待刷新状态
      this.loading = true
      console.log("111")
      // 传递查询参数
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.pageNum)
      formData.append('keywords', this.queryInfo.keyword)
      formData.append('teamType', this.teamCategory)
      formData.append('inschool', this.range)
      console.log(this.teamCategory)
      const token = window.sessionStorage.getItem('token')
      const { data: res} = await this.$axios.post('/team_get', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      console.log(res)
      if(!res){
        this.$message.error('获取信息失败')
      }
      // 得到商品数据
      this.teamInfo = res
      console.log(res.length)
      console.log(this.teamInfo)
      // 商品个数
      this.total = res.length
      //逐个获得商品照片
      let j = 0;
      for( ;j < res.length; j++){
        let username = this.teamInfo[j].username
        // 获得用户头像
        this.avatarSrc[j] = await this.getUserMes(username)
      }
      // 页面刷新成功
      this.loading =false
      this.$message.success('获取组队信息成功')
      this.$forceUpdate()
    },
    //搜索内容,并刷新商品,并且改变类别
    async searchItem(){
      // 刷新组队
      await this.getTeamMes()
    },
    //根据用户名获取头像并赋值给对应的变量
    async getUserMes(name) {
      let result
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
    },
    // 获取学生信息(有待验证) !!!!!
    async getStudentInformation(){
      const token = window.sessionStorage.getItem('token')
      const data = await this.$axios.get('/get_mess',
          {
            headers: {
              'accesstoken': token
            }
          }
      )
      if(data.data.username === '')
        return this.$message.error('获取学生信息失败!')
      else {
        // 赋值
        this.teamUpForm.phone = data.data.phone;
        this.teamUpForm.qq = data.data.qq;
        this.teamUpForm.username = data.data.username;
        this.teamUpForm.sponsor = data.data.username;
        this.teamUpForm.school = data.data.school;
      }
    },
    //  范围改变,改变查找范围
    async rangeChange(){
      // 刷新组队显示页面
      await this.getTeamMes()
    },
    // 监听页码值改变的事件
    async handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      await this.getTeamMes()
    },
    // 弹出发起组队窗口
    teamUp(){
      this.postDialogVisible =true
    },
    // 发出新组队
    async postTeamUp(){
      this.$refs.teamUpFormRef.validate(async valid =>{
        if(!valid) return
        // 传递查询参数
        const token = window.sessionStorage.getItem('token')
        const addTeamForm = new FormData()
        addTeamForm.append('title', this.teamUpForm.title)
        addTeamForm.append('sponsor', this.teamUpForm.sponsor)
        addTeamForm.append('qq', this.teamUpForm.qq)
        addTeamForm.append('phone', this.teamUpForm.phone)
        addTeamForm.append('remarks', this.teamUpForm.remarks)
        addTeamForm.append('number', this.teamUpForm.number)
        addTeamForm.append('school', this.teamUpForm.school)
        addTeamForm.append('teamType', this.teamUpForm.teamType)
        const {data:res} = await this.$axios.post('/team_insert',addTeamForm,{
          header: {
            'accesstoken': token
          }
        })
        console.log(res)
        if(!res) {
          return this.$message.error('组队发起失败')
        }
        //  关闭对话框，刷新列表，提示修改成功
        this.postDialogVisible = false
        await this.getTeamMes()
        this.$message.success('组队发起成功!')
      })
    },
    // 关闭发起组队弹窗
    teamUpDialogClosed(){
      this.$refs.teamUpFormRef.resetFields()
      this.teamUpForm.remarks = ''
    },

  },
  name: "mutualAid"
}
</script>

<style land="less" scoped>
/*总体*/
.market{
  height: 100%;
}
/*总体容器*/
.marketMainContainer{
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
}
/*头部区域*/
.mutualAidHeader {
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 150px !important;
}
/*图标区域*/
.mutualAid_img {
  display: inline-block;
  height: 150px;
  width: 120px;
  float: left;
  margin-left: 200px;
}
/*图标区域图标修改*/
.mutualAid_img_img {
  margin-top: 20px;
}
/*搜索栏*/
.searchInput{
  display: inline-block;
  float: left;
  margin-top: 4px;
  height: 35px;
  width: 35%;
  padding-bottom: 5px;
  margin-left: 10px;
}
/*个人中心*/
.mutualAid {
  float: top;
  width:270px;
  font-weight:bold;
  padding-bottom: 90px;
}
.el-main {
  background-color: #f5f5f5;
}
/*第一层卡片（条件筛选）*/
.firstCard{
  padding-top: 20px;
  width: 70%;
  padding-left: 200px;
}
/*第二层卡片（区域）*/
.secondCard{
  /*padding-top: 15px;*/
  width: 70%;
  padding-left: 200px;
  border-radius: 10px;
  line-height: 30px;
  margin-top: 10px;
}
/*单个队伍信息*/
.teamItem{
  margin-left: -46px;
  height: 380px;
}
.teamItem:hover{
  background-color: #DCDCDC;
}
/*行*/
.teamCol{
  margin-bottom: 13px;
}
/*底部*/
.el-footer {
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/*发起组队对话框*/
.teamUpDialog{
  width: 100%;
}
/*发起组队按钮*/
.teamUpButton {
  margin-left: 100px;
}
/* 测试*/

</style>