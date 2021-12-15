import Vue from 'vue';
import VueRouter from 'vue-router';
import Meta from 'vue-meta';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';

Vue.use(VueRouter);
Vue.use(Meta);

const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes: [
    {
      name: 'login',
      path: '/login',
      component: () => import('./views/auth/Login')
    },
    {
      name: 'requestRegistration',
      path: '/request-registration',
      component: () => import("./views/auth/RequestRegistration.vue"),
      meta: {
        openToPublic: true
      }
    },
    {
      name: 'completeRegistration',
      path: '/complete-registration',
      component: () => import("./views/auth/CompleteRegistration.vue"),
      meta: {
        openToPublic: true
      }
    },
    {
      name: 'forgotPassword',
      path: '/forgot-password',
      component: () => import("./views/auth/ForgotPassword.vue"),
      meta: {
        openToPublic: true
      }
    },
    {
      name: 'resetPassword',
      path: '/reset-password',
      component: () => import("./views/auth/ResetPassword.vue"),
      meta: {
        openToPublic: true
      }
    },
    {
      name: 'acceptInvitation',
      path: '/accept-invitation',
      component: () => import("./views/auth/AcceptInvitation.vue"),
      meta: {
        openToPublic: true
      }
    },
    {
      name: 'sys',
      path: '/:sid/sys',
      component: () => import('./views/Layout.vue'),
      meta: {
        requiresAuth: true,
        requiresSuper: true
      },
      children: [
        {
          name: 'sys-dashboard',
          path: 'dashboard',
          component: () => import('./views/super/dashboard/Index.vue')
        },
        {
          name: 'sys-links',
          path: 'links',
          component: () => import('./views/super/link/Index.vue')
        },
        {
          name: 'sys-workspaces',
          path: 'workspaces',
          component: () => import('./views/super/workspace/Index.vue')
        },
        {
          name: 'sys-workspace-logs',
          path: 'workspace-logs/:aid',
          component: () => import('./views/super/workspace/AccessLogIndex.vue')
        },
        {
          name: 'sys-users',
          path: 'users',
          component: () => import('./views/super/user/Index.vue')
        },
        {
          name: 'sys-user-details',
          path: 'user-details/:uid',
          component: () => import('./views/super/user/details/Index.vue')
        },
        {
          name: 'sys-tickets',
          path: 'tickets',
          component: () => import('./views/super/ticket/Index.vue')
        },
        {
          name: 'sys-ticket-details',
          path: 'sys-ticket-details/:ticketId',
          component: () => import('./views/super/ticket/Details.vue')
        },
        {
          name: 'sys-announces',
          path: 'announces',
          component: () => import('./views/super/announce/Index.vue')
        },
        {
          name: 'sys-platforms',
          path: 'platforms',
          component: () => import('./views/super/platform/Index.vue')
        },
        {
          name: 'sys-user-logs',
          path: 'user-logs/:uid',
          component: () => import('./views/super/user/AccessLogIndex.vue')
        },
      ]
    },
    {
      name: 'app',
      path: '/:sid/app',
      component: () => import('./views/Layout.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: () => import('./views/dashboard/Welcome.vue')
        },
        {
          name: 'dashboard',
          path: 'dashboard',
          component: () => import('./views/dashboard/Index.vue')
        },
        {
          name: 'products',
          path: 'products',
          component: () => import('./views/product/Index.vue')
        },
        {
          name: 'product',
          path: 'product/:id',
          component: () => import('./views/product/Detail.vue')
        },
        {
          name: 'categories',
          path: 'categories',
          component: () => import('./views/category/Index.vue')
        },
        {
          name: 'alarms',
          path: 'alarms',
          component: () => import('./views/alarm/Index.vue')
        },
        {
          name: 'alarm',
          path: 'alarm/:id',
          component: () => import('./views/alarm/Detail.vue')
        },
        {
          name: 'smart-prices',
          path: 'smart-prices',
          component: () => import('./views/smartprice/Index.vue')
        },
        {
          name: 'smart-price',
          path: 'smart-price/:id',
          component: () => import('./views/smartprice/Detail.vue')
        },
        {
          name: 'brands',
          path: 'brands',
          component: () => import('./views/brand/Index.vue')
        },
        {
          name: 'subscription',
          path: 'subscription',
          component: () => import('./views/subscription/Index.vue')
        },
        {
          name: 'ticket',
          path: 'ticket',
          component: () => import('./views/ticket/Index.vue')
        },
        {
          name: 'ticket-detail',
          path: 'ticket-detail/:ticketId',
          component: () => import('./views/ticket/Details.vue')
        },
        {
          name: 'announce',
          path: 'announce',
          component: () => import('./views/announce/Index.vue')
        },
        {
          name: 'imbort',
          path: 'imbort',
          component: () => import('./views/exim/imbort/Index.vue')
        },
        {
          name: 'exbort',
          path: 'exbort',
          component: () => import('./views/exim/exbort/Index.vue')
        },
        {
          name: 'vouchers',
          path: 'vouchers',
          component: () => import('./views/vouchers/Index.vue')
        },
        {
          name: 'links',
          path: 'links',
          component: () => import('./views/link/Index.vue')
        },
        {
          name: 'link',
          path: 'link/:id',
          component: () => import('./views/link/detail/Index.vue')
        },
        {
          name: 'user-settings',
          path: 'user-settings',
          component: () => import('./views/user/Index.vue')
        },
        {
          name: 'workspace-settings',
          path: 'workspace-settings',
          component: () => import('./views/workspace/Index.vue'),
          meta: {
            requiresAdminOrSuperUser: true
          },
        },
        {
          name: 'product-reports',
          path: 'product-reports',
          component: () => import('./views/reports/Product.vue')
        },
        {
          name: 'link-reports',
          path: 'link-reports',
          component: () => import('./views/reports/Link.vue')
        },
        {
          name: 'payment-ok',
          path: 'payment-ok/:hash',
          component: () => import('./views/app/PaymentOK'),
        },
        {
          name: 'payment-cancel',
          path: 'payment-cancel/:hash',
          component: () => import('./views/app/PaymentCancel'),
        },
      ]
    },
    {
      name: 'error',
      path: '/error',
      component: () => import('./views/errors/ServerError'),
    },
    {
      name: 'forbidden',
      path: '/forbidden',
      component: () => import('./views/errors/Forbidden'),
    },
    {
      path: '*',
      component: () => import('./views/errors/404NotFound')
    }
  ]
});

import store from './store';
import SystemConsts from '@/data/system';

router.beforeEach((to, from, next) => {
  if (to.name) NProgress.start();

  if (to.path == '' || to.path == '/') return next({ name: 'login' });
  if (to.name == 'login' && to.query.m == 'addNew') return next();
  if (to.matched.some(record => record.meta.openToPublic)) return next();

  let sesList = store.get('session/getSessionList');

  if (!sesList || !sesList.length) {
    sesList = JSON.parse(localStorage.getItem(SystemConsts.KEYS.SESSIONS));
    if (sesList && sesList.length > 0) {
      const suitableData = { sessions: sesList, no: to.params.sid };
      store.set('session/list', suitableData);
    }
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (sesList && sesList.length > 0) {
      const sid = to.params.sid;
      if (sid == undefined || sid < 0 || sid >= sesList.length) {
        store.set('session/CURRENT', sesList[0]);
        const newPath = to.path.replace(`/${to.params.sid}/`, '/0/');
        return next(newPath);
      } else {
        const session = store.get('session/getCurrentStatus');
        if (!session || Object.keys(session).length == 0) {
          store.set('session/CURRENT', sesList[sid], sid);
        }
      }
    } else {
      return next({ name: 'login' });
    }
  }

  if (to.matched.some(record => record.meta.requiresAdminOrSuperUser)) {
    const CURSTAT = store.get('session/getCurrentStatus');
    if (CURSTAT.email !== 'demo@inprice.io' && CURSTAT.role !== 'ADMIN' && CURSTAT.role !== 'SUPER') {
      return next({ name: 'forbidden' });
    }
  }

  if (to.matched.some(record => record.meta.requiresSuper)) {
    const CURSTAT = store.get('session/getCurrentStatus');
    if (CURSTAT.role != 'SUPER') {
      return next({ name: 'forbidden' });
    }
  }

  if (to.name == 'login' && (sesList && sesList.length > 0)) {
    return next({ name: 'dashboard', params: { sid: 0 } });
  }

  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
