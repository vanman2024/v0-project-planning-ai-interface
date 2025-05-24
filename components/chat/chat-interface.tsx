"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, type ChangeEvent } from "react"
import {
  Box,
  Flex,
  Text,
  IconButton,
  Avatar,
  VStack,
  HStack,
  Spinner,
  useToast,
  Button,
  Textarea,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
} from "@chakra-ui/react"
import { SendIcon, AttachmentIcon } from "@chakra-ui/icons"
import { useQuery, useMutation } from "@apollo/client"
import { GET_MESSAGES, SEND_MESSAGE } from "../../graphql/queries"
import { useAuth } from "../../contexts/AuthContext"
import type { MessageType } from "../../types"

interface ChatInterfaceProps {
  conversationId: string
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId }) => {
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const toast = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const { loading, error, data, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: { conversationId },
  })

  const [sendMessageMutation] = useMutation(SEND_MESSAGE)

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading messages",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }, [error, toast])

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: /* GraphQL */ `
        subscription MessageSent($conversationId: String!) {
          messageSent(conversationId: $conversationId) {
            id
            text
            sender {
              id
              username
            }
            createdAt
            fileUrl
          }
        }
      `,
      variables: { conversationId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newMessage = subscriptionData.data.messageSent
        return {
          messages: [...prev.messages, newMessage],
        }
      },
    })

    return () => unsubscribe()
  }, [subscribeToMore, conversationId])

  useEffect(() => {
    // Scroll to the bottom when messages load or a new message arrives
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [data])

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() && !selectedFile) return

    try {
      let fileUrl = null
      if (selectedFile) {
        // Upload file logic (replace with your actual upload mechanism)
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("upload_preset", "your_upload_preset") // Replace with your Cloudinary upload preset
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace with your Cloudinary cloud name
          {
            method: "POST",
            body: formData,
          },
        )
        const data = await response.json()
        fileUrl = data.secure_url
      }

      await sendMessageMutation({
        variables: {
          conversationId,
          text: newMessage,
          fileUrl: fileUrl,
        },
      })

      setNewMessage("")
      setSelectedFile(null)
      setFilePreview(null)
      onClose() // Close the modal after sending
    } catch (err: any) {
      toast({
        title: "Error sending message",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }, [conversationId, newMessage, sendMessageMutation, toast, selectedFile, onClose])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFilePreview(URL.createObjectURL(file))
      onOpen() // Open the modal when a file is selected
    }
  }

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
  }

  return (
    <Flex direction="column" height="100%" bg="gray.50">
      {/* Chat Header */}
      <Flex bg="white" p={4} borderBottom="1px solid" borderColor="gray.200" align="center">
        <Avatar size="sm" name="Recipient Name" src="" mr={3} />
        <Text fontWeight="medium">Recipient Name</Text>
      </Flex>

      {/* Message Area */}
      <Box flex={1} p={4} overflowY="auto">
        {loading ? (
          <Flex justify="center" align="center" height="100%">
            <Spinner size="lg" />
          </Flex>
        ) : error ? (
          <Text color="red">Error: {error.message}</Text>
        ) : (
          <VStack align="start" spacing={4}>
            {data?.messages?.map((message: MessageType) => (
              <Flex
                key={message.id}
                direction="column"
                alignItems={message.sender.id === user?.id ? "end" : "start"}
                width="100%"
              >
                <HStack
                  bg={message.sender.id === user?.id ? "blue.100" : "gray.100"}
                  p={3}
                  borderRadius="md"
                  maxWidth="70%"
                  align="start"
                >
                  <Text>{message.text}</Text>
                  {message.fileUrl && (
                    <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={message.fileUrl || "/placeholder.svg"}
                        alt="Attachment"
                        boxSize="50px"
                        objectFit="cover"
                      />
                    </a>
                  )}
                </HStack>
                <Text fontSize="xs" color="gray.500">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Text>
              </Flex>
            ))}
            <div ref={chatBottomRef} />
          </VStack>
        )}
      </Box>

      {/* Message Input Area */}
      <Flex bg="white" p={4} borderTop="1px solid" borderColor="gray.200" align="center">
        <EnhancedMessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSendMessage}
          onFileSelect={handleFileSelect}
          placeholder="Type a message..."
        />
      </Flex>

      {/* File Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Attachment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {filePreview && <Image src={filePreview || "/placeholder.svg"} alt="Selected File" maxWidth="100%" />}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleRemoveSelectedFile}>
              Remove
            </Button>
            <Button colorScheme="blue" onClick={handleSendMessage}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

interface EnhancedMessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onFileSelect: (files: File[]) => void
  placeholder?: string
}

const EnhancedMessageInput: React.FC<EnhancedMessageInputProps> = ({
  value,
  onChange,
  onSend,
  onFileSelect,
  placeholder = "Type a message...",
}) => {
  return (
    <Flex align="center" width="100%">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        size="sm"
        mr={3}
        flex={1}
        resize="none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onSend()
          }
        }}
      />
      <input
        type="file"
        id="file-upload"
        style={{ display: "none" }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const files = Array.from(e.target.files || [])
          onFileSelect(files)
        }}
      />
      <label htmlFor="file-upload">
        <IconButton aria-label="Attach file" icon={<AttachmentIcon />} colorScheme="gray" variant="ghost" mr={3} />
      </label>
      <IconButton aria-label="Send message" icon={<SendIcon />} colorScheme="blue" onClick={onSend} />
    </Flex>
  )
}

export default ChatInterface
