<template>
  <div class="information_">
<!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="infBreadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图区域-->
    <el-card class="firstCard">
<!--      个人信息具体-->
      <el-form :model="studentForm"  ref="studentFormRef" label-width="100px" class="studentForm">
<!--        头像区域-->
        <el-form-item  label="头像" prop="avatar_url" >
          <el-row class="demo-avatar demo-basic">
<!--            头像显示区域-->
            <el-col :span="2">
              <div class="demo-basic--circle">
                <div class="block" @click="changeUserPicture()">
                  <el-avatar :size="70" :src="circleUrl" ></el-avatar>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
<!--        用户名-->
        <el-form-item label="用户名"  >
          <el-input v-model="studentForm.username" readonly ></el-input>
        </el-form-item>
<!--        学校-->
        <el-form-item label="学校"  >
          <el-input v-model="studentForm.school" readonly ></el-input>
        </el-form-item>
<!--        校区-->
        <el-form-item label="校区"  >
          <el-input v-model="studentForm.campus" readonly ></el-input>
        </el-form-item>
<!--        邮箱-->
        <el-form-item label="邮箱"  >
          <el-input v-model="studentForm.email" readonly ></el-input>
        </el-form-item>
<!--        QQ-->
        <el-form-item label="QQ"  >
          <el-input v-model="studentForm.qq" readonly ></el-input>
        </el-form-item>
<!--        电话-->
        <el-form-item label="电话"  >
          <el-input v-model="studentForm.phone" readonly ></el-input>
        </el-form-item>
      </el-form>

<!--      编辑信息，修改密码的按钮-->
      <el-button type="info" @click="showEditDialog()">修改信息</el-button>
      <el-button type="info" @click="showEditPasswordDialog()">密码修改</el-button>

    </el-card>
<!--    修改用户的对话框-->
    <el-dialog
        :visible.sync="editDialogVisible"
        title="修改信息"
        width="50%"
        @close="editDialogClosed">

<!--      主体-->
      <el-form :model="editStudentForm" :rules="editStudentRules" ref="editStudentFormRef" label-width="100px" class="demo-ruleForm">
<!--        用户名-->
        <el-form-item label="用户名">
          <el-input v-model="editStudentForm.username" disabled></el-input>
        </el-form-item>
        <!--   大学选择  -->
        <el-select v-model="editStudentForm.school" filterable clearable placeholder="请选择大学"  class="schoolOptions">
          <!-- v-for="item in schoolName" :key='item.id'       -->
          <el-option
              v-for="item in schoolOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
<!--        校区-->
        <el-form-item label="校区" prop="campus" >
          <el-input v-model="editStudentForm.campus"  ></el-input>
        </el-form-item>
<!--        邮箱-->
        <el-form-item label="邮箱" prop="email" >
          <el-input v-model="editStudentForm.email" disabled></el-input>
        </el-form-item>
<!--        QQ-->
        <el-form-item label="QQ" prop="qq" >
          <el-input v-model="editStudentForm.qq"  ></el-input>
        </el-form-item>
<!--        电话-->
        <el-form-item label="电话" prop="phone" type="number">
          <el-input v-model="editStudentForm.phone"  ></el-input>
        </el-form-item>
      </el-form>
<!--      按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">修 改</el-button>
      </span>
    </el-dialog>
<!--    修改密码的对话框-->
    <el-dialog
        title="修改密码"
        :visible.sync="editPasswordDialogVisible"
        width="50%"
        @close="editPasswordDialogClosed">

      <!--      主体-->
      <el-form :model="editStudentPasswordForm" :rules="editStudentPasswordFormRules" ref="editStudentPasswordFormRef" label-width="100px" >
        <!--    密码   -->
        <el-form-item prop="inputPassPassword" label="原密码:">
          <el-input v-model="editStudentPasswordForm.inputPassPassword" type="password" clearable ></el-input>
        </el-form-item>
        <!--    密码   -->
        <el-form-item prop="newPassword" label="密码:">
          <el-input v-model="editStudentPasswordForm.newPassword" type="password" clearable ></el-input>
        </el-form-item>
        <!--    确认密码   -->
        <el-form-item prop="comparePassword" label="确认密码:">
          <el-input v-model="editStudentPasswordForm.comparePassword" type="password" clearable  ></el-input>
        </el-form-item>
      </el-form>
      <!--      按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPasswordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserPasswordInfo">修 改</el-button>
      </span>
    </el-dialog>
<!--    修改头像的对话框-->
    <el-dialog
        title="更换头像"
        :visible.sync="changePictureDialogVisible"
        width="20%"
        height="100%"
        @close="changePictureDialogClosed"
        class="changePictureDialog">
      <div>
        <!--            头像上传区域-->
        <el-col :span="2">
          <div class="demo-basic--circle">
            <div class="block">
<!--              上传头像-->
              <el-upload
                  :show-file-list="false"
                  :http-request="loginPicture"
                  ref="uploadPictureRef"
                  :limit="1"
                  :auto-upload="false"
                  :on-change="imgPreview"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  style="width: 40%">
<!--                显示上传的头像-->
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
              </el-upload>
            </div>
          </div>
        </el-col>
      </div>
<!--      确定和取消按钮-->
      <div class="ptn">
        <el-button @click="changePictureDialogVisible = false" style="margin-right:50px">取 消</el-button>
        <el-button type="primary" @click="postImg()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    // 验证手机号的规则
    let checkMobile = (rule,value,cb)=>{
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (regMobile.test(value)){
      //  合法的手机号
        return cb()
      }
      cb(new Error('请输入正确的手机号'))
    }
    // 验证QQ号的规则
    let checkQQNumber = (rule,value,cb)=>{
      const regQQ =  /^[0-9]{5,12}$/
      if (regQQ.test(value)){
        //  合法的QQ号
        return cb()
      }
      cb(new Error('请输入正确的QQ号'))
    }
    return {
      // 头像来源
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      //imgUrl:require('./assets/logo.png')
      // 上传的头像
      imageUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      // 保存学生用户名
      userName: '',
      //控制修改学生信息的对话框
      editDialogVisible: false,
      //控制修改学生密码的对话框
      editPasswordDialogVisible: false,
      //控制修改头像的对话框
      changePictureDialogVisible: false,
      // 学校选择器
      schoolOptions: [],
      // 学生信息
      studentForm: {
        username: '',
        school: '',
        campus: '',
        email: '',
        qq: '',
        phone: '',
        password: ''
      },
      // 修改学生信息时存储信息的数组
      editStudentForm: {
        username: '',
        school: '',
        campus: '',
        email: '',
        qq: '',
        phone: ''
      },
      // 修改密码时存储信息的数组
      editStudentPasswordForm: {
        username: '',
        password: '',
        // 输入的旧密码
        inputPassPassword: '',
        // 新密码
        newPassword: '',
        // 校验新密码
        checkPassword: ''
      },
      // 修改学生信息的验证规则
      editStudentRules: {
        phone: [
          { required: true, message: "手机号码不能为空" },
          {
            validator: checkMobile,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        qq: [
          {
            required: true,
            message: "请输入QQ号",
          },
          {
            validator: checkQQNumber,
            message: "请输入正确的QQ号",
            trigger: 'blur'
          }
        ],
        school: {
          type: 'string',
          required: true,
          message: '大学不能为空',
          trigger: 'blur'
        }
      },
      // 修改密码的验证规则
      editStudentPasswordFormRules: {
        newPassword: [
          {
            type: 'string',
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            min: 10,
            max: 17,
            message: '密码长度在10到17个字符之间'
          },
          {
            validator: function (rule, value, callback) {
              if (value === this.editStudentPasswordForm.password) {
                callback(new Error('新密码与原密码相同'))
              } else {
                callback()
              }
            }.bind(this)
          }],
        inputPassPassword: {
          type: 'string',
          required: true,
          trigger: 'blur',
          validator: function (rule, value, callback) {
            console.log(this.editStudentPasswordForm.password)
            if (value === '') {
              callback(new Error('请输入原密码'))
            } else if (value !== this.editStudentPasswordForm.password) {
              callback(new Error('原密码输入错误'))
            } else {
              callback()
            }
          }.bind(this)
        },
        comparePassword: {
          type: 'string',
          required: true,
          trigger: 'blur',
          validator: function (rule, value, callback) {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.editStudentPasswordForm.newPassword) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          }.bind(this)
        }
      },
      // 判断是否已经获取学校了
      choseSchool: true
    }
  },
  // 生命周期函数
  async created() {
    this.userName = window.localStorage.getItem('username');
    await this.getStudentInformation()
    await this.getSchoolName()
  },
  // 方法
  methods:{
    // 获取学生信息(还需要获得头像)
    async getStudentInformation(){
      const token = window.sessionStorage.getItem('token')
      console.log("!!!")
      const data = await this.$axios.get('/get_mess',
          {
            headers: {
              'accesstoken': token
            }
          }
      )
      console.log(data)
      if(data.data.username === '')
        return this.$message.error('获取学生信息失败!')
      else {
        // 赋值
        this.studentForm.username = data.data.username;
        this.studentForm.email = data.data.email;
        this.studentForm.school = data.data.school;
        this.studentForm.campus = data.data.campus;
        this.studentForm.phone = data.data.phone;
        this.studentForm.qq = data.data.qq;
        this.studentForm.password = data.data.password;
        this.editStudentPasswordForm.password = data.data.password
      }
      var that = this;
      const imgData = await this.$axios.get('/getImage',
          {
            responseType: 'arraybuffer',
            header: {
              'accesstoken': token
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

            this.circleUrl = data; //赋值给img标签的src属性
          })
    },
    // 获取学校
    async getSchoolName () {
      if (this.choseSchool) {
        // 传递查询参数
        const formData = new FormData()
        const { data: res } = await this.$axios.post('/user/school', formData)
        if (!res) {
          this.$message.error('获取信息失败')
        }
        console.log(this.schoolOptions)
        this.schoolOptions = res
        this.schoolOptions.length = 2689
        this.choseSchool = false
      }
    },
    // 展示编辑用户的对话框
    showEditDialog() {
      //显示窗口
      this.editDialogVisible = true
      // 数据传递
      this.editStudentForm.username = this.studentForm.username
      this.editStudentForm.school = this.studentForm.school
      this.editStudentForm.campus = this.studentForm.campus
      this.editStudentForm.email = this.studentForm.email
      this.editStudentForm.qq = this.studentForm.qq
      this.editStudentForm.phone = this.studentForm.phone
    },
    // 展示修改密码的对话框
    showEditPasswordDialog(){
      this.editPasswordDialogVisible = true
      // 密码传递
      this.editStudentPasswordForm.password = this.studentForm.password
      this.editStudentPasswordForm.username = this.studentForm.username
    },
  //  修改密码对话框关闭
    editPasswordDialogClosed(){
      this.$refs.editStudentPasswordFormRef.resetFields()
    },
    // 修改信息的对话框关闭
    editDialogClosed(){
      this.$refs.editStudentFormRef.resetFields()
    },
    // 更改头像框关闭
    changePictureDialogClosed(){
      this.imageUrl = this.circleUrl
    },
    // 确定修改学生信息并提交
    editUserInfo(){
      const token = window.sessionStorage.getItem('token')
      const editStudentForm = new FormData()
      editStudentForm.append('phone', this.editStudentForm.phone)
      editStudentForm.append('qq', this.editStudentForm.qq)
      editStudentForm.append('school', this.editStudentForm.school)
      editStudentForm.append('campus', this.editStudentForm.campus)
      editStudentForm.append('username', this.editStudentForm.username)
      for (var value of editStudentForm.values()) { console.log(value) }
      this.$refs.editStudentFormRef.validate(async valid =>{
        if(!valid) return
      //  发起修改用户信息请求
        const {data:res} = await this.$axios.post('/change_data',editStudentForm,{
          header: {
            'accesstoken': token
          }
        })
        console.log("!!!!!!!!!")
        console.log(res)
        if(res !== "修改成功") {
          return this.$message.error('修改学生信息失败')
        }
      //  关闭对话框，刷新列表，提示修改成功
        this.editDialogVisible = false
        await this.getStudentInformation()
        this.$message.success('学生信息修改成功!')

      })
    },
    // 确定修改学生密码并提交
    editUserPasswordInfo(){
      const token = window.sessionStorage.getItem('token')
      const editStudentPasswordForm = new FormData()
      editStudentPasswordForm.append('password', this.editStudentPasswordForm.newPassword)


      this.$refs.editStudentPasswordFormRef.validate(async valid =>{
      if(!valid) return
      //  发起修改用户信息请求
      const {data:res} = await this.$axios.post('/change_password',editStudentPasswordForm, {
        header: {
          'accesstoken': token
        }
      })
        console.log(res)
      if(res !== "修改成功") {
        //  关闭对话框
        this.editPasswordDialogVisible = false
        this.$message.error('密码修改失败')
        return
      }
        //  更新密码
        await this.getStudentInformation()
        // 提示修改成功
        this.$message.success('密码修改成功!')
      //  关闭对话框
      this.editPasswordDialogVisible = false
    })
    },
    // 显示更换头像提示框
    changeUserPicture(){
      // 显示窗口
      this.changePictureDialogVisible = true
    },
    // 显示选择的新头像图片
    imgPreview(file, fileList) {
      let fileName = file.name;
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        this.imageUrl = URL.createObjectURL(file.raw)  // 获取URL
      } else {
        this.$message.error('请选择图片文件');
      }
    },
    // 上传头像的方法限制
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 对上传的图片进行限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 选择上传图片到后端（覆盖action函数）
    async loginPicture(param) {
      console.log("111")
      console.log(this.imageUrl)
      // 上传图片
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('newfile', param.file)
      await this.$axios.post('/uploadImg',
          formData,
          { headers: {
              accesstoken: token,
              'Content-Type':'multipart/form-data'
            }
          }).then(response => {
        console.log('上传图片成功')
        param.onSuccess()  // 上传成功的图片会显示绿色的对勾
        this.$message({ message: '上传成功!', type: 'success' });
        // 替换头像
        this.circleUrl=this.imageUrl
        // 但是我们上传成功了图片， fileList 里面的值却没有改变，还好有on-change指令可以使用
      }).catch(response => {
        console.log('图片上传失败')
        param.onError()
      })
    },
    // 手动上传（按钮）
    postImg(param) {
      console.log("111")
      this.$refs.uploadPictureRef.submit();
      // 关闭窗口
      this.changePictureDialogVisible = false
      this.imageUrl = ''
    }
}
}
</script>

<style lang="less" scoped>
.infBreadcrumb{
  padding-bottom: 20px;
  margin-bottom: 15px;
}
/*大学选择*/
.schoolOptions{
  position: relative;
  left: 21%;
  transform: translate(-30%,-10%);
  margin-bottom: 15px;
}
.firstCard{
  margin-top: 20px;
}
.changePictureDialog{
  justify-content: space-between;
  height: 2000px;
}
.block{
  justify-content: space-between;
  height: 20%;

}
// 上传图片的样式
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 70px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 25px;
  color: #8c939d;
  width: 40px;
  height: 40px;
  line-height: 178px;
  text-align: right;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
  margin-left: 100px;
}
.uploadAvator {
  width: 80%;
  height: 100%;
}
.ptn {
  display: -moz-box;
  margin-top: 150px;
  margin-left: 40px;
}
</style>
