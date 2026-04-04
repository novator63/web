import { createRouter, createWebHistory } from 'vue-router'

import EventsPage from '../pages/Events/EventsPage.vue'
import HomePage from '../pages/Home/HomePage.vue'
import LoginPage from '../pages/Login/LoginPage.vue'
import NotFoundPage from '../pages/NotFound/NotFoundPage.vue'
import RegisterPage from '../pages/Register/RegisterPage.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', name: 'home', component: HomePage },
		{ path: '/events', name: 'events', component: EventsPage },
		{ path: '/login', name: 'login', component: LoginPage },
		{ path: '/register', name: 'register', component: RegisterPage },
		{ path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
	],
})

export default router
