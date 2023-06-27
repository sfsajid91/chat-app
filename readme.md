# MERN Realtime Chat Application

A Realtime Chat Application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) using Socket.IO for real-time communication. Users can create accounts and chat with others in real-time. The application also provides Google OAuth for seamless login with Google accounts.

## Features

-   **User Registration:** Users can create accounts to access the chat application.
-   **Google OAuth:** Users can log in using their Google accounts for a seamless login experience.
-   **Realtime Chat:** Users can send and receive messages in real-time with other users.
-   **Conversations:** Users can view and participate in multiple conversations.
-   **Message History:** Chat history is saved and can be accessed within conversations.

## Technology Used

-   **MongoDB:** NoSQL database for storing user data and chat history.
-   **Express.js:** Web application framework for building the server-side application.
-   **React.js:** JavaScript library for building the user interface.
-   **Node.js:** JavaScript runtime environment for server-side development.
-   **Socket.IO:** Library for enabling real-time, bidirectional communication between clients and the server.
-   **Redux.js:** State management library for managing application state.
-   **Ant Design:** UI library for creating beautiful and responsive user interfaces.
-   **Tailwind Css:** An awesome css library.
-   **Google OAuth:** Authentication mechanism for allowing users to log in with their Google accounts.

## Installation

1. Clone the repository:

```
git clone https://github.com/sfsajid91/chat-app.git

```

2. Install dependencies for both the server and client:

```
cd chat-app/server
yarn

cd ../client
yarn
```

3. Set up environment variables:

    - Rename the `.env.example` file in the server directory to `.env`.
    - Provide the necessary values for the environment variables in the `.env` file, including the MongoDB connection string and Google OAuth credentials.

4. Start the server and client:

```
cd ../server
yarn dev

cd ../client
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173` to access the application.

## Usage

1. Register a new account using the registration form or log in with your Google account.
2. Once logged in, you will be redirected to the chat application.
3. In the chat application, you can see the list of conversations on the left panel.
4. Select a conversation to view and participate in the chat.
5. Start sending messages and see them appear in real-time.
6. You can switch between conversations to participate in multiple chats simultaneously.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## Acknowledgements

-   The project was inspired by [Socket.IO Chat Example](https://socket.io/get-started/chat/) and adapted for the MERN stack.
-   Thanks to the developers of MongoDB, Express.js, React.js, Node.js, Socket.IO, Redux.js, and Ant Design for their excellent libraries and tools.

## Contact

For any inquiries or questions, you can reach out to me at [sfsajid91@gmail.com](mailto:sfsajid91@gmail.com).
