<template>
  <div class="historyTreeHole">
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>历史树洞</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图区域-->
    <el-container class="containers">
      <!--    回到顶部-->
      <el-backtop :bottom="100">
        <div class="top">Top</div>
      </el-backtop>
      <!--        中心区域-->
      <el-main class="el-main">
        <!--            postInfo存储获得帖子信息-->
        <div class="tree_main"  v-for="(item, index) in postInfo">
          <el-card class="tree_main_card">
            <!--                依次展示发帖人头像，发帖时间，用户名等-->
            <el-avatar :src="avatarSrc"></el-avatar>
            <span>{{item.username+' '}}</span>
            <span>{{' 发表时间：'+item.post_time+' '}}</span>
            <el-button type="text" icon="el-icon-delete" circle style="padding-rigth: 10%"
                               @click="deletePost(item.post_id)">删除</el-button>
            <hr>
            <h2>{{''+item.post_title}}</h2>
            <div class="tree_main_card_word">{{item.post_content}}</div>
<!--            按钮-->
            <div class="tree_main_card_frame">
              <!--                  根据like,dislike数组切换图片-->
               <img src="../assets/socialImg/tolike.jpg" alt="" style="width: 35px; height: 35px;"
                      v-show="!findLike(index)" @click="turnLike(index)">
                <img src="../assets/socialImg/liked.jpg" alt="" style="width: 35px; height: 35px;"
                      v-show="findLike(index)" @click="turnLike(index)">
                <button>{{item.give_like_number}}</button>
                <img src="../assets/socialImg/toDislike.jpg" alt="" style="width: 35px; height: 35px; margin-left: 30px"
                      v-show="!findDislike(index)" @click="turnDisLike(index)">
                <img src="../assets/socialImg/disliked.jpg" alt="" style="width: 35px; height: 35px; margin-left: 30px"
                      v-show="findDislike(index)" @click="turnDisLike(index)">
                <button>{{item.give_dislike_number}}</button>
              <el-button type="primary" icon="el-icon-edit" round @click="editComment(index)">评论</el-button>
              <el-button type="primary" icon="el-icon-s-comment" round @click="showComment(index)">详情</el-button>
            </div>
          </el-card>
          <!--              评论区，根据showComment数组切换是否可见-->
          <div  v-if="showComments[index]" :key="index">
            <div class="commentContainer" v-for="(subItem, subIndex) in comments[index]">
              <el-avatar :src="commentsAvator[index][subIndex]"></el-avatar>
              <span>{{subItem.username}}</span>
              <span>{{subItem.reply_time}}</span>
              <el-input v-model="subItem.reply_content" disabled>
              </el-input>
            </div>
          </div>
        </div>
      </el-main>
      <!--        底部区域-->
      <el-footer class="el-footer">
        <el-button class="postBtn" @click="postPage">我要发贴</el-button>
        <el-input v-model="queryInfo.keyword" prefix-icon="el-icon-search" placeholder="请输入内容"
                  style="width: 300px">
          <el-button slot="append" icon="el-icon-search" @click="getPostList()">搜索</el-button>
        </el-input>
        <!--            分页栏，分页数据与queryInfo相关数据绑定-->
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="queryInfo.pageNum"
            :page-size="100"
            layout="prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </el-footer>
    </el-container>
    <!--    发帖对话框-->
    <el-dialog
        title="提示"
        :visible.sync="postDialogVisible"
        width="30%">
      <div class="postHeader">
    <span class="tip1">
              发贴请遵守社区规范
            </span>
        <span class="tip2">
              <a href="">论坛投诉</a>
            </span>
      </div>
      <div class="postContent">
        <el-input v-model="postTitle"></el-input>
        <el-input v-model="postContent" type="textarea" rows="6" placeholder="请输入内容"
                  maxlength="500" show-word-limit></el-input>
        <!--        上传图片使用-->
        <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :http-request="uploadImg"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :on-success="successUpload"
            :file-list="fileList"
            :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="postImg">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="postDialogdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="postLast">发 表</el-button>
    </span>
    </el-dialog>
    <!--    评论对话框-->
    <el-dialog
        :visible.sync="commentDialogVisible">
       <span class="tip1">
              发贴请遵守社区规范
            </span>
      <span class="tip2">
              <a href="">论坛投诉</a>
            </span>
      <div class="postContent">
        <el-input v-model="commentContent" type="textarea" rows="6" placeholder="请输入内容"
                  maxlength="200" show-word-limit></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="commentDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="postComment()">发 表</el-button>
    </span>
    </el-dialog>
    <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: new Date(),
      //total是获取帖子总数
      total: 1,
      username: 'haha',
      postDialogVisible: false,
      commentDialogVisible: false,
      //绑定帖子内容
      commentContent: '',
      queryInfo: {
        keyword: '',
        pageNum: 1,
        pageSize: 10
      },
      //发贴标题
      postTitle: '',
      //发帖内容
      postContent: '',
      //上传图片绑定列表
      fileList: [],
      //显示信息的切换
      like: [false,false,false,false,false,false,false,false,false,false],
      dislike: [false,false,false,false,false,false,false,false,false,false],
      showComments: [false, false, false, false, false, false, false, false, false, false],
      //被选中的楼层
      selectedFloor: 0,
      collate: [false,false,false,false,false,false,false,false,false,false],
      // 选出来的帖子
      postInfo:[
      ],
      avatarSrc: '',
      comments: [
      ],
      commentsAvator: []
    }
  },
  async created() {
    this.username = window.localStorage.getItem('username')
    const token = window.sessionStorage.getItem('token')
    this.avatarSrc = await this.getAvatorSrc(this.username)
    await this.getPostList(1)
    console.log(this.postInfo)
    console.log(this.like)
    this.$forceUpdate()
  },
  methods: {  
    gotoperson(){
      this.$router.push('/')//点击后进入个人中心？？？
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
    // 获取用户信息的函数
    // async getUserMes(value) {
    //   var token = new FormData()
    //   token.append('token', value)
    //   const data = await this.$axios.get('/get_mess',
    //       {
    //         headers: {
    //           'accesstoken': value
    //         },
    //         params: {
    //           token : value
    //         }
    //       }
    //   )
    //   var that = this;
    //   const imgData = await this.$axios.get('/getImage',
    //       {
    //         responseType: 'arraybuffer',
    //         header: {
    //         'accesstoken': value
    //         }
    //       }
    //   ).then(response => {
    //         return (
    //             "data:image/png;base64," +
    //             btoa(
    //                 new Uint8Array(response.data).reduce(
    //                     (data, byte) => data + String.fromCharCode(byte),
    //                     ""
    //                 )
    //             )
    //         );
    //   })
    //       .then(data => {
    //         this.imgUrl = data; //赋值给img标签的src属性
    //       })
    //
    // },

    // 根据queryInfo获得帖子列表的函数,兼有搜索功能
    async getPostList() {
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.pageNum)
      formData.append('queryInfo', this.queryInfo.keyword)
      const token = window.sessionStorage.getItem('token')
      const data = await this.$axios.post('/get_user_content',formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      this.postInfo=data.data
      console.log(this.postInfo.length)
      var j = 0;
      for( ;j < this.postInfo.length; j++){
        if(this.postInfo[j].user_like) this.like[j] = true
        else this.like[j] = false
        if(this.postInfo[j].user_dislike) this.dislike[j] = true
        else this.dislike[j] = false
        var id = this.postInfo[j].post_id
        this.comments[j] = await this.getCommentList(id)
        console.log(this.comments);
        var i = 0
        this.commentsAvator[j] = new Array()
        for(; i < this.comments[j].length; i++)
        {
          this.commentsAvator[j][i] =  await this.getAvatorSrc(this.comments[j][i].username)
        }
        console.log(this.commentsAvator[j])
      }
      const {data : res} = await this.$axios.post('/get_user_content_number', 
          {
            headers: {
              'accesstoken': token
            }
          })
      this.total = res
      this.$forceUpdate()
    },
    async getCommentList(id) {
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('post_id', id)
      const { data: res } = await this.$axios.post('/get_content_reply', formData,
          {
            header : {
              'accesstoken': token
            }
          })
      return res
    },
    // 监听发帖对话框状态改变
    postPage() {
      this.postDialogVisible = true
    },
    // 以下两个函数作用为对el-upload的某些函数
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed() {
      this.$message.error('上传图片数超过限制')
    },
    // 点击按钮提交帖子信息
    async postLast() {
      var formdata = new FormData()
      const token = window.sessionStorage.getItem('token')
      formdata.append('post_title', this.postTitle)
      formdata.append('username', this.username)
      formdata.append('post_content', this.postContent)
      const res = await this.$axios.post('/post_insert', formdata,
          {
            headers: {
              'accesstoken': token
            }
          })
      console.log(res)
      this.postDialogVisible = false;
      this.getPostList(this.queryInfo.pageNum)
    },
    // 监听页码值改变的事件
    async handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      await this.getPostList()
    },
    editComment(index) {
      this.commentDialogVisible = true;
      this.selectedFloor = index;
    },
    getfileData() {
      const token = window.sessionStorage.getItem('token')
      return {header: {
          'accesstoken': token
        }}
    },
    successUpload() {
      console.log('success')
    },
    async uploadImg(param){
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
        // 但是我们上传成功了图片， fileList 里面的值却没有改变，还好有on-change指令可以使用
      }).catch(response => {
        console.log('图片上传失败')
        param.onError()
      })
    },
    async postImg(param) {
      await this.$refs.upload.submit();
    },
    showComment(i) {
      this.showComments[i] = !this.showComments[i];
      console.log(this.showComments[i])
      this.$forceUpdate();
    },
    async postComment() {
      const token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      const post_id = this.postInfo[this.selectedFloor].post_id
      formData.append('post_id', post_id)
      formData.append('reply_content', this.commentContent)
      formData.append('username', this.username)
      const data = await this.$axios.post('/reply_insert', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      console.log(data)
      this.commentDialogVisible = false
      this.getPostList(this.queryInfo.pageNum)
    },
     async turnLike(index) {
      var dislikeNum = this.postInfo[index].give_dislike_number
      var flag = false
      this.like[index] = !this.like[index]
      if(this.like[index]) {
        if(this.dislike[index]){
          this.dislike[index] = false
          dislikeNum -= 1
          this.postInfo[index].give_dislike_number -= 1
          flag = true
        }
      }
      var num = this.postInfo[index].give_like_number
      if(this.like[index]) {
        num = num + 1
        this.postInfo[index].give_like_number += 1
      }
      else {
        num = num - 1
        this.postInfo[index].give_like_number -= 1
      }
      this.$forceUpdate()
      if(!this.like[index]) await this.changeLike(num, this.postInfo[index].post_id, 0)
      else await this.changeLike(num, this.postInfo[index].post_id, 1)
      if(flag) await this.changeDisLike(dislikeNum, this.postInfo[index].post_id, 0)
    },
    async turnDisLike(index) {
      var likeNum = this.postInfo[index].give_like_number
      var flag = false
      this.dislike[index] = !this.dislike[index]
      if(this.dislike[index]) {
        if(this.like[index]){
          this.like[index] = false
          likeNum -= 1
          this.postInfo[index].give_like_number -= 1
          flag = true
        }
      }
      var num = this.postInfo[index].give_dislike_number
      if(this.dislike[index]) {
        num = num + 1
        this.postInfo[index].give_dislike_number += 1
      }
      else {
        num = num - 1
        this.postInfo[index].give_dislike_number -= 1
      }
      this.$forceUpdate()
      if(!this.dislike[index]) await this.changeDisLike(num, this.postInfo[index].post_id, 0)
      else await this.changeDisLike(num, this.postInfo[index].post_id, 1)
      if(flag) await this.changeLike(likeNum, this.postInfo[index].post_id, 0)
    },
    async report(id) {
      const token = window.sessionStorage.getItem('item')
      const formData = new FormData()
      formData.append('post_id', id)
      const data = await this.$axios.post('/add_report', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      console.log(data)
    },
    async changeLike(num, id, judge) {
      var token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('post_id', id)
      formData.append('num', num)
      formData.append('judge', judge)
      const data = await this.$axios.post('/set_like', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      console.log(data)
    },
    async changeDisLike(num, id, judge) {
      var token = window.sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('post_id', id)
      formData.append('num', num)
      formData.append('judge', judge)
      const data = await this.$axios.post('/set_dislike', formData,
          {
            headers: {
              'accesstoken': token
            }
          })
      console.log(data)
    },
    async deletePost(post_id){
      // 传递查询参数
      const token = window.sessionStorage.getItem('token')
      const deleteForm = new FormData()
      deleteForm.append('id', post_id)
      console.log(post_id)
      const { data: res} = await this.$axios.post('/delete_content', deleteForm,
          {
            headers: {
              'accesstoken': token
            }
          })
      console.log(res)
      if(res !== 1) {
        return this.$message.error('队伍删除失败')
      }
      this.$message.success('队伍删除成功')
      // 获得队伍属性
      await this.getPostList();
},
    async deletePost (post_id) {
      console.log(post_id)
      // 传递查询参数
      const token = window.sessionStorage.getItem('token')
      const deleteForm = new FormData()
      deleteForm.append('post_id', post_id)
      const { data: res } = await this.$axios.post('/delete_content', deleteForm,
      {
        headers: {
          accesstoken: token
           }
           })
      console.log(res)
      if (res !== 1) {
        return this.$message.error('帖子删除失败')
      }
      this.$message.success('帖子删除成功')
      await this.getPostList()
},
    findLike(index) {
      return this.like[index]
    },
    findDislike(index) {
      return this.dislike[index]
    }
  },
  name: "personal_treeHole"
}
</script>

<style>
html,
body,
#app,
.tree {
  height:100%
}
.el-header {
  background-color: beige;
  display: flex;
  justify-content: space-between;
  align-items: center;
> div{
  display: flex;
  align-items: center;
}
}
.historyTreeHole{
  width: 100%;
  height: 100%;
}
.containers{
  width: 100%;
  height: 100%;
  padding-top: 20px;
}
.el-main {
  background-color: white;
}
.el-footer {
  background-color: darkgrey;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.p {
  color: green;
  font-size:25px;
}
.tree_main_card_word {
  width: 100%;
  height: 150px;/*先假设文字高度，真实文字高度由内容决定*/
}
.tree_main_card_frame {
  width: 100%;
  height: 40px;
}
</style>
