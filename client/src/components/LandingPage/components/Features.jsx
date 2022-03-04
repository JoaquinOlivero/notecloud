import { useEffect, useRef, useState } from 'react';
import './Features.scss'

function Features() {
    const [isVisibleWebImage, setVisibleWebImage] = useState(false);
    const [isVisibleMobile, setVisibleMobile] = useState(false);
    const [isVisiblePdf, setVisiblePdf] = useState(false);
    const [isVisibleSearch, setVisibleSearch] = useState(false);
    const [isVisibleShared, setVisibleShared] = useState(false);
    const [isVisibleNotification, setVisibleNotification] = useState(false);
    const webImageRef = useRef();
    const mobileRef = useRef();
    const pdfRef = useRef()
    const searchRef = useRef()
    const sharedRef = useRef()
    const notificationRef = useRef()

    //Lazy load images
    const [webImageUrl, setWebImageUrl] = useState(null)
    const [mobileUrls, setMobileUrls] = useState(null)
    const [pdfUrls, setPdfUrls] = useState(null)
    const [searchUrls, setSearchUrls] = useState(null)
    const [sharedUrls, setSharedUrls] = useState(null)
    const [notificationUrl, setNotificationUrl] = useState(null)


    useEffect(() => {
        const webImageObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting === true) {
                    setVisibleWebImage(true)
                    setWebImageUrl("https://res.cloudinary.com/chipi/image/upload/c_scale,h_528/v1646108591/home-web_ndpsbz.png")
                }

            });
        }, { root: null, threshold: [0.25] });

        const mobileObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting === true) {
                    setVisibleMobile(true)
                    setMobileUrls({ first: "https://res.cloudinary.com/chipi/image/upload/c_scale,h_550/v1646108608/home-mobile-2_l9qspm.png", second: "https://res.cloudinary.com/chipi/image/upload/c_scale,h_550/v1646108622/home-mobile-1_xyagwh.png" })
                }

            });
        }, { root: null, threshold: [0.25] });

        const pdfObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting === true) {
                    setVisiblePdf(true)
                    setPdfUrls({ first: "https://res.cloudinary.com/chipi/image/upload/c_scale,h_528/v1646169158/export_to_pdf_e0ej3u.png", second: "https://res.cloudinary.com/chipi/image/upload/c_scale,h_528/v1646169163/PDF_l7zefh.png" })
                }

            });
        }, { root: null, threshold: [0.15] });

        const searchObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting === true) {
                    setVisibleSearch(true)
                    setSearchUrls("https://imgur.com/mfH3e0b.gif")
                }

            });
        }, { root: null, threshold: [0.15] });

        const sharedObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting === true) {
                    setVisibleShared(true)
                    setSharedUrls({ first: "https://i.imgur.com/M2J7DIm.gif", second: "https://i.imgur.com/kV3AmNL.gif", third: "https://i.imgur.com/WCuKYvJ.gif" })
                }

            });
        }, { root: null, threshold: [0.15] });

        const notificationObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting === true) {
                    setVisibleNotification(true)
                    setNotificationUrl("https://i.imgur.com/OMb1I8w.gif")
                }

            });
        }, { root: null, threshold: [0.15] });

        webImageObserver.observe(webImageRef.current);
        mobileObserver.observe(mobileRef.current)
        pdfObserver.observe(pdfRef.current)
        searchObserver.observe(searchRef.current)
        sharedObserver.observe(sharedRef.current)
        notificationObserver.observe(notificationRef.current)


        return () => {
            webImageObserver.unobserve(webImageRef.current);
            mobileObserver.unobserve(mobileRef.current);
            pdfObserver.unobserve(pdfRef.current)
            searchObserver.unobserve(searchRef.current)
            sharedObserver.unobserve(sharedRef.current)
            notificationObserver.unobserve(notificationRef.current)
        }

    }, []);


    return (
        <div className='Features'>
            <div className='Features-devices' >

                <h2 style={{ opacity: `${isVisibleWebImage && '1'}` }}>Ready to be used in big and small screens</h2>
                <div className='Features-devices-images' >
                    <img src={webImageUrl} alt="" ref={webImageRef} id="web-image" className={isVisibleWebImage ? 'Features-devices-images-active-image' : ''} />
                    <div className={`Features-devices-mobile ${isVisibleMobile && 'Features-devices-mobile-active'}`} ref={mobileRef}>
                        <img src={mobileUrls ? mobileUrls.first : ''} alt="" className='mobile-image-1' />
                        <img src={mobileUrls ? mobileUrls.second : ''} alt="" className='mobile-image-2' />
                    </div>
                </div>
                <div className="Features-devices-left-bar">
                    <div className="Features-devices-top-right-bar-circle"></div>
                    <div className="Features-devices-bottom-right-bar-circle"></div>
                </div>
            </div>

            <div className="Features-pdf" ref={pdfRef}>
                <h2 style={{ opacity: `${isVisiblePdf && '1'}` }}>Export your notes to PDF</h2>
                <div className="Features-pdf-images" style={{ opacity: `${isVisiblePdf && '1'}` }}>
                    <img src={pdfUrls ? pdfUrls.first : ''} alt="" />
                    <img src={pdfUrls ? pdfUrls.second : ''} alt="" />
                </div>
            </div>

            <div className="Features-quicksearch" ref={searchRef} >
                <h2 style={{ opacity: `${isVisibleSearch && '1'}` }}>Quickly search through personal notes</h2>
                <img src={searchUrls && searchUrls} alt="" style={{ opacity: `${isVisibleSearch && '1'}`, transform: `${isVisibleSearch && 'translateX(0%)'}` }} />
                <div className="Features-quicksearch-left-bar">
                    <div className="Features-quicksearch-top-right-bar-circle"></div>
                    <div className="Features-quicksearch-bottom-right-bar-circle"></div>
                </div>
            </div>

            <div className="Features-shared" ref={sharedRef}>
                <h2 style={{ opacity: `${isVisibleShared && '1'}` }}>Create groups to simultaneously share notes!</h2>
                <div className="Features-shared-images" style={{ opacity: `${isVisibleShared && '1'}` }}>
                    <img src={sharedUrls ? sharedUrls.first : ''} alt="" />
                    <img src={sharedUrls ? sharedUrls.second : ''} alt="" />
                    <img src={sharedUrls ? sharedUrls.third : ''} alt="" />
                </div>
            </div>

            <div className="Features-notification" ref={notificationRef}>
                <h2 style={{ opacity: `${isVisibleNotification && '1'}` }}>Receive real time notifications</h2>
                <img src={notificationUrl && notificationUrl} alt="" style={{ opacity: `${isVisibleNotification && '1'}`, transform: `${isVisibleNotification && 'translateX(0%)'}` }} />
                <div className="Features-notification-left-bar">
                    <div className="Features-notification-top-right-bar-circle"></div>
                    <div className="Features-notification-bottom-right-bar-circle"></div>
                </div>
            </div>
        </div>
    )
}

export default Features