import Vue from 'vue';
import VueRouter from 'vue-router';
import Meta from 'vue-meta';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';

Vue.use(VueRouter);
Vue.use(Meta);

// main layout
const MainLayout = import('./views/MainLayout.vue');

// without authentication
const Login = import('./views/auth/Login');
const RequestRegistration = import("./views/auth/RequestRegistration.vue");
const CompleteRegistration = import("./views/auth/CompleteRegistration.vue");
const ForgotPassword = import("./views/auth/ForgotPassword.vue");
const ResetPassword = import("./views/auth/ResetPassword.vue");
const AcceptInvitation = import("./views/auth/AcceptInvitation.vue");

// with authentication
const Dashboard = import('./views/Dashboard.vue');
const Product = import('./views/product/Index.vue');

// error pages
const ServerError = import('./views/errors/ServerError');
const NotFoundPage = import('./views/errors/404NotFound');

const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => Login
    },
    {
      path: '/request-registration',
      name: 'requestRegistration',
      component: () => RequestRegistration
    },
    {
      path: '/complete-registration',
      name: 'completeRegistration',
      component: () => CompleteRegistration
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: () => ForgotPassword
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: () => ResetPassword
    },
    {
      path: '/accept-invitation',
      name: 'acceptInvitation',
      component: () => AcceptInvitation
    },
    {
      path: '/:sid/app',
      name: 'app',
      component: () => MainLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => Dashboard
        },
        {
          path: 'products',
          name: 'products',
          component: () => Product
        },
      ]
    },
    {
      path: '/error',
      component: () => ServerError
    },
    {
      path: '*',
      component: () => NotFoundPage
    }
  ]
});

import Consts from './helpers/consts';
import store from './store';

router.beforeEach((to, from, next) => {
  if (to.name) NProgress.start();

  if (to.path == '' || to.path == '/') {
    return next({ name: 'login'});
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {

    let sessions = store.get('session/sessions');
    if (!sessions) {

      sessions = JSON.parse(localStorage.getItem(Consts.keys.SESSIONS));
      if (sessions && sessions.length > 0) {
        store.set('session/sessions', sessions, 0);
      }
    }

    if (!sessions || sessions.length < 1) {
      return next({ name: 'login'});
    }

    const sid = to.params.sid;
    if (!sid || sid < 0 || sid >= sessions.length) {
      store.set('session/session', sessions[0]);
    } else if (! store.get('session/session')) {
      store.set('session/session', sessions[sid]);
    }
  
  }
  next();
/*
  let sid = to.params.sid;
  if (!sid || sid < 0 || sid >= sessions.length) {
    store.set('session/session', sessions[0]);
    const newPath = to.path.replace('/'+to.params.sid+'/', '/0/');
    document.location.href = newPath;
  }
*/
  //  if (to.params.sid && to.params.sid > sessions.length) {
//  }

});

router.afterEach(() => {
  NProgress.done();
});

export default router;
