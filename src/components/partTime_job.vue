<template>
  <div class="container">
    <div class="container_head">
      <div>
      <span style="display:inline-block;font-weight:bold; width: 600px; float: right" class="tree_head_span_search">
           <el-button type="text" @click="pathTo('/home')">返回主页</el-button>
           <el-button type="text" @click="pathTo('/personal_information')">个人中心</el-button>
           <el-button type="text">账号退出</el-button>
      </span>
      </div>
      <!--      图标-->
      <div style="display: inline-block;width: 100px;height: 100px;float: left" class="tubiao">
        <img src="../assets/part_time_job.jpeg" style="width: 100px;height: 100px">
      </div>
      <!--      搜索框-->
      <div style="display: inline-block;width: 500px;height: 100%;float: left" class="sousuo">
        <el-input v-model="queryInfo.keywords"placeholder="请输入您要搜索的内容..." class="input_search">
          <el-button slot="append" icon="el-icon-search" @click="job_search" class="el-button">搜索</el-button>
        </el-input>
      </div>
    </div>
    <div class="firstCard">
<!--          标题-->
          <div style="padding-bottom: 15px">
            <div class="allCategories">信息筛选></div>
<!--            筛选条件-->
          </div>
          <!--          分类卡片区域-->
          <el-card class="sortedCard">
<!--            学历类别筛选-->
            <div>
              <a>学历查询 : </a>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="typeCategory" @change="rangeChange" :max="1">
                <el-checkbox label="专科">专科</el-checkbox>
                <el-checkbox label="本科">本科</el-checkbox>
                <el-checkbox label="研究生">研究生</el-checkbox>
                <el-checkbox label="博士">博士</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-card>
    </div>
    <!--    主体-->
    <div class="box">
      <el-container>
        <el-main>
          <!--          导航栏-->
          <div class="container_main_1">
            <div class="container_main_1_1"  v-for="(item, index) in postInfo">
            <div class="container_main_1_1_touxiang">
                <el-avatar :src="avatorSrc[index]"></el-avatar>
                <span>{{item.username}}&nbsp</span>
              <div class="yixiang">
                联系方式：{{item.contact}}
              </div>
              <div class="yixiang">
                兼职意向：{{item.intention}}
              </div>
              <div class="yixiang">
                兼职时间：{{item.startTime}} — {{item.endTime}}
              </div>
              <div class="yixiang">
                性别：{{item.sex}}
              </div>
              <div class="yixiang">
                学校：{{item.school}}
              </div>
              <div class="yixiang">
                学历：{{item.type}}
              </div>
              <div class="yixiang">
                备注：{{item.remark}}
              </div>
            </div>
          </div>
          </div>
        </el-main>
        <el-footer class="el-footer">
          <div class="block">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.page_num"
                :page-size="20"
                layout="total, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
          </div>
          <el-button @click="beVisible">我要发帖</el-button>
        </el-footer>
        <el-dialog
        :visible.sync="postDialogVisible"
        title="我的求职">
        <el-form :model="uploadForm" :rules="uploadFormRule" ref="uploadItemFormRef" label-width="70px" class="uploadItemForm">
        <el-form-item label="用户名">
          <el-input v-model="UserMess.username" disabled style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="学校">
          <el-input v-model="UserMess.school" disabled style="width: 450px"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="uploadForm.sex" placeholder="请选择性别">
            <el-option value="男"></el-option>
            <el-option value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兼职意向">
          <el-input v-model="uploadForm.intention"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="uploadForm.contact"></el-input>
        </el-form-item>
        <el-form-item label="学历">
          <el-select v-model="uploadForm.type" placeholder="请选择对应学历">
            <el-option value="专科在读"></el-option>
            <el-option value="本科在读"></el-option>
            <el-option value="研究生在读"></el-option>
            <el-option value="博士在读"></el-option>
            <el-option value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兼职时间">
          <el-input v-model="uploadForm.startTime" style="width: 250px"></el-input>
          —
          <el-input v-model="uploadForm.endTime" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="uploadForm.remark"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="postDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postPost">发 表</el-button>
      </span>
        </el-dialog>
      </el-container>
    </div>
  </div>

</template>

<script>
export default {
  name: 'market',
  data() {
    return {
      total: 100,
      postDialogVisible: false,
      typeCategory: [],
      avatorSrc: [],
      postInfo:[
      ],
      uploadForm:{
        startTime: '',
        endTime: '',
        contact: '',
        sex: '',
        intention: '',
        type: '',
        remark: '',
        school: ''
      },
      UserMess:{
        username: '',
        school: ''
      },
      queryInfo: {
        keywords: '',
        page_num: 1
      }
    }
  },
  async created() {
    this.UserMess.username = window.localStorage.getItem('username')
    this.UserMess.school = await this.getUserSchool(this.UserMess.username)
    await this.getPostList()
    this.$forceUpdate()
  },
  methods: {
    async getUserSchool(name) {
      let result
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('username', name)
      const { data: res} = await this.$axios.get('/get_mess2', {
            headers: {
              'accesstoken': token
            },params:{
              'username' :name
        }
          }
      )
      if(!res){
        this.$message.error('获取信息失败')
      }
      return res.school
    },
    //根据用户名获取头像并赋值给对应的变量
    async getAvatorSrc(name) {
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
    },
    //页面切换
    pathTo(path){
      this.$router.push({
        path: path
      })
    },
    async handleCurrentChange(val) {
      this.queryInfo.page_num = val
      console.log(this.queryInfo.page_num)
      await this.getPostList()
    },
    async postPost() {
      const token = window.sessionStorage.getItem('token')
      const uploadForm = new FormData()
      uploadForm.append('school', this.UserMess.school)
      uploadForm.append('startTime', this.uploadForm.startTime)
      uploadForm.append('endTime', this.uploadForm.endTime)
      uploadForm.append('type', this.uploadForm.type)
      uploadForm.append('contact', this.uploadForm.contact)
      uploadForm.append('sex', this.uploadForm.sex)
      uploadForm.append('intention', this.uploadForm.intention)
      uploadForm.append('remark', this.uploadForm.remark)
      const {data: res} = await this.$axios.post('/work/insert', uploadForm,
       { headers:{
          'accesstoken': token
        }
      })
      console.log(res)
       this.postDialogVisible = false;
      this.$refs.uploadFormRef.resetFields()
     await  this.getPostList()
    },
    beVisible() {
      this.postDialogVisible = true;
    },
    async getPostList() {
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.page_num)
      formData.append('intention', this.queryInfo.keywords)
      formData.append('type', this.typeCategory)
      const token = window.sessionStorage.getItem('token')
      const {data: num} = await this.$axios.post('work/get_number', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      this.total = num
      const res = await this.$axios.post('work/get', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      console.log(res.data)
      this.postInfo=res.data
      console.log(this.postInfo.length)
      var j = 0;
      for( ;j < this.postInfo.length; j++){
        var name = this.postInfo[j].username
        this.avatorSrc[j] = await this.getAvatorSrc(name)
      }
    },
    async rangeChange() {
      const {data : res} = await this.getPostList()
      console.log(res)
      this.postInfo = res
    },
    async job_search() {
      const {data: res} = await this.getPostList()
      this.postInfo = res
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
/*第一层卡片（条件筛选）*/
.firstCard{
  padding-top: 20px;
  width: 1180px;
  margin: 0 auto;
}
/*第二层卡片（区域）*/
.secondCard{
  padding-top: 15px;
  width: 70%;
  padding-left: 152px;
  border-radius: 10px;
  line-height: 30px;
}
.container {
  background-color: #f5f5f5;
}
.container_head {
  height: 150px;
  width: 100%;
}
.tubiao {
  padding-top: 25px;
  padding-left: 200px;
}
.sousuo {
  display: inline-block;
  height: 100px;
  width: 500px;
}
.input_search {
  padding-top: 50px;
  padding-left: 150px;
}
.box {
  background-color:#DCDCDC;
  margin: 0 auto;
  width: 1180px;
}
.el-button {
  width: 85px;
}
.container_main_1 {
  height: auto;
  width: 100%;
}
.container_main_1_1 {
  height: 600px;
  width: 270px;
  display: inline-block;
  margin-right: 13px;
  border-width: 1px;
  border-style: solid;
  border-color: #BFAB86;
}
.container_main_1_1:hover {
  background-color: #DCDCDC;
}
.container_main_1_1_touxiang {
  padding-left: 20px;
  padding-top: 20px;
}
.yixiang {
  font-size: 14px;
  height: 30px;
  color: black;
  padding: 0 15px;
  margin-top: 20px;
}
.el-footer {
  background-color: beige;
}
</style>

