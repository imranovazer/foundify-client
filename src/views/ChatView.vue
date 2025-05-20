<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { MessageDto } from '@/types'
import { useUserStore } from '@/stores/user'
import { closeChatSession, getCachedChatHistory, getDbChatHistory, sendMessage } from '@/api'
import { Button } from 'primevue'

// const sessionId = uuidv4()
const sessionId = '3777dbd3-589d-4a99-8ae3-eeffcbd8e20f'
const route = useRoute()
const messages = ref<MessageDto[]>([])
const cachedMessages = ref<MessageDto[]>([])
const newMessage = ref('')
const allMessages = computed(() => [...messages.value, ...cachedMessages.value])
const isSending = ref(false)
let pollInterval: number | undefined

const user = useUserStore()

const getChatHistory = async () => {
  if (!user.user) return
  try {
    const res = await getDbChatHistory({
      userId1: user.user.id,
      userId2: route.params.with as string,
    })
    messages.value = res.data
  } catch (error) {
    console.error('Failed to fetch chat history:', error)
  }
}

const pollCachedMessages = async () => {
  try {
    const cached = await getCachedChatHistory(sessionId)
    cachedMessages.value = cached.data
  } catch (err) {
    console.error('Error polling cached messages:', err)
  }
}
onMounted(() => {
  localStorage.setItem('chatWith', route.params.with as string)
  pollInterval = setInterval(pollCachedMessages, 1500) // every 1 second
})

const handleSend = async () => {
  if (!newMessage.value.trim() || !user.user) return

  const message: MessageDto = {
    sender: user.user.id,
    receiver: route.params.with as string,
    content: newMessage.value.trim(),
    timestamp: new Date().toISOString(),
  }

  isSending.value = true
  try {
    await sendMessage(sessionId, message)
    await pollCachedMessages()
    newMessage.value = ''
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    isSending.value = false
  }
}

const endSession = async () => {
  try {
    await closeChatSession(sessionId, {
      userId1: user?.user?.id as string,
      userId2: localStorage.getItem('chatWith') as string,
    })
  } catch (error) {}
}

// Wait until user is available to fetch chat
watch(
  () => user.user?.id,
  (newUserId) => {
    if (newUserId) {
      getChatHistory()
    }
  },
  { immediate: true },
)
onUnmounted(() => {
  endSession()
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})
</script>

<template>
  <div class="chat-container">
    <div class="chat-history">
      <div v-if="allMessages.length === 0">No messages to display</div>
      <div
        v-for="(msg, index) in allMessages"
        :key="index"
        :class="`chat-message ${msg.sender === user.user?.id && 'justify-self-end'}`"
      >
        <strong>{{ msg.sender === user.user?.id ? 'You' : 'Partner' }}:</strong> {{ msg.content }}
      </div>
    </div>

    <form @submit.prevent="handleSend" class="chat-form">
      <input
        v-model="newMessage"
        placeholder="Type your message..."
        class="chat-input"
        :disabled="isSending"
      />
      <Button type="submit" :disabled="isSending || !newMessage.trim()">Send</Button>
    </form>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 500px;
  margin: 200px auto;
  padding: 1rem;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.chat-history {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
  padding: 0.5rem;
  border-radius: 4px;
}

.chat-message {
  margin-bottom: 0.5rem;
}

.chat-form {
  display: flex;
  gap: 0.5rem;
}

.chat-input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
