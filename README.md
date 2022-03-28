# NoteCloud

NoteCloud is a note taking web application. It has been built with **PostgreSQL**, **Express.js**, **React**, **Sass** and **Node.js**. 

**JSON Web Tokens** and secured cookies are used for authentication. 

## Features
The text editor used to take notes is **[Editor.js](https://editorjs.io)**, which is a Block-Styled editor. The on change listener built in Editor.js allows to save the notes to the database every time the user is done typing. This listener is also used to share notes with other users in real time using **[Socket.IO](https://socket.io/)**.

There is a user panel which is divided into **MY NOTES** and **SHARED NOTES**.

### My Notes

![My notes](https://res.cloudinary.com/chipi/image/upload/v1648489851/notecloud-github/my_notes_pxyypx.png)

The notes are called pages and they are implemented as a tree data structure. A page can have many children, these children can have more pages as children, and so on. 

A new main page (main node) can be added by clicking on the white 'plus' button. This will immediately add it to the list.

A page can be expanded to show the children pages and can be collapsed to hide them. The 'plus' button next to the page will create a new child. The 'trash' button will delete the page and all of its children.
