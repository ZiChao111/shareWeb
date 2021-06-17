<!--
 * @Author: your name
 * @Date: 2021-02-24 23:35:05
 * @LastEditTime: 2021-02-25 12:18:11
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \yuzhoujiandui\src\components\lostModule.vue
-->
<template>
  <div>
    <div class="tree_main"  v-for="(item, index) in postInfo">
      <!--          每件商品的卡片-->
      <el-card class="box-card-commodity">
        <!--            第一层信息，显示为卖主信息-->
        <div>
          <!--          头像-->
          <el-avatar :src="avatorSrc[index]"></el-avatar>
          <!--          用户名-->
          <span>{{item.username+' '}}</span>
          <!--          学校-->
          <span>{{item.tell_campus+'   '}}</span>
        </div>
        <!--          水平分割线-->
        <hr>
        <!--            第二层信息显示为商品信息+联系方式-->
        <div class="secondAspect">
          <!--              商品图片-->
          <span class="picture_item" style="display: block;width: 50%" float="left">
                <el-image
                    style="width: 150px; height: 100px"
                    :src="imgSrc[index]"
                    class="itemPicture"/>
              </span>
          <!--              文字信息-->
          <span class="information_item" style="display: block;width: 80%" float="right"
          >
                <el-card class="itemInformationCard">
                  <div class="itemInformation">
                    <span>{{'物品类别 ： '+item.symbol+' '}}</span>
                    <br>
                    <span>{{'物品名称 ： '+item.item_name+' '}}</span>
                    <br>
                    <span>{{'联系方式： '+item.connect_phone+' '}}</span>
                    <br>
                    <span>{{'联系人: '+item.connect_peo}}</span>
                    <br>
                    <span>{{'备注 ： '+item.instruction+' '}}</span>
                  </div>
                </el-card>
              </span>
        </div>
        <!--&lt;!&ndash;            点击按钮显示备注&ndash;&gt;-->
        <!--            <el-button type="text" icon="el-icon-s-comment"-->
        <!--                       round @click="showRemark(index)" class="remarkButton">备注<</el-button>-->
      </el-card>
      <!--              备注区，根据showRemarks数组切换是否可见-->
      <!--          <div  v-if="showRemarks[index]" :key="index" class="box-card-sort">-->
      <!--              <el-input v-model="item.remark" readonly type="textarea" autosize>-->
      <!--              </el-input>-->
      <!--          </div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "lostModule",
  data () {
    return {
    }
  },
  props: {
    postInfo: {},
    imgSrc: {},
    avatorSrc: {}
  }
}
</script>

<style scoped>
/*商品图片*/
.itemPicture{
  width: 40%;
  float: left;
}
</style>
