import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/browse',
      name: 'browse',
      component: () => import('../views/BrowseView.vue'),
    },
    {
      path: '/content/:type(tv|movie)/:id',
      name: 'detail',
      component: () => import('../views/DetailView.vue'),
    },
    {
      path: '/watch/:type(tv|movie)/:id/:episodeId?',
      name: 'player',
      component: () => import('../views/PlayerView.vue'),
    },
    {
      path: '/person/:id',
      name: 'person',
      component: () => import('../views/PersonView.vue'),
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: () => import('../views/WatchlistView.vue'),
    },
    // ----- Legacy redirects -----
    {
      path: '/show/:id',
      redirect: (to) => ({
        name: 'detail',
        params: { type: 'tv', id: to.params.id },
      }),
    },
    {
      path: '/watch/:showId(\\d+)/:episodeId?',
      redirect: (to) => ({
        name: 'player',
        params: {
          type: 'tv',
          id: to.params.showId,
          ...(to.params.episodeId ? { episodeId: to.params.episodeId } : {}),
        },
      }),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
