import './ExportPdf.scss'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import edjsHTML from 'editorjs-html'
import { Document, Page, pdf, Text, Image, StyleSheet, View, Font } from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import Rubik from '../../../assets/fonts/Rubik-Regular.ttf'

function ExportPdf({ userNotes }) {
    // const [instance, updateInstance] = usePDF({ document: MyDoc });
    let { id, notebookUuid } = useParams();
    const uuid = id.substring(id.length - 36) //This uuid belongs to the uuid that shows up in the url
    const [testBlocks, setTestBlocks] = useState(null)

    const handleMouseEnterAdd = () => {
        const addSpan = document.getElementById('exp-pdf')
        addSpan.classList.remove('display-none')
        addSpan.classList.add('display-block')
        // addSpan.setAttribute('style', 'opacity: 1')
        setTimeout(() => {
            addSpan.setAttribute('style', 'opacity: 1')
        }, 20);
    }

    const handleMouseLeaveAdd = () => {
        const addSpan = document.getElementById('exp-pdf')
        addSpan.setAttribute('style', 'opacity: 0')

        // addSpan.setAttribute('style', 'opacity: 0')
        setTimeout(() => {
            addSpan.classList.remove('display-block')
            addSpan.classList.add('display-none')
        }, 50);
    }

    // This function gets all the blocks of the requested pages
    const getPageBlocks = async (tree, target) => {

        const blocks = []
        // for (const node of tree[0].pages) {
        for (const node of tree) {

            if (node.uuid === target && node.sub_pages.length > 0) {
                const nodeBlocks = node.blocks
                blocks.push(nodeBlocks)
                const childBlocks = (child) => {

                    for (const leaf of child) {
                        const leafBlocks = leaf.blocks
                        blocks.push(leafBlocks)
                        if (leaf.sub_pages.length > 0) {
                            childBlocks(leaf.sub_pages)
                        }
                    }
                }
                childBlocks(node.sub_pages)

            } else if (node.uuid === target) {
                const nodeBlocks = node.blocks
                blocks.push(nodeBlocks)
            } else {
                function searchTree(element, matchingUuid) {
                    if (element.uuid === matchingUuid && element.sub_pages.length > 0) {
                        const nodeBlocks = element.blocks
                        blocks.push(nodeBlocks)
                        const childBlocks = (child) => {
                            for (const leaf of child) {
                                const leafBlocks = leaf.blocks
                                blocks.push(leafBlocks)
                                if (leaf.sub_pages.length > 0) {
                                    childBlocks(leaf.sub_pages)
                                }
                            }
                        }

                        childBlocks(element.sub_pages)
                    } else if (element.uuid !== matchingUuid && element.sub_pages.length > 0) {
                        var i;
                        var result = null;
                        for (i = 0; result == null && i < element.sub_pages.length; i++) {
                            result = searchTree(element.sub_pages[i], matchingUuid);
                        }
                        return result;
                    } else if (element.uuid === matchingUuid) {
                        const nodeBlocks = element.blocks
                        blocks.push(nodeBlocks)

                    }
                }
                searchTree(node, uuid);
            }
        }

        return blocks;
    }

    const handleExportPdf = async () => {

        const res = await axios.post('/notes/data', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })



        const convertBlockToHtml = async (notes, uuid, sharedNoteTitle) => {

            const blocks = await getPageBlocks(notes, uuid)

            function customParserForPageTitle({ data }) {
                return `<h1> ${data.text} </h1>`
            }

            function customParserForSimpleImage({ data }) {
                return `<div class='image'><img src="${data.url}"></div>`
            }

            const customParserForDelimiter = (data) => {
                return `<div class='delimiter'>* * *</div>`
            }
            const edjsParser2 = edjsHTML({ pageTitle: customParserForPageTitle, simpleImage: customParserForSimpleImage, delimiter: customParserForDelimiter });

            const pagesHtmlArray = []
            for (const page of blocks) {
                // //styling for pdf
                const style = ['<style> *{width: 96%; margin-left: auto; margin-right: auto;} h1{text-align: center;} p{font-size: 12px; margin-top: 14px; margin-bottom: 0px;} .delimiter{font-size: 28px; opacity: 0.6; text-align: center; width: 100%; margin: 16px auto;}</style>']

                //
                const obj = {}
                obj.blocks = page
                const pageToHtml = edjsParser2.parse(obj)
                const pageToHtmlStyle = style.concat(pageToHtml)
                const pageToHtmlJoined = pageToHtmlStyle.join('\n')
                pagesHtmlArray.push(pageToHtmlJoined)
            }



            const renderSwitch = (block, index) => {
                switch (block.type) {
                    case 'pageTitle':
                        const titleText = block.data.text.replace(/&nbsp;/g, ' ')
                        const titleContent = <Text style={styles.pageTitle} key={index}>{titleText}</Text>
                        return titleContent
                    case 'paragraph':
                        const pText = block.data.text.replace(/&nbsp;/g, ' ')
                        const paragraphContent = <Text style={styles.paragraph} key={index}>{pText}</Text>
                        return paragraphContent
                    case 'simpleImage':
                        const simpleImageContent = <Image style={styles.simpleImage} src={block.data.url} key={index} />
                        return simpleImageContent
                    case 'header':
                        const hText = block.data.text.replace(/&nbsp;/g, ' ')
                        const headerContent = <Text style={styles.header} key={index}>{hText}</Text>
                        return headerContent
                    default:
                    // do nothing yet...
                }
            }
            // Register font
            Font.register({ family: 'Rubik', src: Rubik });
            const styles = StyleSheet.create({
                section: {
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'Rubik',
                    margin: '10px 0',
                    width: '96vw',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                },
                pageTitle: {
                    fontSize: '24px',
                    textAlign: 'center',
                },
                paragraph: {
                    fontSize: '12px',
                    marginTop: '7px',
                    marginBottom: '7px'
                },
                simpleImage: {
                    margin: '10px 0',
                    alignSelf: 'center',
                }

            })

            const MyDoc = (
                <Document>
                    {blocks.map((page, index) => {
                        return <Page size='A4' key={index} style={styles.page}>
                            <View style={styles.section}>
                                {page.map((block, index) => {
                                    return renderSwitch(block, index)
                                })}
                            </View>
                        </Page>
                    })}
                </Document>
            );

            try {
                const blob = await pdf(MyDoc).toBlob();
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                if (!sharedNoteTitle) {
                    const pageTitle = id.substring(0, id.length - 37) // Get page title from url
                    link.download = `${pageTitle}-${+new Date()}.pdf`;
                    link.click()
                } else {
                    const pageTitle = notes[0].blocks[0].data.text
                    link.download = `${sharedNoteTitle}-${pageTitle}-${+new Date()}.pdf`;
                    link.click()
                }
            } catch (error) {
                console.log(error);
            }


        }

        if (!notebookUuid) {
            const notes = res.data[0]
            convertBlockToHtml(notes, id)
        } else {
            const notes = res.data[1]
            const filterPage = notes.filter(page => page.uuid === notebookUuid)
            // console.log(filterPage[0].pages)
            convertBlockToHtml(filterPage[0].pages, notebookUuid, filterPage[0].title)
        }


    }



    return <div className='ExportPdf'>
        <div className='ExportPdf-icon'>
            <PictureAsPdfIcon onMouseEnter={() => handleMouseEnterAdd()} onMouseLeave={() => handleMouseLeaveAdd()} onClick={() => handleExportPdf()} id='ExportPdf-btn' />


        </div>
        <span id='exp-pdf' className='display-none'>Export page as PDF</span>
    </div>;
}



export default ExportPdf;