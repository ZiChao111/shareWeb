<template>
  <div class="successInfo" style="position: center">
    <div class="imgContainer" style="width: 25px; height: 25px">
    </div>
    <div class="textContainer">
      <span>
        邮箱验证成功,点击
        <router-link to="/login">此处</router-link>登录
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "success"
}
</script>

<style scoped>
.successInfo {
  width: 250px;
  height: 150px;
  position: absolute;
  left: 50%;
  top: 25%;
  transform: translate(-50%, -50%);
}

.imgContainer {
  background: url("../assets/success.png") no-repeat;
  background-size: cover;
}
</style>
