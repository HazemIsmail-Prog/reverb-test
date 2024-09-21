<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useUsers } from '../stores/user'
import { axios } from '../lib/axios'
import TextInput from '@/components/TextInput.vue'
import { useEcho } from '../stores/echo'

const echoStore = useEcho()
const authStore = useUsers()

const messages = ref([])

const message = ref('')

const messagesContainer = ref(null)

const scrollToBottom = isSmooth => {
    if (messagesContainer.value) {
        if (isSmooth) {
            messagesContainer.value.classList.add('scroll-smooth')
        }
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        if (isSmooth) {
            messagesContainer.value.classList.remove('scroll-smooth')
        }
    }
}

const getMessages = () => {
    axios.get('api/messages').then(async response => {
        messages.value = response.data
        await nextTick()
        scrollToBottom(false)
    })
}

const handleSubmit = () => {
    axios
        .post('api/messages', {
            receiver_id: authStore.userData.id == 1 ? 2 : 1,
            message: message.value,
        })
        .then(async response => {
            message.value = ''
            messages.value.push(response.data)
            await nextTick()
            scrollToBottom(true)
        })
}

let channelConnected = false

watch(
    () => authStore.userData,
    async userData => {
        if (userData?.id && !channelConnected) {
            echoStore.initializeEcho()
            channelConnected = true // Set the flag to true to prevent further connections
            console.log(`Subscribing to chat.${userData.id}`)
            echoStore.echoInstance
                .private(`chat.${userData.id}`)
                .listen('MessageSent', async event => {
                    console.log('Message received: ', event.message)
                    messages.value.push(event.message)
                    await nextTick()
                    scrollToBottom(true)
                })
        }
    },
)

onMounted(() => {
    getMessages()
})
</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Dashboard
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 bg-white border-b border-gray-200">
                        <div
                            ref="messagesContainer"
                            v-if="messages.length > 0"
                            class="flex flex-col gap-3 h-96 overflow-y-auto">
                            <div v-for="message in messages" :key="message.id">
                                <div
                                    class="rounded-lg w-fit max-w-[80%] py-2 px-4"
                                    :class="{
                                        'text-end bg-gray-300 ms-auto':
                                            message.sender_id !=
                                            authStore.userData.id,
                                        'text-start bg-green-300 me-auto':
                                            message.sender_id ==
                                            authStore.userData.id,
                                    }">
                                    {{ message.message }}
                                </div>
                            </div>
                        </div>
                        <div
                            class="flex justify-center items-center h-96"
                            v-else>
                            No messages yet.
                        </div>
                        <form
                            class="flex items-center gap-3"
                            @submit.prevent="handleSubmit">
                            <TextInput
                                ref="messageInput"
                                v-model="message"
                                type="text"
                                class="mt-1 block w-full"
                                required
                                autofocus
                                 />
                            <button type="submit">send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
