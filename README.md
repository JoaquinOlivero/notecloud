# NoteCloud

NoteCloud is a note taking web application. It has been built with **PostgreSQL**, **Express.js**, **React** and **Node.js**. 

**JSON Web Tokens** and secured cookies are used for authentication.

![notecloud](https://github.com/JoaquinOlivero/notecloud/blob/master/images/notecloudhome.png?raw=true)

## Features
The text editor used to take notes is **[Editor.js](https://editorjs.io)**, which is a Block-Styled editor. The on change listener built in Editor.js is used to save the notes to the database after the user is done typing. This listener is also used to share notes with other users in real-time using **[Socket.IO](https://socket.io/)**.

There is a user panel which is divided into **MY NOTES** (personal notes) and **SHARED NOTES**.

Notes and their children can be exported to PDF.

Real-time notification when added to group.

### My Notes

![My notes](https://github.com/JoaquinOlivero/notecloud/blob/master/images/my%20notes.png?raw=true)

The notes are called pages and they are implemented as a tree data structure. A page can have many children, these children can have more pages as children, and so on. 

A new main page (main node) can be added by clicking on the white 'plus' button. This will immediately add it to the list.

A page can be expanded to show children pages and can be collapsed to hide them. The 'plus' button next to the page will create a new child. The 'trash' button will delete the page and all of its children.

The **QUICK SEARCH** bar finds all the notes that contain whatever was searched, whether it is on the title or it is anywhere in the body of the note.


### Shared Notes
![Shared notes](https://github.com/JoaquinOlivero/notecloud/blob/master/images/shared-notes.png?raw=true)

![Add user](https://github.com/JoaquinOlivero/notecloud/blob/master/images/shared-notes-add-user.png?raw=true)

It is possible to share notes with other users in real-time. Users can create groups, add their friends and share notes simultaneously. 

### Export notes to PDF

**[React-pdf](https://react-pdf.org)** is used to export notes to PDF documents.  

![export-pdf](https://res.cloudinary.com/chipi/image/upload/c_scale,h_528/v1646169158/export_to_pdf_e0ej3u.png)

![exported-pdf](https://res.cloudinary.com/chipi/image/upload/c_scale,h_528/v1646169163/PDF_l7zefh.png)
