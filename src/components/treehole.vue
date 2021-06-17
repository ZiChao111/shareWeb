<template>
  <div class="tree">
    <el-container  >
      <!--    回到顶部-->
      <el-backtop :bottom="100">
        <div class="top">Top</div>
      </el-backtop>
      <!--    头部区域-->
      <el-header class="el-header">
       <div class="treeHole_img">
         <img src="../assets/image/treeHole.jpeg" class="treeHole_img_img">
       </div>
        <!--        按钮区域-->
        <span style="display:inline-block;width:270px;font-weight:bold;margin-bottom: 90px" class="tree_head_span_search">
            <img src="../assets/questionMark.png" alt=""
               @click="changeDetailVisible"
               style="width: 20px; height: 20px; margin-right: 20px">
           <el-button type="text" @click="pathTo('/home')">返回主页</el-button>
           <el-button type="text" @click="pathTo('/personal_information')">个人中心</el-button>
           <el-button type="text" @click="quit()">账号退出</el-button>
        </span>
      </el-header>
      <!--    页面主体区域-->
      <el-container >
        <!--       侧边栏区域，导航菜单-->
        <el-aside class="el-aside" width="200px">
          <el-menu
              background-color="#f5f5f5" text-color="blue"
              active-text-color="#ffd04b"
              default-active="1">
            <el-menu-item index="1" @click="getNew()">最新</el-menu-item>
            <el-menu-item index="2" @click="getHot()">热门</el-menu-item>
            <el-menu-item index="5" @click="pathTo('/personal_information')"><a>个人中心</a></el-menu-item>
          </el-menu>
        </el-aside>
        <el-container style=" background-color: #f5f5f5" direction="vertical">
          <!--        中心区域-->
          <el-main class="el-main" >
<!--            postInfo存储获得帖子信息-->
            <div class="tree_main"  v-for="(item, index) in postInfo">
              <el-card class="tree_main_card">
<!--                依次展示发帖人头像，发帖时间，用户名等-->
                <el-avatar :src="avatarSrc[index]" :key="avatarSrc[index]" fit="cover"></el-avatar>
                <span style="margin-left: 20px">{{item.username}}   </span>
                <span>{{item.post_time}}</span>
                <button @click="report(item.post_id)" style="margin-left: 700px">投诉帖子</button>
                <hr>
                <h2>{{item.post_title}}</h2>
                <div class="tree_main_card_word">{{item.post_content}}</div>
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
                  <div class="postButton">
                  <el-button type="primary" icon="el-icon-edit" round @click="editComment(index)">评论</el-button>
                  <el-button type="primary" icon="el-icon-s-comment" round @click="showComment(index)">详情</el-button>
                  </div>
                </div>
              </el-card>
<!--              评论区，根据showComment数组切换是否可见-->
              <div  v-if="showComments[index]" :key="index">
                <div class="commentContainer" v-for="(subItem, subIndex) in comments[index]">
                  <el-avatar :src="commentsAvatar[index][subIndex]" fit="cover"></el-avatar>
                  <span>{{subItem.username}}</span>
                  <span>{{subItem.reply_time}}</span>
                  <el-input v-model="subItem.reply_content" readonly>
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
              <!--          getPostList函数依照queryInfo的两个信息获取帖子列表，keyword是搜索框里的关键字，pageNum是页码-->
              <el-button slot="append" icon="el-icon-search" @click="this.module === '新' ? getPostList : getPostListByHot">搜索</el-button>
            </el-input>
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
      </el-container>
    </el-container>
<!--    发帖对话框-->
    <el-dialog
        title="Your voice"
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
        标题：<el-input v-model="postTitle"  placeholder="请输入标题(20字以内)" style="width: 80%;margin-bottom: 10px;margin-top: 10px"
        ref="titleRef"></el-input>
        <el-input v-model="postContent" type="textarea" rows="6" placeholder="请输入内容"
                  maxlength="500" show-word-limit style="margin-bottom: 15px" ref="contentRef"></el-input>
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
    <el-dialog
        :visible.sync="detailDialogVisible">
      <h2>七条底线</h2>
      1.法律法规底线：有法可依、有法必依、执法必严、违法必究，任何时候，无论是网上网下，都将始终做到违法必究；<br>
      2.社会主义制度底线，为我们全面建成小康社会提供了有力地制度保障，我们要积极拥护社会主义及社会主义制度；<br>
      3.国家利益底线，作为国家公民，时刻维护我们伟大祖国的利益，这也是宪法赋予我们每位公民的光荣义务；<br>
      4.公民合法权益底线，我们在网络反腐的同时，切记不能以“艳照”等不健康、不正当甚至违法手段对别人进行人身攻击，否则不仅触犯法律，也侵犯了无辜者的合法权益；<br>
      5.社会公共秩序底线，网络世界必须也要遵循一定的秩序规则，唯有如此大家才能营造一个良好健康的网络环境；<br>
      6.道德风尚底线，崇尚美德在我国延续几千年的优秀传统，网络空间里也要讲道德，不做有违道德之事；<br>
      7.信息真实性底线，要求我们在上网时一定要实事求是，而不能以讹传讹、散发谣传，积极宣传政府部门发布的真实信息。<br>
      <h2>Tips</h2>
      1.用户可对帖子进行点赞or点踩 <br>
      2.用户可通过投诉帖子对帖子进行投诉，管理员会对投诉次数打到一定次数的帖子进行审查 <br>
      3.帖子投诉次数达到一定次数将无法在用户界面显示<br>
      4.请勿触碰七条底线（详情见主页面）<br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDetailVisible">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detailDialogVisible: false, 
      module: '新',
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
      postInfo:[
      ],
      avatarSrc:[
      ],
      comments: [
      ],
      commentsAvatar: [],
      //测试数据
      imgUrl: '',
    }
  },
  async created() {
    this.username = window.localStorage.getItem('username')
    await this.getPostList(1)
    this.$forceUpdate()
  },
  methods: {
    changeDetailVisible() {
      this.detailDialogVisible = !this.detailDialogVisible
    },
    //回到主页面
    pathTo(path){
      this.$router.push({
        path: path
      })
    },
    //根据用户名获取头像并赋值给对应的变量
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
      const data = await this.$axios.post('/get_content',formData,
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
        var i = 0
        this.commentsAvatar[j] = new Array()
        for(; i < this.comments[j].length; i++)
        {
         this.commentsAvatar[j][i] =  await this.getAvatarSrc(this.comments[j][i].username)
        }
        console.log(this.commentsAvatar[j])
        var name = this.postInfo[j].username
        this.avatarSrc[j] = await this.getAvatarSrc(name)
      }
      const {data: num} = await this.$axios.post('/get_content_number', formData);
      console.log(num)
      this.total = num
      console.log(this.avatarSrc)
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
      if(this.postTitle === '') {
        return this.$message.warning("标题不能为空")
      }
      if(this.postContent === '') {
        return this.$message.warning("内容不能为空")
      }
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
      this.postTitle = ''
      this.postContent = ''
    },
    // 监听页码值改变的事件
    async handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      if (this.module = '新') await this.getPostList()
      else await this.getPostListByHot()
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
    // 发送评论
    async postComment() {
      if(this.commentContent === '') {
        return this.$message.warning("评论不能为空")
      }
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
      await this.module === '热' ? this.getHot() : this.getNew()
      this.commentDialogVisible = false
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
    // 投诉
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
      if(data.status !== 200)
      {
        return this.$message.error('投诉失败')
      }
      this.$message.success('投诉成功')

    },
    // 赞踩转换
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
    findLike(index) {
      return this.like[index]
    },
    findDislike(index) {
      return this.dislike[index]
    },
    async getPostListByHot() {
      const formData = new FormData()
      formData.append('pagenum', this.queryInfo.pageNum)
      formData.append('queryInfo', this.queryInfo.keyword)
      const token = window.sessionStorage.getItem('token')
      const data = await this.$axios.post('content/getlike',formData,
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
        var i = 0
        this.commentsAvatar[j] = new Array()
        for(; i < this.comments[j].length; i++)
        {
         this.commentsAvatar[j][i] =  await this.getAvatarSrc(this.comments[j][i].username)
        }
        console.log(this.commentsAvatar[j])
        var name = this.postInfo[j].username
        this.avatarSrc[j] = await this.getAvatarSrc(name)
      }
      const {data: num} = await this.$axios.post('content/getlike_number', formData);
      console.log(num)
      this.total = num
      console.log(this.avatarSrc)
    },
    // 最新or 最热
    async getHot() {
      this.module = '热'
      this.queryInfo.keyword = ''
      this.queryInfo.pageNum = 1
      await this.getPostListByHot()
      this.$forceUpdate()
    },
    async getNew() {
      this.module = '新'
      this.queryInfo.keyword = ''
      this.queryInfo.pageNum = 1
      await this.getPostList()
      this.$forceUpdate()
    },
    quit() {
      window.sessionStorage.clear()
      this.$router.push('/')
    }
  }
}

</script>

<style land="less" scoped>
/*html,*/
/*body,*/
/*#app,*/
.tree {
  height:100%;
  background-color: #f5f5f5;
}
.el-header {
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 150px !important;
/*> div{*/
/*  display: flex;*/
/*  align-items: center;*/
/*}*/
}
/*图片*/
.treeHole_img {
  float: left;
  display: inline-block;
  width: 100px;
  height: 150px;
  margin-left: 100px;
}
/*图片*/
.treeHole_img_img {
  display: inline-block;
  width: 100px;
  margin-top: 20px;
}
.el-aside {
  background-color: #f5f5f5;
}
.el-main {
  width: 90%;
  background-color: #f5f5f5;
}
.el-footer {
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
}
p {
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
.postButton {
  float: right;
}
</style>