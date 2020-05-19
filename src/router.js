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
      name: 'app',
      path: '/:sid/app',
      component: () => import('./views/MainLayout.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          name: 'dashboard',
          path: 'dashboard',
          component: () => import('./views/Dashboard.vue')
        },
        {
          name: 'products',
          path: 'products',
          component: () => import('./views/product/Index.vue')
        },
        {
          name: 'import-csv',
          path: 'import/csv',
          component: () => import('./views/product_import/CSV.vue')
        },
        {
          name: 'import-ebay-sku',
          path: 'import/ebay-sku',
          component: () => import('./views/product_import/EbaySKU.vue')
        },
        {
          name: 'import-amazon-asin',
          path: 'import/amazon-asin',
          component: () => import('./views/product_import/AmazonASIN.vue')
        },
        {
          name: 'imported-prods',
          path: 'import/products',
          component: () => import('./views/product_import/ImportedProducts.vue')
        },
        {
          name: 'links',
          path: 'product/links/:prod_id',
          component: () => import('./views/product/Links.vue')
        },
        {
          name: 'settings',
          path: 'settings',
          component: () => import('./views/user/Index.vue')
        },
        {
          name: 'companySettings',
          path: 'company-settings',
          component: () => import('./views/company/Index.vue')
        },
      ]
    },
    {
      path: '/error',
      component: () => import('./views/errors/ServerError')
    },
    {
      path: '*',
      component: () => import('./views/errors/404NotFound')
    }
  ]
});

import store from './store';
import SystemConsts from '@/data/system';

const SESSION = 'session/session';
const SESSIONS = SESSION+'s';

router.beforeEach((to, from, next) => {
  if (to.name) NProgress.start();

  if (to.path == '' || to.path == '/') return next({ name: 'login' });
  if (to.name == 'login' && to.query.m == 'addNew') return next();
  if (to.matched.some(record => record.meta.openToPublic)) return next();

  let sessions = store.get(SESSIONS);

  if (!sessions || !sessions.length) {
    sessions = JSON.parse(localStorage.getItem(SystemConsts.keys.SESSIONS));
    if (sessions && sessions.length > 0) {
      store.set(SESSIONS, sessions);
    }
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (sessions && sessions.length > 0) {

      const sid = to.params.sid;
      if (sid == undefined || sid < 0 || sid >= sessions.length) {
        store.set(SESSION, sessions[0]);
        const newPath = to.path.replace(`/${to.params.sid}/`, '/0/');
        return next(newPath);
      } else {
        const session = store.get(SESSION);
        if (Object.keys(session).length == 0) {
          store.set(SESSION, sessions[sid]);
        }
      }
    } else {
      return next({ name: 'login' });
    }
  } 

  if (to.name == 'login' && (sessions && sessions.length > 0)) {
    return next({ name: 'dashboard', params: { sid: 0 } });
  }

  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
