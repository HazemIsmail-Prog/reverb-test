import { defineStore } from 'pinia'
import { axios } from '@/lib/axios'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// window.Pusher = Pusher

export const useEcho = defineStore('echo', {
    state: () => ({
        echoInstance: null,
    }),
    actions: {
        initializeEcho() {
            if (!this.echoInstance) {
                this.echoInstance = new Echo({
                    broadcaster: 'reverb',
                    key: import.meta.env.VITE_PUBLIC_REVERB_APP_KEY,
                    authorizer: channel => {
                        return {
                            authorize: async (socketId, callback) => {
                                await axios.get('/sanctum/csrf-cookie')
                                axios
                                    .post('/api/broadcasting/auth', {
                                        socket_id: socketId,
                                        channel_name: channel.name,
                                    })
                                    .then(response => {
                                        callback(false, response.data)
                                    })
                                    .catch(error => {
                                        callback(true, error)
                                    })
                            },
                        }
                    },
                    wsHost: import.meta.env.VITE_PUBLIC_REVERB_HOST,
                    wsPort: import.meta.env.VITE_PUBLIC_REVERB_PORT ?? 80,
                    wssPort: import.meta.env.VITE_PUBLIC_REVERB_PORT ?? 443,
                    forceTLS:
                        (import.meta.env.VITE_PUBLIC_REVERB_SCHEME ??
                            'https') === 'https',
                    enabledTransports: ['ws', 'wss'],
                })
            }
        },
    },
})
