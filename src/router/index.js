import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/basic',
    component: Layout,
    name: '基础信息',
    alwaysShow: true,
    meta: {
      title: '基础信息',
      icon: 'list',
      meta: {
        permission: '/basic'
      }
    },
    children: [
      {
        path: 'basic/admin',
        name: 'Admin',
        component: () => import('@/views/basic/admin'),
        meta: { title: '管理员', icon: 'people', permission: '/basic/admin/table' }
      },
      {
        path: 'basic/role',
        name: 'Role',
        component: () => import('@/views/basic/role'),
        meta: { title: '角色', icon: 'peoples', permission: '/basic/role/table' }
      },
      {
        path: 'basic/permission',
        name: 'Permission',
        component: () => import('@/views/basic/permission'),
        meta: { title: '权限', icon: 'lock', permission: '/basic/permission/tree' }
      }
    ]
  },
  {
    path: '/room',
    component: Layout,
    name: '客房管理',
    alwaysShow: true,
    meta: {
      title: '客房管理',
      icon: 'list',
      meta: {
        permission: '/room'
      }
    },
    children: [
      {
        path: 'room/room_type',
        name: 'RoomType',
        component: () => import('@/views/room/type'),
        meta: { title: '房型', icon: 'people', permission: '/room/type/table' }
      },
      {
        path: 'room/room',
        name: 'Room',
        component: () => import('@/views/room/room'),
        meta: { title: '房间', icon: 'people', permission: '/room/room/table' }
      },
      {
        path: 'room/room_spec',
        name: 'Room',
        component: () => import('@/views/room/spec'),
        meta: { title: '规格', icon: 'people', permission: '/room/spec/table' }
      }
    ]
  },
  {
    path: '/housing',
    component: Layout,
    name: '入住管理',
    alwaysShow: true,
    meta: {
      title: '入住管理',
      icon: 'list',
      meta: {
        permission: '/housing'
      }
    },
    children: [
      {
        path: 'housing/open_room',
        name: 'openRoom',
        component: () => import('@/views/housing/open'),
        meta: { title: '开房', icon: 'people', permission: '/housing/open/index' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
