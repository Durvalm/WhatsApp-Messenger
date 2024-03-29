import { useContext, useEffect, useState } from 'react'
import { api } from '../lib/axios'
import { AuthContext } from './AuthContext'
import {
  ChatType,
  ChatsContext,
  ChatsContextProviderProps,
  Messages,
  SelectedChatType,
} from './chatContextTypes'

export function ChatsContextProvider({ children }: ChatsContextProviderProps) {
  const { authenticatedUser } = useContext(AuthContext)

  const [chats, setChats] = useState<ChatType[]>([])
  const [selectedChat, setSelectedChat] = useState<SelectedChatType>()
  const currentChat = chats.find((chat) => chat.id === selectedChat?.id)
  const [messages, setMessages] = useState<Messages[]>([])

  // When users log in, this will populate the chats
  useEffect(() => {
    async function fetchPopulateChats() {
      try {
        const response = await api.get(`chats/get_all/${authenticatedUser?.id}`)
        setChats(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchPopulateChats()
  }, [authenticatedUser])

  // Set Messages for every Chat as soon as Chat is clicked (selectedChat is changed)
  useEffect(() => {
    if (!selectedChat) return
    async function fetchPopulateMessagesForChat() {
      const response = await api.get(
        `chats/get_messages/${authenticatedUser?.id}/${selectedChat?.id}`,
      )
      setMessages(response.data)
    }

    fetchPopulateMessagesForChat()
  }, [selectedChat, authenticatedUser])

  function addNewMessage(message: Messages) {
    const currentOpenedChat = messages[0]
    if (currentOpenedChat) {
      if (
        message.sender_id === currentOpenedChat.sender_id ||
        message.sender_id === currentOpenedChat.receiver_id
      ) {
        setMessages((state) => [...state, message])
      }
    }
    updateChats(message)
  }

  function updateChats(message: Messages) {
    let chatIndex = -1
    if (message.sender_id === authenticatedUser?.id) {
      chatIndex = chats.findIndex((chat) => chat.id === message.receiver_id)
    } else if (message.receiver_id === authenticatedUser?.id) {
      chatIndex = chats.findIndex((chat) => chat.id === message.sender_id)
    }

    if (chatIndex !== -1) {
      setChats((prevChats) => {
        const updatedChats = [...prevChats]
        const movedChat = updatedChats.splice(chatIndex, 1)[0]
        updatedChats.push({
          ...movedChat,
          last_message: message,
        })
        return updatedChats
      })
    } else {
      if (authenticatedUser?.id === message.receiver_id) {
        async function fetchUser() {
          const user = await api.get(`users/get/${message.sender_id}`)
          const userData = user.data.user
          setChats((prevChats) => [
            ...prevChats,
            { ...userData, last_message: message },
          ])
        }
        fetchUser()
      }
    }
  }

  function createChats(newChat: ChatType) {
    setChats((state) => [...state, newChat])
  }

  function selectCurrentChat(chatId: string) {
    setSelectedChat({ id: chatId })
  }

  return (
    <ChatsContext.Provider
      value={{
        chats,
        createChats,
        messages,
        currentChat,
        selectedChat,
        selectCurrentChat,
        addNewMessage,
      }}
    >
      {children}
    </ChatsContext.Provider>
  )
}
