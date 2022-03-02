// tools.js
import Embed from '@editorjs/embed'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
// import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'
import PageTitle from '../../../../../pagetitle/page-title' // Custom made block. It renders a h1 and sets the h1 id to "page-title". An id is necessary for DOM manipulation to avoid the block getting removed by the end user.


export const EDITOR_JS_TOOLS = {
  // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
  // paragraph: Paragraph,
  embed: Embed,
  list: List,
  // code: Code,
  linkTool: LinkTool,
  // image: Image,
  // raw: Raw,
  header: { class: Header, config: { placeholder: 'Enter a header...', levels: [2, 3, 4], defaultLevel: 2 }, shortcut: 'CMD+SHIFT+H' },
  // quote: Quote,
  // marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
  pageTitle: PageTitle
}