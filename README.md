# Whammy

Think of this as an extension of Weppy, which takes WebP images and converts them into single frame WebM videos for rendering on platforms which do not support WebP natively. Only this time around, instead of taking a single static image and converting that into a single static video, you take a <canvas> element and use the browser's native mechanisms for exporting to WebP, and stitch them together into a working WebM video.

One caveat though, since it uses WebP exporting for canvas, it can't do VP8 interframe compression, only intraframe compression, that is, each subsequent frame doesn't get to reference the frames before it, which makes file size considerably larger.

