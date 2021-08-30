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
          component: () => import('./views/super/Dashboard.vue')
        },
        {
          name: 'sys-links',
          path: 'links',
          component: () => import('./views/super/link/Index.vue')
        },
        {
          name: 'sys-accounts',
          path: 'accounts',
          component: () => import('./views/super/account/Index.vue')
        },
        {
          name: 'sys-account-details',
          path: 'account-details/:aid',
          component: () => import('./views/super/account/details/Index.vue')
        },
        {
          name: 'sys-account-logs',
          path: 'account-logs/:aid',
          component: () => import('./views/super/account/AccessLogIndex.vue')
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
          name: 'dashboard',
          path: 'dashboard',
          component: () => import('./views/dashboard/Index.vue')
        },
        {
          name: 'groups',
          path: 'groups',
          component: () => import('./views/group/Index.vue')
        },
        {
          name: 'group',
          path: 'group/:id',
          component: () => import('./views/group/Detail.vue')
        },
        {
          name: 'plans',
          path: 'plans',
          component: () => import('./views/plans/Index.vue')
        },
        {
          name: 'subscription',
          path: 'subscription',
          component: () => import('./views/subscription/Index.vue')
        },
        {
          name: 'alarm',
          path: 'alarm',
          component: () => import('./views/alarm/Index.vue')
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
          name: 'coupons',
          path: 'coupons',
          component: () => import('./views/coupons/Index.vue')
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
          name: 'account-settings',
          path: 'account-settings',
          component: () => import('./views/account/Index.vue'),
          meta: {
            requiresAdminOrSuperUser: true
          },
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
    if (CURSTAT.role !== 'ADMIN' && CURSTAT.role !== 'SUPER') {
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
