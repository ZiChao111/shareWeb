<template>
  <div class="container">
    <div class="box">
      <el-container>
        <el-main>
          <!--          导航栏-->
          <div class="container_main_1">
            <div class="container_main_1_1"  v-for="(item, index) in postInfo">
              <div class="container_main_1_1_touxiang">
                <el-avatar :src="avatorSrc"></el-avatar>
                <el-button type="text" icon="el-icon-delete" circle style="padding-left: 34%"
                               @click="deletePost(item.work_id, index)">删除</el-button>
                <br>
                <span>{{item.username}}&nbsp</span>
                <br>
                <span>联系方式：{{item.contact}}</span>
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
      </el-container>
    </div>
  </div>

</template>

<script>
export default {
  name: 'market',
  data() {
    return {
      username: '',
      avatorSrc: '',
      postInfo:[
        {
          isAnonymous: false,
          username: '李白',
          contact: '111',  //联系方式
          sex: '女',  //性别
          intention: '家教',  //意向
          startTime: '20210105', //兼职时间
          endTime: '20210304',
          type: '在读本科',  //学历
          remark: '本人英语极不优秀',  //备注
          school: '青岛大学'
        }
      ]
    }
  },
  async created() {
    this.username = await window.localStorage.getItem('username')
    console.log(this.username)
    this.avatorSrc = await this.getAvatorSrc(this.username)
    await this.getPostlist()
    console.log(this.postInfo)
  },
  methods: {
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
    async getPostlist() {
      const token = window.sessionStorage.getItem('token');
      const {data : res} = await this.$axios.post('work/getSelf', {
        headers: {
          'accesstoken': token
        }
      });
      this.postInfo = res
    },
   async deletePost(post_id){
      // 传递查询参数
      const token = window.sessionStorage.getItem('token')
      const deleteForm = new FormData()
      deleteForm.append('work_id', post_id)
      console.log(post_id)
      const { data: res} = await this.$axios.post('/work/delete', deleteForm,
          {
            headers: {
              accesstoken: token
            }
          })
      console.log(res)
      if(res !== 1) {
        return this.$message.error('队伍删除失败')
      }
      this.$message.success('队伍删除成功')
      // 获得队伍属性
      await this.getPostlist();
},
    async deletePost (post_id, index) {
      console.log(post_id)
      // 传递查询参数
      const token = window.sessionStorage.getItem('token')
      const deleteForm = new FormData()
      deleteForm.append('work_id', post_id)
      const { data: res } = await this.$axios.post('/work/delete', deleteForm,
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
      this.postInfo.splice(index, 1)
      this.$forceUpdate()
}
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.container {
  background-color: #f5f5f5;
}
.box {
  background-color:#DCDCDC;
  margin: 0 auto;
  width: 1180px;
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
</style>

