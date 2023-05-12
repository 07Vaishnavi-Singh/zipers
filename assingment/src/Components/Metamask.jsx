import { useState, useEffect } from 'react';
import ModelViewer from '@metamask/logo';
import "../Style/Loading.css"

function Logo() {
    const [viewer, setViewer] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('Logo component mounted on the client-side');

            const logoViewer = ModelViewer({
                pxNotRatio: true,
                width: 500,
                height: 400,
                followMouse: false,
                slowDrift: false,
            });

            logoViewer.lookAt({ x: 100, y: 100 });
            logoViewer.setFollowMouse(true);

            setViewer(logoViewer);

            return () => logoViewer.stopAnimation();
        }
    }, []);

    return (
        <div id="logo-container" ref={(el) => el && viewer && el.appendChild(viewer.container)} />
    );
}

export default Logo;
