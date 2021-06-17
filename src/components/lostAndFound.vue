<template>
  <div style="height: auto;background-color: #f5f5f5">
    <el-container style="height: 100%">

      <el-aside width="200px" class="el-aside"></el-aside>
      <span style="display: block;height: 100%;width: 1100px">
        <el-container style="height: 100%">
<!--          头部-->
             <span style="display:inline-block; width:270px; font-weight:bold; float:right" class="tree_head_span_search">
           <el-button type="text" @click="pathTo('/home')">返回主页</el-button>
           <el-button type="text" @click="pathTo('/personal_information')">个人中心</el-button>
           <el-button type="text" @click="quit()">账号退出</el-button>
        </span>

        <el-header class="el-header">
<!--          图片-->
          <div class="tupian">
            <img src="../assets/image/lostandfind.jpeg" class="tupian_img">
          </div>
          <span class="home_head_span">
            <el-menu
                :default-active="this.$route.path"
                :router="true"
                mode="horizontal"
                background-color="#f5f5f5"
                text-color="green"
                active-text-color="#ffd04b">
              <el-menu-item index="/lost" class="lostAndFound_head_item"
                            @click="turnToLost">失物招领</el-menu-item>
              <el-menu-item index="/find" class="lostAndFound_head_item"
                            @click="turnToFind">物归原主</el-menu-item>
            </el-menu>
          </span>

        </el-header>
        <el-main>
          <div class="searchInput">
          <el-input v-model="queryInfo.keyword" prefix-icon="el-icon-search" placeholder="请输入要搜索的物品">
            <el-button slot="append" icon="el-icon-search" @click="searchItem">搜索</el-button>
          </el-input>
        </div>
          <!--        类型选择-->
        <div >
          <div>
            <div class="allCategories">所有分类></div>
          </div>
          <!--          分类卡片区域-->
          <el-card class="box-card-sort">
            <!--            类别选择-->
            <div>
              <a>类别选择 : </a>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="itemCategory" @change="selectItemChange" :max="1">
                <el-checkbox v-for="category in categories" :label="category" :key="category">{{category}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-card>
          <div>
            <lost-module v-bind:post-info="lostPostInfo"
                         v-bind:img-src="picture"
                         v-bind:avator-src="avatorSrc"
                         v-if="this.$route.path === '/lost'"></lost-module>
          <find-module v-bind:post-info="findPostInfo"
                       v-bind:img-src="picture"
                       v-bind:avator-src="avatorSrc"
                       v-if="this.$route.path === '/find'"></find-module>
          </div>
        </div>
        </el-main>
          <!--          尾部-->
        <el-footer class="el-footer">
          <el-button @click="lost">寻物发帖</el-button>
          <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="queryInfo.page_num"
              :page-size="10"
              layout="prev, pager, next, jumper"
              :total="total">
          </el-pagination>
          <el-button @click="found">寻主发帖</el-button>
        </el-footer>
      </el-container>
      </span>

    </el-container>
    <el-dialog
        :title="flag+'物品添加'"
        :visible.sync="postDialogVisible"
        width="35%"
        @close="addItemDialogClosed">
      <!--      帖子信息区域-->
      <!--      商品表单-->
      <el-form :model="addItemForm" :rules="addItemFormRule" ref="addItemFormRef" label-width="70px" class="addItemForm">
        <!--   商品类别选择  -->
        <el-form-item label="物品类别">
          <el-select v-model="addItemForm.symbol" placeholder="请选择物品类别">
            <el-option :label="item" :value="item" v-for="item in categories"></el-option>
          </el-select>
        </el-form-item>
        <!--        物品名称-->
        <el-form-item label="物体名称">
          <el-input v-model="addItemForm.item_name"></el-input>
        </el-form-item>
        <!--        联系电话-->
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="addItemForm.connect_phone" ></el-input>
        </el-form-item>
        <!--        联系人-->
        <el-form-item label="联系人">
          <el-input v-model="addItemForm.connect_peo"></el-input>
        </el-form-item>
        <!--        校区信息-->
        <el-form-item label="校区">
          <el-input v-model="addItemForm.tell_campus"></el-input>
        </el-form-item>
        <!--        备注-->
        <el-form-item label="备注">
          <el-input type="textarea" v-model="addItemForm.instruction"
                    maxlength="120"  show-word-limit  autosize></el-input>
        </el-form-item>
        <!--        上传图片使用-->
        <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :http-request="uploadImgType1"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :on-success="successUpload"
            :auto-upload="false"
            :limit="1">
          <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
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
import lostModule from "@/components/lostModule";
import FindModule from "@/components/findModule";
const categoryOption = ['证件文书', '电子产品', '生活物品', '学习相关', '其他'];
export default {
  name: "lostAndFound",
  components: {"find-module": FindModule, "lost-module" :lostModule},
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
    return {
      isClientCertFile: true,
      //条目总数
      total: 1,
      // 范围选择， 1仅为本校，2表示全部
      range: '1',
      // 类别选择,是否全选
      selectAll: true,
      // 已选物品类别
      itemCategory: [],
      // 可选物品类别
      categories: categoryOption,
      isIndeterminate: false,
      // 搜索框双向绑定变量
      postDialogVisible: false,
      flag: '丢失',
      newItem_id: 0,
      addItemForm:{
        symbol :'',
        tell_campus :'',
        connect_phone :'',
        instruction: '',
        item_name: '',
        connect_peo:'',
        getorlose: 0
      },
      // 添加商品规则
      addItemFormRule:{
        //用户名规则
        item_name: {
          required: true,
          trigger: 'blur',
          max: 20,
          message: '请输入物品名(长度不超过20)',
        }
      },
      // 查询信息用表
      queryInfo: {
        page_num: 1,
        keyword: ''
      },
      picture:{},
      lostPostInfo:[],
      findPostInfo:[],
      avatorSrc: [],
      imgFile: []
    }},
  async created() {
   this.lostPostInfo = await this.getLostList()
   this.findPostInfo = await this.getFindList()
   this.$forceUpdate()
  },
  methods: {
    async turnToLost() {
      this.queryInfo.page_num = 1
      this.lostPostInfo = await this.getLostList()
    },
    async turnToFind() {
      this.queryInfo.page_num = 1
      this.findPostInfo = await this.getFindList()
    },
    pathTo(path) {
      this.$router.push(path)
    },
    // 关闭添加商品对话框
    addItemDialogClosed() {
      this.$refs.addItemFormRef.resetFields()
      this.addItemForm.remarks = ''
    },
    // 监听发帖按钮点击事件
    found() {
      this.flag = '拾遗'
      this.postDialogVisible = true
    },
    lost() {
      this.flag = '丢失'
      this.postDialogVisible = true
    },
    // 以下两个函数作用为对el-upload的某些函数
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed() {
      this.$message.error('上传图片数超过限制')
    },
    // 成功上传商品图片提示
    successUpload() {
      this.$message.success('上传成功')
    },
    // 上传商品图片(需要改)
    async uploadImgType1(param) {
      
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('getorlose', this.addItemForm.getorlose)
      formData.append('item_name', this.addItemForm.item_name)
      formData.append('tell_campus', this.addItemForm.tell_campus)
      formData.append('connect_phone', this.addItemForm.connect_phone)
      formData.append('connect_peo', this.addItemForm.connect_peo)
      formData.append('symbol', this.addItemForm.symbol)
      formData.append('instruction', this.addItemForm.instruction)
      formData.append('multipartFile', param.file)
      formData.append('item_id', this.newItem_id)
      await this.$axios.post('/item_insert',
          formData,
          {
            headers: {
              'accesstoken': token,
              'Content-Type': 'multipart/form-data'
            }
          }).then(response => {
        console.log('上传成功')
        this.$refs.addItemFormRef.resetFields
        this.postDialogVisible = false
        param.onSuccess()  // 上传成功的图片会显示绿色的对勾
        // 但是我们上传成功了图片， fileList 里面的值却没有改变，还好有on-change指令可以使用
      }).catch(response => {
        return this.$message.error('上传失败')
      })
    },
    async postWithoutFile() {
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('getorlose', this.addItemForm.getorlose)
      formData.append('item_name', this.addItemForm.item_name)
      formData.append('tell_campus', this.addItemForm.tell_campus)
      formData.append('connect_phone', this.addItemForm.connect_phone)
      formData.append('connect_peo', this.addItemForm.connect_peo)
      formData.append('symbol', this.addItemForm.symbol)
      formData.append('multipartFile', null)
      formData.append('instruction', this.addItemForm.instruction)
      formData.append('item_id', this.newItem_id)
      await this.$axios.post('/item_insert',
          formData,
          {
            headers: {
              'accesstoken': token
            }
          }).then(response => {
        console.log('上传成功')
        this.$refs.addItemFormRef.resetFields()
        this.postDialogVisible = false
      }).catch(response => {
        this.$refs.addItemFormRef.resetFields()
        this.postDialogVisible = false
      })
    },
    // 监听标签切换事件
    async selectItemChange(value) {
      console.log(this.itemCategory)
      if (this.$route.path === '/lost') this.lostPostInfo = await this.getLostList()
      else this.findPostInfo = await this.getFindList()
      this.$forceUpdate()
    },
    // 监听点击发帖按钮事件
    postItem() {
      this.$refs.addItemFormRef.validate(async valid =>{
        if(!valid) return
      if (this.flag === '丢失') this.addItemForm.getorlose = 1
      await this.$refs.upload.submit()
      this.postDialogVisible = false
      this.$refs.addItemFormRef.resetFields()
      if(this.$router.path === '/lost') this.lostPostInfo = await this.getLostList()
      else this.findPostInfo = await this.getFindList()
      })
    },
    // 获取帖子列表函数 遗失 + 拾得
    async getLostList() {
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.page_num)
      formData.append('keywords', this.queryInfo.keyword)
      formData.append('tag', '')
      formData.append('getorlose', 1)
      formData.append('time', -9999)
      const {data: res} = await this.$axios.post('get_item', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      var i = 0;
      for(; i < res.length; i++){
        this.avatorSrc[i] = await this.getAvatarSrc(res[i].username)
        var result = await this.getItemImg(res[i].item_id)
        if(result === false) continue
        else this.picture[i] = result
      }
      console.log(this.picture)
      const {data: num} = await this.$axios.post('get_item_number', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      this.total = num
      return res
    },
    async getFindList() {
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.page_num)
      formData.append('keywords', this.queryInfo.keyword)
      formData.append('tag', '')
      formData.append('getorlose', 0)
      formData.append('time', -9999)
      const {data: res} = await this.$axios.post('get_item', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      var i = 0;
      for(; i < res.length; i++){
        this.avatorSrc[i] = await this.getAvatarSrc(res[i].username)
        var result = await this.getItemImg(res[i].item_id)
        if(result === false) continue
        else this.picture[i] = result
      }
      const {data: num} = await this.$axios.post('get_item_number', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      this.total = num
      console.log(this.picture)
      return res
    },
    // 监听搜索按钮点击事件
    async searchItem() {
      if (this.$route.path === '/lost') this.lostPostInfo = await this.getLostList()
      else this.findPostInfo = await this.getFindList()
    },
    // 监听页面切换事件
    async handleCurrentChange() {
      if (this.$route.path === '/lost') this.lostPostInfo = await this.getLostList()
      else this.findPostInfo = await this.getFindList()
    },
    // 根据用户名获取用户头像
    async getAvatarSrc(name) {
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
    // 根据帖子ID获取对应的图片
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
      if(result === "data:image/png;base64,") return false
      return result
    },
    quit() {
      window.sessionStorage.clear()
      this.$router.push('/')
    },
    handleChange(file, fileList, name) {
      this.imgFile["file"] = fileList;
      if (typeof(this.imgFile.file) != "undefined" && this.imgFile.file.length > 0) {
        this.isClientCertFile = false
        } else {
          this.isClientCertFile = true
        }
    }
  },
  imageToBase64 () {
      var reader = new FileReader()
      reader.readAsDataURL('../assets/default.png')
      reader.onload = () => {
        return reader.result
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
  }
}
</script>
<style scoped>
.el-aside {
  background-color: #f5f5f5;
}
.el-header {
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 150px !important;
}
/*图片*/
.tupian {
  display: inline-block;
  width: 100px;
  height: 150px;
}
.tupian_img {
  display: inline-block;
  width: 100px;
  margin-top: 20px;
}
/*图片位置*/
.home_head_span {
  position: absolute;
  left: 500px;
}
.lostAndFound_head_item {
  height: 58px;
  width: 200px;
  text-align: center;
}
.home_main_search {
  text-align: right;
}
.el-footer {
  background-color: #f5f5f5;
}
.tree_head_span_search{
  padding-left: 1000px;
  font-size: 20px;
  font-weight:bold;
}

</style>
