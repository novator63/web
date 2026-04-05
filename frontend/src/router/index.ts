import { createRouter, createWebHistory } from 'vue-router'

import EventsPage from '../pages/Events/EventsPage.vue'
import HomePage from '../pages/Home/HomePage.vue'
import LoginPage from '../pages/Login/LoginPage.vue'
import NotFoundPage from '../pages/NotFound/NotFoundPage.vue'
import RegisterPage from '../pages/Register/RegisterPage.vue'
import UsersPage from '../pages/Users/UsersPage.vue'

import { useAuthStore } from '../stores/authStore'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', name: 'home', component: HomePage },
		{ path: '/events', name: 'events', component: EventsPage },
		{ path: '/users', name: 'users', component: UsersPage },
		{ path: '/login', name: 'login', component: LoginPage },
		{ path: '/register', name: 'register', component: RegisterPage },
		{ path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
	],
})

router.beforeEach((to) => {
	const authStore = useAuthStore()
	authStore.syncAuthState()

	if (to.name === 'events' && !authStore.isAuthenticated) {
		return { name: 'login' }
	}

	if (to.name === 'users' && (!authStore.isAuthenticated || !authStore.isAdmin)) {
		return { name: 'events' }
	}

	if (to.name === 'login' && authStore.isAuthenticated) {
		return { name: 'events' }
	}

	return true
})

export default router
