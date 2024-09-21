import { axios } from '@/lib/axios'
import { useStorage } from '@vueuse/core'
import { defineStore, acceptHMRUpdate } from 'pinia'

const csrf = () => axios.get('/sanctum/csrf-cookie')

export const useUsers = defineStore('users', {
    state: () => ({
        userData: useStorage('userData', []),
        authStatus: useStorage('authStatus', []),
    }),

    getters: {
        authUser: state => state.authStatus === 204,
        hasUserData: state => Object.keys(state.userData).length > 0,
        hasVerified: state =>
            Object.keys(state.userData).length > 0
                ? state.userData.email_verified_at !== null
                : false,
    },

    actions: {
        getData() {
            axios
                .get('/api/user')
                .then(response => {
                    this.userData = response.data
                })
                .catch(error => {
                    this.$reset()
                    this.userData = {}
                    this.authStatus = []
                    this.router.push({ name: 'login' })                    
                })
        },

        async login(form, setErrors, processing) {
            await csrf()
            processing.value = true
            axios
                .post('/login', form.value)
                .then(response => {
                    this.authStatus = response.status
                    processing.value = false

                    this.router.push({ name: 'dashboard' })
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                    processing.value = false
                })
        },

        async logout() {
            await csrf()
            await axios
                .post('/logout')
                .then(() => {
                    this.$reset()
                    this.userData = {}
                    this.authStatus = []

                    this.router.push({ name: 'login' })
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error
                })
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsers, import.meta.hot))
}
