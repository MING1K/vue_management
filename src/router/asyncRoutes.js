export const asyncRoutes = [
  {
    path: '/userauth',
    component: () => import('@/layout/index.vue'),
    redirect: '/userauth/user',
    name: 'Acl',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/userauth/user/index'),
        name: 'User',
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        component: () => import('@/views/userauth/role/index'),
        name: 'Role',
        meta: { title: '角色管理' }
      },
      {
        path: 'menu',
        component: () => import('@/views/userauth/menu/index'),
        name: 'Permission',
        meta: { title: '菜单管理' }
      }
    ]
  },
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    redirect: '/product/tradeMark',
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'el-icon-goods'
    },
    children: [
      {
        path: 'tradeMark',
        component: () => import('@/views/product/tradeMark/index'), // Parent router-view
        name: 'Trademark',
        meta: { title: '品牌管理' }
      },
      {
        path: 'attr',
        component: () => import('@/views/product/attr/index'),
        name: 'Attr',
        meta: { title: '售卖属性' }
      },
      {
        path: 'spu',
        component: () => import('@/views/product/spu/index'),
        name: 'Spu',
        meta: { title: 'Spu管理' }
      },
      {
        path: 'sku',
        component: () => import('@/views/product/sku/index'), // Parent router-view
        name: 'Sku',
        meta: { title: 'Sku管理' }
      }
    ]
  }
]
