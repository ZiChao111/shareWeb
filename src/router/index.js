import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../components/homePage'
import TreeHole from '../components/treehole'
import Market from '../components/market'
import PTJob from '../components/partTime_job'
import LAF from '../components/lostAndFound'
import Aid from '../components/mutualAid'
import Login from '../components/login'
import VerifyInfo from '../components/success'
import Register from '../components/register'
import Find from '../components/findModule'
import Lost from '../components/lostModule'
import PersonalCenter from '../components/personalCenter'
import Personal_information from '../components/personal_information'
import Personal_treeHole from '../components/personal_treeHole'
import Personal_lostAndFoundRecord from '../components/personal_lostAndFoundRecord'
import Personal_organizeTeams from '../components/personal_organizeTeams'
import Personal_transactionRecord from '../components/personal_transactionRecord'
import Personal_LAndF from '../components/personal_lostAndFoundRecord'
import Personal_lost from '../components/personalLostModule'
import Personal_find from '../components/personalLostModule'
import Personal_parttimeJob from '../components/personal_partime_job'
import ManagerLogin from '../managerComponents/managerLogin'
import ManagerCenter from '../managerComponents/managerCenter.vue'
import ManagerCenter_lostAndFoundRecord from '../managerComponents/managerCenter_lostAndFoundRecord.vue'
import ManagerCenter_organizeTeams from '../managerComponents/managerCenter_organizeTeams.vue'
import ManagerCenter_transactionRecord from '../managerComponents/managerCenter_transactionRecord.vue'
import ManagerCenter_treeHolePost from '../managerComponents/managerCenter_treeHolePost.vue'
import ManagerCenter_userInformation from '../managerComponents/managerCenter_userInformation.vue'
import ManagerCenter_job from '../managerComponents/managerCenter_job.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/verifySuccess', component: VerifyInfo },
  { path: '/home', component: HomePage },
  { path: '/treehole', component: TreeHole },
  { path: '/market', component: Market },
  { path: '/job', component: PTJob },
  { path: '/laf',
    component: LAF,
    redirect: '/lost',
    children: [
      { path: '/lost', component: Lost },
      { path: '/find', component: Find }
        ]
  },
  { path: '/aid', component: Aid },
  { path: '/register', component: Register },
  {
      path: '/personalCenter',
      component: PersonalCenter,
      redirect: '/personal_information',
      children: [
      { path: '/personal_information', component: Personal_information },
      { path: '/personal_treeHole', component: Personal_treeHole },
      { path: '/personal_lostAndFoundRecord',
        component: Personal_lostAndFoundRecord,
        redirect: '/personal_lost',
        children: [
          { path: '/personal_lost', component: Personal_lost },
          { path: '/personal_find', component: Personal_find }
        ]},
      { path: '/personal_organizeTeams', component: Personal_organizeTeams },
      { path: '/personal_transactionRecord', component: Personal_transactionRecord },
      { path: '/personal_partimejob', component: Personal_parttimeJob }
      ]
    },
    { path: '/managerLogin', component: ManagerLogin },
      {
        path: '/managerCenter',
        component: ManagerCenter,
        redirect: '/managerCenter_userInformation',
        children: [
          { path: '/managerCenter_lostAndFoundRecord', component: ManagerCenter_lostAndFoundRecord },
          { path: '/managerCenter_organizeTeams', component: ManagerCenter_organizeTeams },
          { path: '/managerCenter_transactionRecord', component: ManagerCenter_transactionRecord },
          { path: '/managerCenter_treeHolePost', component: ManagerCenter_treeHolePost },
          { path: '/managerCenter_userInformation', component: ManagerCenter_userInformation },
          { path: '/managerCenter_job', component: ManagerCenter_job }
        ]
      }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (to.path === '/treehole') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/market') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/aid') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/managerCenter_lostAndFoundRecord') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/managerCenter_organizeTeams') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/managerCenter_transactionRecord') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/managerCenter_treeHolePost') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/managerCenter_userInformation') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/managerCenter_job') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/personal_treeHole') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/personal_information') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/personal_transactionRecord') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/personal_organizeTeams') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/personal_partimejob') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/personal_lost') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/personal_find') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/lost') {
    if (!tokenStr) return next('/login')
  }
  if (to.path === '/find') {
    if (!tokenStr) return next('/login')
  }
  next()
})


export default router
