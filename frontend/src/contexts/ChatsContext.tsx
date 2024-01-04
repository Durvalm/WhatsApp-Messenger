import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { api } from '../lib/axios'
import { AuthContext } from './AuthContext'

export interface Messages {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  timestamp: Date
}

export interface ChatType {
  id: number
  name: string
  email: string
  picture_filename: string
  lastMessage?: Messages
}

interface SelectedChatType {
  id: number
}

interface ChatsContextType {
  chats: ChatType[]
  selectedChat?: SelectedChatType
  messages: Messages[]
  currentChat?: ChatType
  createChats: (newChat: ChatType) => void
  selectCurrentChat: (chatId: number) => void
  addNewMessage: (currentText: string) => void
}

interface ChatsContextProviderProps {
  children: ReactNode
}

export const ChatsContext = createContext({} as ChatsContextType)

export function ChatsContextProvider({ children }: ChatsContextProviderProps) {
  const { authenticatedUser } = useContext(AuthContext)

  const [chats, setChats] = useState<ChatType[]>([])
  const [selectedChat, setSelectedChat] = useState<SelectedChatType>()
  const currentChat = chats.find((chat) => chat.id === selectedChat?.id)
  const [messages, setMessages] = useState<Messages[]>([])

  // When users log in, this will populate the chats by retrieving
  // all chats users has had
  useEffect(() => {
    async function fetchPopulateChats() {
      try {
        const response = await api.get(`chats/get_all/${authenticatedUser?.id}`)
        // console.log(response.data)
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
      console.log(response.data)
    }

    fetchPopulateMessagesForChat()
  }, [selectedChat, authenticatedUser])

  function addNewMessage(currentText: string) {
    console.log('New Message')
    const newMessage = {
      text: currentText,
      chatId: currentChat?.id || 0,
      date: new Date(),
    }
    setMessages((state) => [...state, newMessage])
    setChats((state) =>
      state.map((chat) =>
        chat.id === currentChat?.id
          ? { ...chat, lastMessage: newMessage }
          : chat,
      ),
    )
  }

  function createChats(newChat: ChatType) {
    setChats((state) => [...state, newChat])
  }

  function selectCurrentChat(chatId: number) {
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
