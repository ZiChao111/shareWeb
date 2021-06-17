<template>
  <div class="market">
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadCrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>二手交易记录</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="mainContainer">
<!--      显示界面-->
      <el-main>
        <div>
          <div class="allCategories">上传商品记录></div>
        </div>
        <!--        商品主体-->
        <div class="tree_main"  v-for="(item, index) in postInfo" v-loading="loading">
          <!--          每件商品的卡片-->
          <el-card class="box-card-commodity">
            <!--            第一层信息，显示为卖主信息-->
            <div>
              <!--          头像-->
              <el-avatar :src="avatarSrc"></el-avatar>
              <!--          用户名-->
              <span>{{item.username+' '}}</span>
              <!--          时间-->
              <span>{{'结束时间：'+item.die_time+'   '}}</span>
<!--              商品删除-->
              <el-button type="text" icon="el-icon-delete" v-if="item.die_time > nowDate "
                         @click="deleteItem(item.thing_id)" >删除商品</el-button>
<!--              交易成功-->
              <el-button type="text" icon="el-icon-check" v-if="item.die_time < nowDate ">已删除</el-button>
            </div>
            <!--          水平分割线-->
            <hr>
            <!--            第二层信息显示为商品信息+联系方式-->
            <div class="secondAspect">
              <!--              商品图片-->
              <span class="picture_item" style="display: block;width: 50%" float="left">
                <el-image
                    style="width: 150px; height: 100px"
                    :src="itemPicture[index]"
                    :fit="fits"
                    class="itemPicture">
                </el-image>
              </span>
              <!--              文字信息-->
              <span class="information_item" style="display: block;width: 80%" float="right"
              >
                <el-card class="itemInformationCard">
                  <div class="itemInformation">
                    <span>{{'商品类别 ： '+item.type+' '}}</span>
                    <br>
                    <span>{{'商品名称 ： '+item.thing_name+' '}}</span>
                    <br>
                    <span>{{'商品价格 ： '+item.price+'¥'}}</span>
                    <br>
                    <span>{{'联系方式： '+item.phone+' '}}</span>
                    <br>
                    <span>{{'QQ ： '+item.qq+' '}}</span>
                    <br>
                    <span>{{'备注 ： '+item.remark+' '}}</span>
                  </div>
                </el-card>
              </span>
            </div>

          </el-card>
        </div>
      </el-main>
<!--      尾部界面-->
      <el-footer>
        <!--        递交二手物品-->
        <el-button class="postBtn" @click="postPage">我要发贴</el-button>
        <!--            分页栏，分页数据与queryInfo相关数据绑定-->
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="queryInfo.pageNum"
            :page-size="100"
            layout="prev, pager, next, jumper"
            :total="1000">
        </el-pagination>
      </el-footer>
    </el-container>
    <!--    发帖对话框-->
    <el-dialog
        title="商品添加"
        :visible.sync="postDialogVisible"
        width="35%"
        @close="addItemDialogClosed">
      <!--      帖子信息区域-->
      <!--      商品表单-->
      <el-form :model="addItemForm" :rules="addItemFormRule" ref="addItemFormRef" label-width="70px" class="addItemForm">
        <!--        商家用户名-->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addItemForm.username" readonly></el-input>
        </el-form-item>
        <!--   商品类别选择  -->
        <el-form-item label="物品类别">
          <el-select v-model="addItemForm.itemType" placeholder="请选择物品类别">
            <el-option label="图书" value="图书"></el-option>
            <el-option label="零食" value="零食"></el-option>
            <el-option label="衣服" value="衣服"></el-option>
            <el-option label="电子产品" value="电子产品"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <!--        商品名-->
        <el-form-item label="物品名" prop="itemName">
          <el-input v-model="addItemForm.itemName" ></el-input>
        </el-form-item>
        <!--        价格-->
        <el-form-item label="价格" prop="price">
          <el-input v-model="addItemForm.price" oninput="value=value.replace(/[^\d]/g, '')"></el-input>
        </el-form-item>
        <!--        联系电话-->
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="addItemForm.phone" ></el-input>
        </el-form-item>
        <!--        qq-->
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="addItemForm.qq" ></el-input>
        </el-form-item>
        <!--        备注-->
        <el-form-item label="备注">
          <el-input type="textarea" v-model="addItemForm.remarks"
                    maxlength="120"  show-word-limit  autosize></el-input>
        </el-form-item>
      </el-form>
      <!--      按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="postDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postItem">发 表</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
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
      nowDate: "", // 当前日期
      // 商品关键字，页数，一页个数
      queryInfo: {
        keyword: '',
        pageNum: 1,
        pageSize: 10
      },
      // 控制打开新增商品的界面
      postDialogVisible: false,
      // 添加商品表单
      addItemForm:{
        username :'111111',
        itemName :'',
        itemType :'',
        school :'',
        campus :'',
        phone :'',
        qq :'',
        price :'',
        time: '',
        remarks: '',
      },
      // 添加商品规则
      addItemFormRule:{
        //用户名规则
        itemName: {
          required: true,
          trigger: 'blur',
          min: 2,
          max: 12,
          message: '商品名称长度在2到12个字符之间'
        },
        //备注规则
        remarks: {
          required: true,
          trigger: 'blur',
          message: '备注不可为空'
        },
        // 价格规则
        price: {
          required: true,
          message: '请输入正确的价格',
          trigger: 'blur'
        },
        phone: {
          required: false,
          validator: checkMobile,
          trigger: "blur"
        }
        ,
        qq: {
          validator: checkQQNumber,
          trigger: 'blur'
        },
      },
      //上传图片绑定列表
      fileList: [],
      // 商品图片
      itemPicture:[
      ],
      // 商品图片基础信息
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      // 商品数据
      postInfo:[
      ],
      // 店家头像
      avatarSrc:'',
      // 用户id
      username:'',
      // 用户信息
      studentForm:[],
    }
  },
  created() {
    // 得到username 和 token
    this.username = window.localStorage.getItem('username')
    const token = window.sessionStorage.getItem('token')
    // 获取时间
    this.formatDate()
    // 获取学生用户信息
    this.getStudentInformation()
    // 获得商品属性
    this.getItemMes()
    // 监听bool数组元素改变
    this.$forceUpdate()
  },
  methods:{
    // 获取时间
    formatDate() {
      let date = new Date();
      let year = date.getFullYear(); // 年
      const month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
      const day = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
      let hour = date.getHours(); // 时
      hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
      let minute = date.getMinutes(); // 分
      minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
      let second = date.getSeconds(); // 秒
      second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
      this.nowDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      console.log(this.nowDate+'!!!')
    },
    async getItemPicture(itemNumber, index) {
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('itemNumber', itemNumber)
      // 与后端交互
      var that = this
      const imgData = await this.$axios.get('/getImage_thing',
          {
            params :{
              'thing_id': itemNumber
            },
            responseType: 'arraybuffer',
            headers: {
              'accesstoken': token
            }
          }
      ).then(response => {
        console.log(response)
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
            that.itemPicture[index] = data; //赋值给img标签的src属性
            console.log(this.itemPicture)
          })
    },
    // 获取学生信息(有待验证) !!!!!
    async getStudentInformation(){
      console.log("!!!!!!!!!!!!!!!")
      const token = window.sessionStorage.getItem('token')
      const data = await this.$axios.get('/get_mess',
          {
            headers: {
              'accesstoken': token
            }
          }
      )
      console.log("!!!!!!!!!!!!!!!")
      console.log(data.data)
      if(data.data.username === '')
        return this.$message.error('获取学生信息失败!')
      else {
        // 赋值
        this.studentForm = data.data
        this.addItemForm.phone = data.data.phone;
        this.addItemForm.qq = data.data.qq;
        this.addItemForm.username = data.data.username;
        console.log(this.addItemForm.qq)
      }
    },
    //得到自己的上传商品
    async getItemMes() {
      // 页面进入待刷新状态
      this.loading = true
      console.log("111")
      // 传递查询参数
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.pageNum)
      const token = window.sessionStorage.getItem('token')
      const { data: res} = await this.$axios.post('/thing_getSelf', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      if(!res){
        this.$message.error('获取信息失败')
      }
      // 得到商品数据
      this.postInfo = res
      console.log(res.length)
      console.log(this.postInfo)
      // 商品个数
      this.total = res.length
      //逐个获得商品照片
      let j = 0;
      // 获得用户图片
      let username = this.postInfo[j].username
      this.avatarSrc = await this.getUserMes(username)
      for( ;j < res.length; j++){
        let username = this.postInfo[j].username
        // // 获得商品图片
       await this.getItemPicture(this.postInfo[j].thing_id, j)
      }
      this.$forceUpdate()
      // 页面刷新成功
      this.loading = false
      this.$message.success('商品信息刷新成功')
    },
    //页面切换
    pathTo(path){
      this.$router.push({
        path: path
      })
    },
    // 监听页码值改变的事件
    async handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      await this.getItemMes()
    },
    // 发帖窗口打开
    postPage(){
      this.postDialogVisible = true
    },
    // 上传新商品,仍待完善
    async postItem(){
      this.$refs.addItemFormRef.validate(async valid =>{
        if(!valid) return
        //  发起修改用户信息请求
        // 传递查询参数
        const token = window.sessionStorage.getItem('token')
        const addItemForm1 = new FormData()
        addItemForm1.append('thing_name', this.addItemForm.itemName)
        addItemForm1.append('type', this.addItemForm.itemType)
        addItemForm1.append('price', this.addItemForm.price)
        addItemForm1.append('phone', this.addItemForm.phone)
        addItemForm1.append('qq', this.addItemForm.qq)
        addItemForm1.append('remark', this.addItemForm.remarks)
        const {data:res} = await this.$axios.post('/thing_insert',addItemForm1,{
          header: {
            'accesstoken': token
          }
        })
        console.log(res)
        if(!res) {
          return this.$message.error('商品上传失败')
        }
        //  关闭对话框，刷新列表，提示修改成功
        this.postDialogVisible = false
        await this.getItemMes()
        this.$message.success('商品上传成功!')
      })
    },
    // 关闭添加商品对话框
    addItemDialogClosed(){
      this.$refs.addItemFormRef.resetFields()
      this.addItemForm.remarks = ''
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
      console.log(result)
    },
    // 删除商品
    async deleteItem(thing_id){
      // 获取时间
      this.formatDate();
      // 传递查询参数
      const token = window.sessionStorage.getItem('token')
      const deleteForm = new FormData()
      deleteForm.append('id', thing_id)
      console.log(thing_id)
      const { data: res} = await this.$axios.post('/thing_reset', deleteForm,
          {
            headers: {
              'accesstoken': token
            }
          })
      console.log(res)
      if(res !== 1) {
        return this.$message.error('商品删除失败')
      }
      this.$message.success('商品删除成功')
      // 获得商品属性
      this.getItemMes()
    },
  },
  name: "personal_transactionRecord"
}
</script>

<style land="less" scoped>
.market{
  width: 103%;
  height: 100%;
}
.mainContainer{
  height: 100%;
  width: 100%;
}
/*面包屑导航区域*/
.breadCrumb{
  padding-bottom: 15px;
}
/*商品卡片*/
.box-card-commodity{
  margin-top: 10px;
  width: 80%;
  padding-bottom: 20px;
}
/*商品图片*/
.itemPicture{
  width: 40%;
  float: left;
  padding-right: 50px;
}
.information_item{
  width: 40%;
}
.itemInformation{
  width: 40%
}

</style>
