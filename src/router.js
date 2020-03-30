import Vue from 'vue';
import VueRouter from 'vue-router';
import Meta from 'vue-meta';
import NProgress from 'nprogress';

import SessionService from './service/session-service';

// import goTo from 'vuetify/es5/services/goto'
import 'nprogress/nprogress.css';

Vue.use(VueRouter);
Vue.use(Meta);

// main layout
const MainLayout = import('./views/MainLayout.vue');

// without authentication
const Login = import('./views/auth/Login');
const Register = import("./views/auth/Register.vue");
const ForgotPassword = import("./views/auth/ForgotPassword.vue");
const ResetPassword = import("./views/auth/ResetPassword.vue");

// with authentication
const Dashboard = import('./views/Dashboard.vue');
const Product = import('./views/product/Index.vue');

// error pages
const ServerError = import('./views/errors/ServerError');
const NotFoundPage = import('./views/errors/404NotFound');

const router = new VueRouter({
  // scrollBehavior: () => {
  //   return goTo(0)
  // },  
  base: '/',
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => Login
    },
    {
      path: '/register',
      name: 'register',
      component: () => Register
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
      path: '/app',
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


router.beforeEach((to, from, next) => {
  if (to.name) NProgress.start();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const loggedIn = !!SessionService.getAccessToken();
    if (!loggedIn) {
      if (from.name != 'login') {
        next({ name: 'login' });
      } else {
        NProgress.done();
        next();
      }
    } else {
      const userRole = SessionService.getUserRole();
      if (to.matched.some((record) => record.meta.is_admin)) {
        if (userRole === 'ADMIN' || to.name == 'dashboard') {
          next();
        } else {
          next({ name: 'dashboard' });
        }
      } else {
        next();
      }
    }
  } else if (to.path === '/' || to.path === '') {
    next({ name: 'login' });
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
